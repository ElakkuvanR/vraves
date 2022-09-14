import { PowerShell } from "full-powershell";

export default async function fetchXMProjects(req, res) {
  const powershellEt = new PowerShell();
  const accessTokenPs = `(Get-Content "D:\\ValtechHackathon_2022\\XM-Cloud-Introduction\\.sitecore\\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken`;
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
  return res.status(200).json(body);
}