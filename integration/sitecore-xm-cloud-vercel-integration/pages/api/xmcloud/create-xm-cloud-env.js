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

  try {
    const powershell = new PowerShell({
      tmp_dir: process.env.PWSH_LOG_FOLDER ?? "C:\\log\\",
      timeout: 12000000,
      exe_path: 'pwsh'
    });
    console.log(localPath);
    const navigate = `Set-Location -Path ${localPath}`;
    await powershell
      .call(navigate, "string")
      .promise()
      .then(
        (result) => {
          console.log(result.success);
        },
        (err) => {
          console.error(err);
        }
      );

    //Create env file 
    fs.copyFile(`${localPath}` + "\\.env.template", `${localPath}` + "\\.env", (err) => {
      if (err) throw err;
      console.log('.env file created');
    });
    // Navigate to Project Folder
    const toolRestore = `dotnet tool restore`;
    await powershell
      .call(toolRestore, "string")
      .promise()
      .then(
        (result) => {
          console.log(result.success);
        },
        (err) => {
          console.error(err);
        }
      );

    // Login
    const loginPs = `dotnet sitecore cloud login --client-credentials --client-id ${req.query.clientid} --client-secret ${req.query.clientsecret}`;
    await powershell
      .call(loginPs, "string")
      .promise()
      .then(
        (result) => {
          console.log(result.success);
        },
        (err) => {
          console.error(err);
        }
      );

    // Project Create
    // const projectCreationPs = `dotnet sitecore cloud project create -n ${req.query.projectname}`;
    // let environmentCreationPs;
    // const resultProjectCreation = await powershell
    //   .call(projectCreationPs, "string")
    //   .promise()
    //   .then(
    //     (result) => {
    //       environmentCreationPs = result.success?.pop();
    //       console.log("environmentCreationPs : " + environmentCreationPs);
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );

    // // Environment Create
    // environmentCreationPs = String(environmentCreationPs)
    //   .replace("<environment-name>", req.query.environmentName)
    //   .trim();
    // environmentCreationPs = environmentCreationPs.replace(/(?:\\[rn])+/g, "");
    // let environmentId;
    // const envResult = await powershell
    //   .call(environmentCreationPs, "string")
    //   .promise()
    //   .then(
    //     (result) => {
    //       environmentId = extractEnvironmentId(result.success.pop());
    //       console.log("environmentId : " + environmentId);
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );
    // Processing the build Json File
    if (fs.existsSync(`${localPath}` + "\\xmcloud.build.json")) {
      var buildFileJson = JSON.parse(
        fs.readFileSync(`${localPath}` + "\\xmcloud.build.json")
      );
      console.log(buildFileJson);
      const domainName = req.query.domain;
      const rootDirectory= req.query.rootDirectory;
      const renderingHost = buildFileJson.renderingHosts;
      for (var key in renderingHost) {     
        console.log("buildjson path", buildFileJson.renderingHosts[key]?.path.toLowerCase());   
        if(buildFileJson.renderingHosts[key]?.path.toLowerCase().indexOf(rootDirectory.toLowerCase()) >= 0){         
             const envVariable = `${key.toUpperCase()}_RENDERING_HOST_ENDPOINT_URL`;
          // const envVariableSet = `Set-EnvFileVariable "${envVariable}" -Value "${domainName}"`;
          // console.log("envVariable -->", envVariable, envVariableSet);   
          // await powershell
          //   .call(envVariableSet, "string")
          //   .promise()
          //   .then(
          //     (result) => {
          //       console.log(result.success);
          //     },
          //     (err) => {
          //       console.error(err);
          //     }
          //   );
          fs.appendFileSync(`${localPath}` + "\\.env", "\n"+`${envVariable}=${domainName}`);
          //setEnvValue(`${localPath}` + "\\.env", envVariable, domainName);
        }
      }
    }

    // XM Default Deployment
    // const deploymentPs = `dotnet sitecore cloud deployment create --environment-id ${environmentId} --upload --json`;
    // const deloyResult = await powershell
    //   .call(deploymentPs, "string")
    //   .promise()
    //   .then(
    //     (result) => {
    //       console.log("Deployment Status : " + result.success);
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );

    // // // Connect to the Env
    // const connectEnvPs = `dotnet sitecore cloud environment connect -id ${environmentId} --allow-write`;
    // await powershell
    //   .call(connectEnvPs, "string")
    //   .promise()
    //   .then(
    //     (result) => {
    //       console.log("Connected to the Env : " + result.success);
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );

    // // // Publish to Edge
    // const edgePushPs = `dotnet sitecore publish --pt Edge -n ${req.query.envname}`;
    // await powershell
    //   .call(edgePushPs, "string")
    //   .promise()
    //   .then(
    //     (result) => {
    //       console.log("edgePushPs Status " + result.success);
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );

    // // // Create Edge Token
    // // // The hard-coded path to be removed
    // const edgeTokenPs = `(Get-Content "${localPath}\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
    // let accessToken;
    // await powershell
    //   .call(edgeTokenPs, "json")
    //   .promise()
    //   .then(
    //     (result) => {
    //       accessToken = res.status(200).json(result.success);
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );

    // // console.log("Access Token " + accessToken);
    // const result = await fetch(
    //   `${process.env.XM_CLOUD_DEPLOY_API_URL}api/environments/v1/${environmentId}/obtain-edge-token`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     method: "GET",
    //   }
    // );
    // const body = await result.json();
    // console.log("Edge Access Token " + body);
    // const projectId = req.query.projectId;
    // const envId = req.query.environmentId;
    // const variableKey = req.query.variableKey;
    // const variableValue = req.query.variableValue;
    // const accessTokenResult = await fetch(`${process.env.HOST}/api/vercel/set-env-variable-for-project?projectId=${req.query.projectid}&envId`)
  } catch (error) {
    console.log(error);
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

function setEnvValue(envPath,key, value) {

  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync(envPath, "utf8").split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
  }));

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}