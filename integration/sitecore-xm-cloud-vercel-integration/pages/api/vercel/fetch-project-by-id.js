export default async function fetchProjectbyID(req, res) {
  const projectId = req.query.projectId;
  console.log("projectId " + projectId);
  const accesstoken = req.query.token;
  console.log("accesstoken " + accesstoken);
  const result = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      method: "get",
    }
  );

  const body = await result.json();

  console.log(
    `https://api.vercel.com/v9/projects/${projectId} returned:`,
    JSON.stringify(body, null, "  ")
  );

  res.status(200).json(body);
}