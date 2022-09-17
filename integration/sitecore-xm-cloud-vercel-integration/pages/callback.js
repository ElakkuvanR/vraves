import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import TokenContext from "store/token-context";

export default function CallbackPage() {
  const router = useRouter();
  const query = router.query;
  const [data, setData] = useState({});
  const [projects, setProjects] = useState();
  const ctx = useContext(TokenContext);

  useEffect(
    () => {
      const fetchAccessToken = async (code, project, next) => {
        const res = await fetch(`/api/vercel/get-access-token?code=${code}`);
        const json = await res.json();
        setData({
          accessToken: json.access_token,
          userId: json.user_id,
          teamId: json.team_id,
        });
        const projectResult = await fetch(
          `/api/vercel/fetch-project-by-id?code=${code}&projectId=${project}&token=${json.access_token}`
        );
        const projectJson = await projectResult.json();
        console.log("project-details",projectJson);
        localStorage.setItem("rootDirectory",projectJson.rootDirectory);
        const projectRepoPath = `https://${projectJson.link.type}.com/${projectJson.link.org}/${projectJson.link.repo}.git`;
        ctx.setTokenValues(
          code,
          project,
          next,
          json.access_token,
          projectRepoPath
        );
        console.log("ctx pid", ctx.projectid);
        console.log("ctx code", ctx.code);
        router.push("/configure");
      };
      if (router.isReady) {
        const { code, currentProjectId, next } = router.query;
        if (!data.accessToken) {
          fetchAccessToken(code, currentProjectId, next);
        }
      }
    },
    [router],
    [data]
  );

  return (
    <Layout>
      
    </Layout>
  );
}
