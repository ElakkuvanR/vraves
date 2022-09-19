import { PowerShell } from "full-powershell";
import path from "path";
import axios from "axios";

export default async function XMCloudLogin(req, res) {
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    // Navigate to Project Folder
    const localPath = path.resolve(
        process.env.GITHUB_CLONE_FOLDER + "\\" + req.query.projectid
    );

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
                axios.post(`${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`, { message: result.success, status: "200" });
            },
            (err) => {
                axios.post(`${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`, { message: err, status: "500" });
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
                console.log(result.success);
                axios.post(`${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`, { message: result.success, status: "200" });
            },
            (err) => {
                axios.post(`${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`, { message: err, status: "500" });
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
                axios.post(`${process.env.HOST}/api/pusher?projectid=${req.query.projectid}`, { message: result.success, status: "200" });
                return res.status(200).json({ message: "SuccessFully LoggedIn", IsAuthenticated: true });
            },
            (err) => {
                console.error(err);
                return res.status(500).json({ message: "SuccessFully LoggedIn", IsAuthenticated: false });
            }
        );
    powershell.destroy();
}