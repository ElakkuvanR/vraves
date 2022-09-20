import { PowerShell } from "full-powershell";
import path from "path";
import {
  sendErrorMessage,
  sendSuccessMessage,
  sendInfoMessage,
} from "../../../lib/pusher/pusher-helper";

export default async function XMCloudLogin(req, res) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  const projectId = req.query.projectid;
  // Navigate to Project Folder
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + projectId
  );

  const powershell = new PowerShell({
    tmp_dir: process.env.PWSH_LOG_FOLDER ?? "C:\\log\\",
    timeout: 12000000,
    exe_path: "pwsh",
  });
  console.log(localPath);
  const navigate = `Set-Location -Path ${localPath}`;
  await powershell
    .call(navigate, "string")
    .promise()
    .then(
      (result) => {
        sendSuccessMessage(projectId, result.success);
      },
      (err) => {
        sendErrorMessage(projectId, err);
        console.error(err);
      }
    );

  // Navigate to Project Folder
  const toolRestore = `dotnet tool restore`;
  await powershell
    .call(toolRestore, "string")
    .promise()
    .then(
      (result) => {
        // console.log("console : " + result.success);
        sendSuccessMessage(projectId, result.success);
      },
      (err) => {
        sendErrorMessage(projectId, err);
        console.error(err);
      }
    );

  // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  // await delay(20000);

  // Login
  const loginPs = `dotnet sitecore cloud login --client-credentials --client-id ${req.query.clientid} --client-secret ${req.query.clientsecret}`;
  await powershell
    .call(loginPs, "string")
    .promise()
    .then(
      (result) => {
        // console.log(result.success);
        sendSuccessMessage(projectId, result.success);
        return res
          .status(200)
          .json({ message: "SuccessFully LoggedIn", IsAuthenticated: true });
      },
      (err) => {
        // console.error(err);
        sendErrorMessage(projectId, err);
        return res
          .status(500)
          .json({ message: "SuccessFully LoggedIn", IsAuthenticated: false });
      }
    );
  powershell.destroy();
}
