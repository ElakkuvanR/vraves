import { PowerShell } from "full-powershell";
import path from "path";
import fs from "fs";
export default async function createXMCloudEnv(req, res) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");

  let environmentId = req.query.envid;
  let existingProject = (environmentId != null);

  // Navigate to Project Folder
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + req.query.projectid
  );

  const powershell = new PowerShell({
    tmp_dir: "D:\\log\\",
    timeout: 12000000,
  });
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

  // Navigate to Project Folder
  const navigate1 = `dotnet tool restore`;
  await powershell
    .call(navigate1, "string")
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

  if (!existingProject) {
    // Project Create
    const projectCreationPs = `dotnet sitecore cloud project create -n ${req.query.projectname}`;
    let environmentCreationPs;
    const resultProjectCreation = await powershell
      .call(projectCreationPs, "string")
      .promise()
      .then(
        (result) => {
          environmentCreationPs = result.success?.pop();
          console.log("environmentCreationPs : " + environmentCreationPs);
        },
        (err) => {
          console.error(err);
        }
      );

    // Environment Create
    environmentCreationPs = String(environmentCreationPs)
      .replace("<environment-name>", req.query.envname)
      .trim();
    environmentCreationPs = environmentCreationPs.replace(/(?:\\[rn])+/g, "");
    const envResult = await powershell
      .call(environmentCreationPs, "string")
      .promise()
      .then(
        (result) => {
          environmentId = extractEnvironmentId(result.success.pop());
          console.log("environmentId : " + environmentId);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // Processing the build Json File
  if (fs.existsSync(`${localPath}` + "\\xmcloud.build.json")) {
    var buildFileJson = JSON.parse(fs.readFileSync(`${localPath}` + "\\xmcloud.build.json"));
    console.log(jsonFormat);
    const renderingHost = buildConfig.renderingHosts;
    for (var key in renderingHost) {
      console.log("Key " + key);
    }
  }

  if (!existingProject) {
    // XM Default Deployment
    const deploymentPs = `dotnet sitecore cloud deployment create --environment-id ${environmentId} --upload --json`;
    const deloyResult = await powershell
      .call(deploymentPs, "string")
      .promise()
      .then(
        (result) => {
          console.log("Deployment Status : " + result.success);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // Connect to the Env
  const connectEnvPs = `dotnet sitecore cloud environment connect -id ${environmentId} --allow-write`;
  await powershell
    .call(connectEnvPs, "string")
    .promise()
    .then(
      (result) => {
        console.log("Connected to the Env : " + result.success);
      },
      (err) => {
        console.error(err);
      }
    );

  // Publish to Edge
  const edgePushPs = `dotnet sitecore publish --pt Edge -n ${req.query.envname}`;
  await powershell
    .call(edgePushPs, "string")
    .promise()
    .then(
      (result) => {
        console.log("edgePushPs Status " + result.success);
      },
      (err) => {
        console.error(err);
      }
    );

  // Create Edge Token
  // The hard-coded path to be removed
  const edgeTokenPs = `(Get-Content "${localPath}\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
  let accessToken;
  await powershell
    .call(edgeTokenPs, "json")
    .promise()
    .then(
      (result) => {
        accessToken = res.status(200).json(result.success);
      },
      (err) => {
        console.error(err);
      }
    );

  console.log("Access Token " + accessToken);
  const result = await fetch(
    `${process.env.XM_CLOUD_DEPLOY_API_URL}api/environments/v1/${environmentId}/obtain-edge-token`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );
  const body = await result.json();
  console.log("Edge Access Token " + body);
}

function extractEnvironmentId(result) {
  const subString = result.substring(
    result.indexOf("--environment-id") + 16,
    String(result).length
  );
  return subString.replace(/\s/g, "");
}