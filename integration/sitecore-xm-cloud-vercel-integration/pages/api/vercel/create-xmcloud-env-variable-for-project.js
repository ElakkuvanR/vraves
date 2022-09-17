import Cookies from "cookies";
export default async function createXMCloudEnvVariableForProject(req, res) {
  const projectId = req.query.projectId;

  const cookies = new Cookies(req, res);
  const accessToken = req.query.token ?? cookies.get("vat");
  const result = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/env`,
    {
      "body": [
      {
        "key": `FETCH_WITH`,
        "value": `GraphQL`
      },
      {
        "key": "GRAPH_QL_ENDPOINT",
        "value": req.query?.GraphQLEndpoint ?? "https://edge.sitecorecloud.io/api/graphql/v1"
      },
      {
        "key": "JSS_EDITING_SECRET",
        "value": req.query?.JSSEditingSecret
      },
      {
        "key":"SITECORE_API_HOST",
        "value": req.query?.SitecoreApiHost ?? "https://edge.sitecorecloud.io/"
      },
      {
        "key":"SITECORE_API_KEY",
        "value" : req.query?.SitecoreApiKey
      }
    ],
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "post",
    }
  );

  const body = await result.json();

  console.log(
    `https://api.vercel.com/v9/projects/${projectId}/env returned:`,
    JSON.stringify(body, null, "  ")
  );

  res.status(200).json(body);
}
