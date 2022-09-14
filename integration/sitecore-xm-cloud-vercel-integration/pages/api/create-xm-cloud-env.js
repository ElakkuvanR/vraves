import { PowerShell } from "full-powershell";

export default async function createXMCloudEnv(req, res) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  const powershellL = new PowerShell();
  // Login
  const loginPs = `dotnet sitecore cloud login --client-credentials --client-id ${req.query.clientid} --client-secret ${req.query.clientsecret}`;
  await powershellL
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
  powershellL.destroy();

  // Project Create
  const powershellPc = new PowerShell();
  const projectCreationPs = `dotnet sitecore cloud project create -n ${req.query.projectname}`;
  let environmentCreationPs;
  const resultProjectCreation = await powershellPc
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
  powershellPc.destroy();

  // Environment Create
  const powershellEc = new PowerShell();
  environmentCreationPs = String(environmentCreationPs)
    .replace("<environment-name>", req.query.envname)
    .trim();
  environmentCreationPs = environmentCreationPs.replace(/(?:\\[rn])+/g, "");
  let environmentId;
  const envResult = await powershellEc
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
  powershellEc.destroy();

  // XM Default Deployment
  const powershellXMD = new PowerShell();
  const deploymentPs = `dotnet sitecore cloud deployment create --environment-id ${environmentId}`;
  const deloyResult = await powershellXMD
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
  powershellXMD.destroy();
  // // XM Default Deployment
  // const deploymentSolPs = `dotnet sitecore cloud deployment create --environment-id ${environmentId} --upload --json`;
  // await powershell
  //   .call(deploymentSolPs, "string")
  //   .promise()
  //   .then(
  //     (result) => {
  //       console.log("Deployment Solution Status : " + result.success);
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );

  // Connect to the Env
  const powershellEv = new PowerShell();
  const connectEnvPs = `dotnet sitecore cloud environment connect -id ${environmentId} --allow-write`;
  await powershellEv
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
  powershellEv.destroy();
  // Publish to Edge
  const powershellPe = new PowerShell();
  const edgePushPs = `dotnet sitecore publish --pt Edge -n ${req.query.envname}`;
  await powershellPe
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
  powershellPe.destroy();

  // Create Edge Token
  // The hard-coded path to be removed
  const powershellEt = new PowerShell();
  const edgeTokenPs = `(Get-Content "D:\\ValtechHackathon_2022\\XM-Cloud-Introduction\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
  let accessToken;
  await powershellEt
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
  powershellEt.destroy();

  console.log("Access Token " + accessToken);
  const result = await fetch(
    `https://xmclouddeploy-api.sitecorecloud.io/api/environments/v1/${environmentId}/obtain-edge-token`,
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