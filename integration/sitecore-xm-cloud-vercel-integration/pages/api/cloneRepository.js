import nodegit from 'nodegit'


export default async function cloneRepository(req, res) {
  const repo = "https://github.com/nkdram/XM-Cloud-Introduction.git"
  const localPath = "F:\\xm-cloud\\vercel-integration\\" + "repos";
  console.log(localPath);

  const CLIENT_ID = "a7c691691b0f02469680";
  const CLIENT_SECRET = "43a3bc59e5bd0771845dd2d521088999cfcd8ffa";
  const REDIRECT_URI = "http://localhost:3000/configure";

  const cloneRepo = async (code) => {
    const responseGit = await fetch(`https://github.com/login/oauth/access_token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept' : 'application/json'
      }});
    
    const json = await responseGit.json();
    console.log(json);
    var accessToken = json.access_token;
    var cloneOptions = {};
    cloneOptions.fetchOpts = {
      callbacks: {
        certificateCheck: function() { return 0; },
        credentials: function() {
          return nodegit.Cred.userpassPlaintextNew(accessToken, "x-oauth-basic");
        }
      }
    };
    var cloneRepository = nodegit.Clone(repo, localPath, cloneOptions);
    await cloneRepository.catch(function(err){
      console.log(err);
    })
    .then(function(repository) {
      console.log(repository);
    });
    res.status(200).json({"message" : "done"});
  };

  await cloneRepo(req.query.code); 
}