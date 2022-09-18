import Cookies from "cookies";

export default async function getEnvVariableForProject(req, res) {
  const projectId = req.query.projectId;

  const cookies = new Cookies(req, res);
  const accessToken = cookies.get("vat");
  console.log("accesstoken", accessToken);
  const result = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    },
    "method": "get"
  })
  const body = await result.json()

  console.log(`https://api.vercel.com/v9/projects/${projectId}/env returned:`, JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}