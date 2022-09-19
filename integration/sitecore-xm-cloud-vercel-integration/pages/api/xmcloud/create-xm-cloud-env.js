import { PowerShell } from "full-powershell";
import path from "path";
import fs from "fs";
import os from "os";

export default async function createXMCloudEnv(req, res) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  // Navigate to Project Folder
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + req.query.projectid
  );
  let environmentId = req.query.environmentId;
  try {
    const powershell = new PowerShell({
      tmp_dir: process.env.PWSH_LOG_FOLDER ?? "C:\\log\\",
      timeout: 12000000,
      exe_path: "pwsh",
    });
    console.log("create-xm-cloud-env.js ----> localpath: " + localPath);
    const navigate = `Set-Location -Path ${localPath}`;
    await powershell
      .call(navigate, "string")
      .promise()
      .then(
        (result) => {
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            { message: "Set-Location to cloned Repo", status: "200" }
          );
          console.log(result.success);
        },
        (err) => {
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            { message: "Set-Location to cloned Repo :: ERROR", status: "500" }
          );
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
        axios.post(
          `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
          { message: "Localpath: .env file created", status: "200" }
        );
      }
    );

    if (environmentId === undefined) {
      axios.post(
        `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
        {
          message: "Process ::  Creation of new Project and Environment",
          status: "200",
        }
      );
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
            axios.post(
              `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
              {
                message: `Command : ${projectCreationPs} : ${req.query.projectname} -> Succeeded`,
                status: "200",
              }
            );
          },
          (err) => {
            axios.post(
              `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
              {
                message: `Command :  ${projectCreationPs} : ${req.query.projectname} :: Failed, with error ${err}`,
                status: "500",
              }
            );
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
            axios.post(
              `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
              {
                message: `Command : ${environmentCreationPs} :: Succeed, Environment Id --> ${environmentId}`,
                status: "200",
              }
            );
          },
          (err) => {
            axios.post(
              `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
              {
                message: `Command : ${environmentCreationPs} ${req.query.environmentName} :: Failed, with error ${err}`,
                status: "500",
              }
            );
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
          fs.appendFileSync(
            `${localPath}` + "\\.env",
            "\n" + `${envVariable}=${domainName}`
          );
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Adding ENV variable for the Site ${envVariable}=${domainName}`,
              status: "200",
            }
          );
        }
      }
    }

    // Update the Jss Editing Secret
    console.log(
      "create-xm-cloud-env.js ----> jssEditingSecret : " + editingSecret
    );
    fs.readFile(`${localPath}` + "\\.env", "utf-8", (err, contents) => {
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
        (err2) => {}
      );
    });

    // XM Default Deployment
    const deploymentPs = `dotnet sitecore cloud deployment create --environment-id ${environmentId} --upload --json`;
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      {
        message: `Deploy will start in a moment:: ${deploymentPs}, Please sit back and sip your coffee. It can take more than 10 mins`,
        status: "200",
      }
    );
    const deloyResult = await powershell
      .call(deploymentPs, "string")
      .promise()
      .then(
        (result) => {
          console.log(
            "create-xm-cloud-env.js ----> Deployment Status : " + result.success
          );
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Executed :: ${deploymentPs}, Succeeded, ${result.success}`,
              status: "200",
            }
          );
        },
        (err) => {
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Executed :: ${deploymentPs}, caused Error ${err}`,
              status: "500",
            }
          );
          console.error(err);
        }
      );

    // Connect to the Env
    const connectEnvPs = `dotnet sitecore cloud environment connect -id ${environmentId} --allow-write`;
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      {
        message: `Connecting to newly created XM Environment:: ${connectEnvPs}`,
        status: "200",
      }
    );
    await powershell
      .call(connectEnvPs, "string")
      .promise()
      .then(
        (result) => {
          console.log(
            "create-xm-cloud-env.js ----> Connected to the Env : " +
              result.success
          );
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            { message: `Executed :: ${connectEnvPs}, Succeeded`, status: "200" }
          );
        },
        (err) => {
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            { message: `Executed :: ${connectEnvPs}, Failed`, status: "500" }
          );
          console.error(err);
        }
      );

    // Publish to Edge
    const edgePushPs = `dotnet sitecore publish --pt Edge -n ${req.query.environmentName}`;
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      {
        message: `Starting Publish to Experience Edge:: ${edgePushPs}`,
        status: "200",
      }
    );
    await powershell
      .call(edgePushPs, "string")
      .promise()
      .then(
        (result) => {
          console.log(
            "create-xm-cloud-env.js ----> edgePushPs Status " + result.success
          );
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Publish to Experience Edge Completed:: ${result.success}`,
              status: "200",
            }
          );
        },
        (err) => {
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Publish to Experience Edge Completed with Error :: ${err}`,
              status: "500",
            }
          );
          console.error(err);
        }
      );

    // Create Edge Token
    // The hard-coded path to be removed
    const edgeTokenPs = `(Get-Content "${localPath}\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      { message: `Creating Experience Edge Token`, status: "200" }
    );
    let accessToken;
    await powershell
      .call(edgeTokenPs, "json")
      .promise()
      .then(
        (result) => {
          accessToken = result.success;
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Creating Experience Edge Token :: SUCCEED`,
              status: "200",
            }
          );
        },
        (err) => {
          axios.post(
            `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
            {
              message: `Creating Experience Edge Token :: Failed ${err}`,
              status: "500",
            }
          );
          console.error(err);
        }
      );

    console.log(
      "create-xm-cloud-env.js ----> User Access Token " + accessToken
    );
    console.log(
      `create-xm-cloud-env.js ----> Token API Path ${process.env.XM_CLOUD_DEPLOY_API_URL}api/environments/v1/${environmentId}/obtain-edge-token`
    );
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      { message: `Fetching Experience Edge Access Token`, status: "200" }
    );
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
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      {
        message: `Fetching Experience Edge Access Token :: Succeded`,
        status: "200",
      }
    );
    console.log(
      "create-xm-cloud-env.js ---->  Edge Access Token " + body.apiKey
    );
    const resultEnvVariables = await fetch(
      `${process.env.HOST}/api/vercel/create-xmcloud-env-variable-for-project?projectId=${req.query.projectid}&JSSEditingSecret=""&SitecoreApiKey=${edgeAccessToken}`,
      {
        headers: req.headers,
      }
    );
    axios.post(
      `${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`,
      {
        message: `Hey ! this the last step - applying env variables in Vercel :: Succeded`,
        status: "200",
      }
    );
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

function extractEnvironmentId(result) {
  const subString = result.substring(
    result.indexOf("--environment-id") + 16,
    String(result).length
  );
  return subString.replace(/\s/g, "");
}
