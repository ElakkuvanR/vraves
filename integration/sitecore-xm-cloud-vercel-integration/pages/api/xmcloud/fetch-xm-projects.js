import { PowerShell } from "full-powershell";
import path from "path";

export default async function fetchXMProjects(req, res) {
  const projectId = req.query.projectid;
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + projectId
  );
  console.log("localPath " + localPath);
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
    `https://xmclouddeploy-api.sitecorecloud.io/api/projects/v1/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );
  const body = await result.json();
  console.log("Projects " + body);
  res.status(200).json(body);
}
