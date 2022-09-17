import nodegit from "nodegit";
import path from "path";
import fs from "fs";

export default async function cloneRepository(req, res) {
  console.log("path " + path);
  const localPath = path.resolve(
    process.env.GITHUB_CLONE_FOLDER + "\\" + req.query.projectid
  );
  //remove cloned project --making sure the folder is empty before clone
  fs.rmSync(localPath, { recursive: true, force: true });
  console.log("req.query.projectid " + req.query.projectid);
  console.log("req.query.repo " + req.query.repo);
  console.log(localPath);
  const repo = req.query.repo;
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GITHUB_CLONE_REDIRECT_URL;
  console.log(localPath);

  const cloneRepo = async (code) => {
    const responseGit = await fetch(
      `https://github.com/login/oauth/access_token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json",
        },
      }
    );

    const json = await responseGit.json();
    console.log(json);
    var accessToken = json.access_token;
    var cloneOptions = {};
    cloneOptions.fetchOpts = {
      options : "'--depth', '1'",
      callbacks: {
        certificateCheck: function () {
          return 0;
        },
        credentials: function () {
          return nodegit.Cred.userpassPlaintextNew(
            accessToken,
            "x-oauth-basic"
          );
        },
      },
    };
    var cloneRepository = nodegit.Clone(repo, localPath, cloneOptions);
    await cloneRepository
      .catch(function (err) {
        console.log(err);
      })
      .then(function (repository) {
        console.log("result " + localPath);
        return res.status(200).json(localPath);
      });
  };

  return await cloneRepo(req.query.code);
}