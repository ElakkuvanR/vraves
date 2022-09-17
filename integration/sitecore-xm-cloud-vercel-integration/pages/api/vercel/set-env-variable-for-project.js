import Cookies from "cookies";

 export default async function setEnvVariableForProject(req, res) {
  const projectId = req.query.projectId;
  const envId = req.query.environmentId;
  const variableKey = req.query.variableKey;
  const variableValue = req.query.variableValue;

  const cookies = new Cookies(req, res);
  const accessToken = cookies.get("vat");
  
  const result = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${envId}`, {
    "body": {
      "key": `${variableKey}`,
      // "target": "<insert-value>",
      // "type": "<insert-value>",
      "value": `${variableValue}`
    },
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    },
    "method": "patch"
  })
  const body = await result.json()

  console.log(`https://api.vercel.com/v9/projects/${projectId}/env/${envId} returned:`, JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}
