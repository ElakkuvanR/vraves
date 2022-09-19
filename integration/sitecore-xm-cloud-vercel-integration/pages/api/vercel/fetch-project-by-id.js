import Cookies from "cookies";

export default async function fetchProjectbyID(req, res) {
  const projectId = req.query.projectId;
  console.log("projectId " + projectId);
  const cookies = new Cookies(req, res);
  const accessToken = req.query.token ?? cookies.get("vat");
  console.log("accesstoken " + accessToken);
  cookies.set("vat", `${accessToken}`);
  const result = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
