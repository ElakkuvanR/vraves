# SUGCON EU Site
This is a headless Next.js site that uses the following technologies:
- Sitecore XM Cloud (Content Management)
- Sitecore JSS and Headless SXA (headless SDK)
- Next.js (rendering host)
- Vercel (hosting)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ElakkuvanR/vraves&repo-name=vraves&envDescription=Keys%20for%20Integration&redirect-url=https://portal.sitecorecloud.io/&demo-title=XM-Vercel-Integration&demo-description=XM%20Cloud%20Vercel%20Integration&demo-url=https://rh.vraves.localhost&demo-image=https://getlogo.net/wp-content/uploads/2020/11/valtech-logo-vector.png&integration-ids=oac_tpWgbB5pxqz2mOjz2QSLA6gU&root-directory=src/Project/Sugcon/SugconEuSxa&project-name=SugConEU)

## Prerequisites for this Next.js site are:
- [NodeJS 16 LTS](https://nodejs.org/en/download/) (or greater)

## Environment variables needed for deployment
- `FETCH_WITH`: Use the value 'GraphQL' to force the use of the GraphQL endpoint.
- `GRAPH_QL_ENDPOINT`: This is your environment Edge GraphQL endpoint. In production, it is likely https://edge.sitecorecloud.io/api/graphql/v1
- `SITECORE_API_KEY`: This is an Edge service token that you generate against your environment. [TODO: Link to the docs]

## Sitecore JSS Next.js Sample Docs
* [Documentation](https://doc.sitecore.com/xp/en/developers/hd/latest/sitecore-headless-development/sitecore-javascript-rendering-sdk--jss--for-next-js.html)