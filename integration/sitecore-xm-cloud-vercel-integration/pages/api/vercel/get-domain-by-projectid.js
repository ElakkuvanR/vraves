import Cookies from "cookies";
export default async function getDomainForProject(req, res) {
  const projectId = req.query.projectid;
  const domainName= req.query.domainName ?? "production";

  //get access token through vercel access code
  // const accessTokenResult = await fetch(`${process.env.HOST}/api/vercel/get-access-token?code=${req.query.code}`)
  // const json = await accessTokenResult.json()
  const cookies = new Cookies(req, res);
  const accessToken = cookies.get("vat");
  
  const result = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    },
    "method": "get"
  })
  const body = await result.json()

  console.log(`https://api.vercel.com/v9/projects/${projectId}/domains/${domainName} returned:`, JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}