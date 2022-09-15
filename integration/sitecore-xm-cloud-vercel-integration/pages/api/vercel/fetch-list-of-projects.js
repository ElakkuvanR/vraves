export default async function fetchListofProjects(req, res) {
    const projectId = req.query.projectId;
  
    //get access token through vercel access code
    const res = await fetch(`/api/get-access-token?code=${req.query.code}`)
    const json = await res.json()
    
    const result = await fetch("https://api.vercel.com/v9/projects", {
        "headers": {
          "Authorization": `Bearer ${json.access_token}`
        },
        "method": "get"
      })
  
    const body = await result.json()
  
    console.log(`https://api.vercel.com/v9/projects returned:`, JSON.stringify(body, null, '  '))
  
    res.status(200).json(body)
  }