import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import XMCloudForm from "components/xmcloudform";
import CreateProjectPrompt from "components/createProjectPrompt";
import GithubLogin from "components/githublogin";
import TokenContext from "store/token-context";

export default function CallbackPage() {
  const router = useRouter();
  const query = router.query;
  const [data, setData] = useState({});
  const [projects, setProjects] = useState();
  const ctx = useContext(TokenContext);

  const clickMeHand = () => {
    console.log("1" + ctx.accesstoken);
    console.log("2" + ctx.projectid);
  };
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
        const projectRepoPath = `https://${projectJson.link.type}.com/${projectJson.link.org}/${projectJson.link.repo}.git`;
        ctx.setTokenValues(
          code,
          project,
          next,
          json.access_token,
          projectRepoPath
        );
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
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">
            Setup Sitecore XM Cloud Project
          </h1>
        </section>

        <section className="py-4 ">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-medium">
              Please provide below details
            </h1>
            <section className="py-4 flex justify-center">
              <CreateProjectPrompt />
            </section>
          </div>
        </section>

        {/* <section className="py-4">
          <h1 className="text-lg font-medium">Data:</h1>
          <div className="mt-1">
            {data.accessToken ? (
              <pre className="text-sm">
                {JSON.stringify(data, null, '  ')}
              </pre>
            ) : <Loader />}
          </div>
        </section> */}

        {/* <section className="py-4">
          <h1 className="text-lg font-medium">Projects:</h1>
          <div className="mt-1">
            {projects ? (
              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                {projects.map(project => (
                  <div key={project.id} className="truncate">
                    {project.name}
                  </div>
                ))}
              </div>
            ) : <Loader />}
          </div>
        </section> */}

        <section className="py-4 flex justify-center">
          {/* This redirect should happen programmatically if you're done with everything on your side */}
          <button
            className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
            onClick={() => {
              router.push(router.query.next);
            }}
          >
            Redirect me back to Vercel
          </button>
          <button onClick={clickMeHand}>Click Me</button>
        </section>
      </div>
    </Layout>
  );
}