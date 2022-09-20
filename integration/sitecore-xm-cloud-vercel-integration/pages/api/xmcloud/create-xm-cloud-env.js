import { PowerShell } from "full-powershell";
import path from "path";
import fs from "fs";
import {
  sendErrorMessage,
  sendSuccessMessage,
  sendInfoMessage,
} from "../../../lib/pusher/pusher-helper";

export default async function createXMCloudEnv(req, res) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  // Navigate to Project Folder
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + req.query.projectid
  );
  let environmentId = req.query.environmentId;
  const projectId = req.query.projectid;
  if (!projectId && projectId.length == 0) {
    res.status(200).json("Project Id is undefined - stopping xm cloud creationg");
  } else {
    try {
      const powershell = new PowerShell({
        tmp_dir: process.env.PWSH_LOG_FOLDER ?? "C:\\log\\",
        timeout: 12000000,
        exe_path: "pwsh",
      });
      console.log("create-xm-cloud-env.js ----> localpath: " + localPath);
      sendInfoMessage(projectId, "Connecting with repository");
      const navigate = `Set-Location -Path ${localPath}`;
      await powershell
        .call(navigate, "string")
        .promise()
        .then(
          (result) => {
            sendSuccessMessage(projectId, "Set-Location to cloned Repo");
            console.log(result.success);
          },
          (err) => {
            sendErrorMessage(projectId, "Set-Location to cloned Repo :: ERROR");
            console.error(err);
          }
        );

      // Create env file
      fs.copyFile(
        `${localPath}` + "\\.env.template",
        `${localPath}` + "\\.env",
        (err) => {
          if (err) throw err;
          console.log(
            "create-xm-cloud-env.js ----> localpath: .env file created"
          );
          sendInfoMessage(projectId, "Localpath: .env file created");
        }
      );

      if (environmentId === undefined) {
        sendInfoMessage(projectId, "Process ::  Creation of new Project and Environment");
        // Project Create
        const projectCreationPs = `dotnet sitecore cloud project create -n ${req.query.projectname}`;
        let environmentCreationPs;
        const resultProjectCreation = await powershell
          .call(projectCreationPs, "string")
          .promise()
          .then(
            (result) => {
              environmentCreationPs = result.success?.pop();
              console.log(
                "create-xm-cloud-env.js ----> environmentCreationPs : " +
                environmentCreationPs
              );
              sendSuccessMessage(projectId, `Command : ${projectCreationPs} : ${req.query.projectname} -> Succeeded`);
            },
            (err) => {
              sendErrorMessage(projectId, `Command :  ${projectCreationPs} : ${req.query.projectname} :: Failed, with error ${err}`);
              console.error(err);
            }
          );

        // Environment Create
        environmentCreationPs = String(environmentCreationPs)
          .replace("<environment-name>", req.query.environmentName)
          .trim();
        environmentCreationPs = environmentCreationPs.replace(/(?:\\[rn])+/g, "");

        const envResult = await powershell
          .call(environmentCreationPs, "string")
          .promise()
          .then(
            (result) => {
              environmentId = extractEnvironmentId(result.success.pop());
              console.log(
                "create-xm-cloud-env.js ----> environmentId : " + environmentId
              );
              sendSuccessMessage(projectId, `Command : ${environmentCreationPs} :: Succeed, Environment Id --> ${environmentId}`);
            },
            (err) => {
              sendErrorMessage(projectId, `Command : ${environmentCreationPs} ${req.query.environmentName} :: Failed, with error ${err}`);
              console.error(err);
            }
          );
      }

      // Processing the build Json File
      let editingSecret;
      if (fs.existsSync(`${localPath}` + "\\xmcloud.build.json")) {
        var buildFileJson = JSON.parse(
          fs.readFileSync(`${localPath}` + "\\xmcloud.build.json")
        );
        console.log(buildFileJson);
        const domainName = req.query.domain;
        const rootDirectory = req.query.rootDirectory;
        const renderingHost = buildFileJson.renderingHosts;
        for (var key in renderingHost) {
          console.log(
            "create-xm-cloud-env.js ---->  buildjson path",
            buildFileJson.renderingHosts[key]?.path.toLowerCase()
          );
          editingSecret = buildFileJson.renderingHosts[key]?.jssDeploymentSecret;
          if (
            buildFileJson.renderingHosts[key]?.path
              .toLowerCase()
              .indexOf(rootDirectory.toLowerCase()) >= 0
          ) {
            const envVariable = `${key.toUpperCase()}_RENDERING_HOST_ENDPOINT_URL`;
            // fs.appendFileSync(
            //   `${localPath}` + "\\.env",
            //   "\n" + `${envVariable}=${domainName}`
            // );
            // fs.closeSync(appFile, (err) => {
            //   if (err)
            //     console.error('Failed to close file', err);
            //   else {
            //     console.log("\n> Env File Closed successfully");
            //   }
            // });
            sendInfoMessage(projectId, `Adding ENV variable for the Site ${envVariable}=${domainName}`);
          }
        }
      }
      // Update the Jss Editing Secret
      console.log(
        "create-xm-cloud-env.js ----> jssEditingSecret : " + editingSecret
      );
      sendInfoMessage(projectId, `Updating JSS Editing secret in ENV file.`);
      fs.readFile(`${localPath}` + "\\.env", "utf-8", (err, contents) => {
        if (err) {
          console.log("WriteFile error:", err);
          return;
        }
        // Replace string occurrences
        const updatedEnvContent = contents.replace(
          /JSS_EDITING_SECRET=/gi,
          `JSS_EDITING_SECRET=${editingSecret}`
        );
        // Write back to file
        fs.writeFile(
          `${localPath}` + "\\.env",
          updatedEnvContent,
          "utf-8",
          (err2) => { console.log("WriteFile error:", err2); }
        );
      });



      // XM Default Deployment
      const deploymentPs = `dotnet sitecore cloud deployment create --environment-id ${environmentId} --upload --json`;
      sendInfoMessage(projectId, `Deploy will start in a moment:: ${deploymentPs}, Please sit back and sip your coffee. It can take more than 10 mins`);
      const deloyResult = await powershell
        .call(deploymentPs, "string")
        .promise()
        .then(
          (result) => {
            console.log(
              "create-xm-cloud-env.js ----> Deployment Status : " + result.success
            );
            sendInfoMessage(projectId, `Executed :: ${deploymentPs}, Succeeded, ${result.success}`);
          },
          (err) => {
            sendErrorMessage(projectId, `Executed :: ${deploymentPs}, caused Error ${err}`);
            console.error(err);
          }
        );

      // Connect to the Env
      const connectEnvPs = `dotnet sitecore cloud environment connect -id ${environmentId} --allow-write`;
      sendInfoMessage(projectId, `Connecting to newly created XM Environment:: ${connectEnvPs}`);
      await powershell
        .call(connectEnvPs, "string")
        .promise()
        .then(
          (result) => {
            console.log(
              "create-xm-cloud-env.js ----> Connected to the Env : " +
              result.success
            );
            sendSuccessMessage(projectId, `Connection with XM Cloud Environment Established`);
          },
          (err) => {
            sendErrorMessage(projectId, `Connection with XM Cloud Environment Failed.`);
            console.error(err);
          }
        );

      // Publish to Edge
      const edgePushPs = `dotnet sitecore publish --pt Edge -n ${req.query.environmentName}`;
      sendInfoMessage(projectId, `Starting Publish to Experience Edge:: ${edgePushPs}`);
      await powershell
        .call(edgePushPs, "string")
        .promise()
        .then(
          (result) => {
            console.log(
              "create-xm-cloud-env.js ----> edgePushPs Status " + result.success
            );
            sendSuccessMessage(projectId, `Publish to Experience Edge Completed:: ${result.success}`);
          },
          (err) => {
            sendErrorMessage(projectId, `Publish to Experience Edge Completed with Error :: ${err}`);
            console.error(err);
          }
        );

      // Create Edge Token
      // The hard-coded path to be removed
      const edgeTokenPs = `(Get-Content "${localPath}\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
      sendInfoMessage(projectId, `Creating Experience Edge Token`);
      let accessToken;
      await powershell
        .call(edgeTokenPs, "json")
        .promise()
        .then(
          (result) => {
            accessToken = result.success;
            sendSuccessMessage(projectId, `Creating Experience Edge Token :: SUCCEEDED`);
          },
          (err) => {
            sendErrorMessage(projectId, `Creating Experience Edge Token :: Failed ${err}`);
            console.error(err);
          }
        );

      console.log(
        "create-xm-cloud-env.js ----> User Access Token " + accessToken
      );
      console.log(
        `create-xm-cloud-env.js ----> Token API Path ${process.env.XM_CLOUD_DEPLOY_API_URL}api/environments/v1/${environmentId}/obtain-edge-token`
      );
      sendInfoMessage(projectId, `Fetching Experience Edge Access Token`);
      const result = await fetch(
        `${process.env.XM_CLOUD_DEPLOY_API_URL}api/environments/v1/${environmentId}/obtain-edge-token/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: "GET",
        }
      );
      const body = await result.json();
      const edgeAccessToken = body.apiKey;
      sendInfoMessage(projectId, `Fetching Experience Edge Access Token :: Succeded`);
      console.log(
        "create-xm-cloud-env.js ---->  Edge Access Token " + body.apiKey
      );
      const resultEnvVariables = await fetch(
        `${process.env.HOST}/api/vercel/create-xmcloud-env-variable-for-project?projectId=${req.query.projectid}&JSSEditingSecret=${editingSecret}&SitecoreApiKey=${edgeAccessToken}`,
        {
          headers: req.headers,
        }
      );
      sendSuccessMessage(projectId, `Updating env variables in Vercel Succeeded ! You'll be redirected to Vercel Clone page shortly.`);
      const varResJson = await resultEnvVariables.json();
      console.log(varResJson);
      powershell.destroy();
      res.status(200).json(body);
    } catch (error) {
      console.log(error);
    } finally {
      //remove cloned project
      fs.rmSync(localPath, { recursive: true, force: true });
    }
  }

}

function extractEnvironmentId(result) {
  const subString = result.substring(
    result.indexOf("--environment-id") + 16,
    String(result).length
  );
  return subString.replace(/\s/g, "");
}
