import { PowerShell } from "full-powershell";
import path from "path";

export default async function fetchXMEnvironments(req, res) {
  const projectId = req.query.projectid;
  const vercelProjectId = req.query.vercelprojid;
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + vercelProjectId
  );
  console.log("Path in localPath" + localPath);
  const powershellEt = new PowerShell({
    tmp_dir: process.env.PWSH_LOG_FOLDER ?? "C:\\log\\",
    timeout: 12000000,
    exe_path: 'pwsh'
  });
  const accessTokenPs = `(Get-Content "${localPath}\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
  let accessToken;
  await powershellEt
    .call(accessTokenPs, "json")
    .promise()
    .then(
      (result) => {
        accessToken = result.success;
      },
      (err) => {
        console.error(err);
      }
    );
  powershellEt.destroy();

  const result = await fetch(
    `https://xmclouddeploy-api.sitecorecloud.io/api/projects/v1/${projectId}/environments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );
  const body = await result.json();
  console.log("Environments " + body);
  return res.status(200).json(body);
}
