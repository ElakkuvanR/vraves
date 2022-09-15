import nodegit from "nodegit";

export default async function cloneRepository(req, res) {
  const repo = process.env.GITHUB_CLONE_REPO;
  const localPath = process.env.GITHUB_CLONE_FOLDER;
  console.log(localPath);

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GITHUB_CLONE_REDIRECT_URL;

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
        console.log(repository);
      });
    res.status(200).json({ message: "done" });
  };

  await cloneRepo(req.query.code);
}
