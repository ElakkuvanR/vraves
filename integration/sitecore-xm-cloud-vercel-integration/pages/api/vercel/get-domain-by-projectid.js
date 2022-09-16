export default async function getEnvVariableForProject(req, res) {
  const projectId = req.query.projectId;
  const domainName= req.query.domainName;

  //get access token through vercel access code
  const res = await fetch(`/api/get-access-token?code=${req.query.code}`)
  const json = await res.json()
  
  const result = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains/${domainName}`, {
    "headers": {
      "Authorization": `Bearer ${json.access_token}`
    },
    "method": "get"
  })
  const body = await result.json()

  console.log(`https://api.vercel.com/v9/projects/${projectId}/domains/${domainName} returned:`, JSON.stringify(body, null, '  '))

  res.status(200).json(body)
}