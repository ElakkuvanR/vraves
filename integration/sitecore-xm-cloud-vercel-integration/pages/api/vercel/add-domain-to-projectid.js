export default async function getEnvVariableForProject(req, res) {
  const projectId = req.query.projectId;
  const domainName= req.query.domainName;

  //get access token through vercel access code
  const res = await fetch(`/api/get-access-token?code=${req.query.code}`)
  const json = await res.json()
  
  const result = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
    "body": {
      "name": `${domainName}`
    },
    "headers": {
      "Authorization": `Bearer ${json.access_token}`
    },
    "method": "post"
  })

  const body = await result.json()

  console.log(`https://api.vercel.com/v9/projects/${projectId}/domains returned:`, JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}