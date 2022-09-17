/**
 * This endpoint can be only called once
 *
 * Our `code` is only valid for one request. If we call it more then once,
 * we get "Invalid grant: authorization code is invalid".
 */
 export default async function setEnvVariableForProject(req, res) {
  const projectId = req.query.projectId;
  const envId = req.query.environmentId;
  const variableKey = req.query.variableKey;
  const variableValue = req.query.variableValue;

  //get access token through vercel access code
  const res = await fetch(`/api/vercel/get-access-token?code=${req.query.code}`)
  const json = await res.json()
  
  const result = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${envId}`, {
    "body": {
      "key": `${variableKey}`,
      // "target": "<insert-value>",
      // "type": "<insert-value>",
      "value": `${variableValue}`
    },
    "headers": {
      "Authorization": `Bearer ${json.access_token}`
    },
    "method": "patch"
  })
  const body = await result.json()

  console.log(`https://api.vercel.com/v9/projects/${projectId}/env/${envId} returned:`, JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}
