import { useEffect, useContext, useState } from "react";
import GithubLogin from "components/githublogin";
import Layout from "components/layout";
import { useRouter, Router } from "next/router";
import TokenContext from "store/token-context";

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const ctx = useContext(TokenContext);
  const router = useRouter();
  const [data, setData] = useState("");
  const params = {
    status: "",
  };
  useEffect(() => {
    const { code } = router.query;
    const cloneRepo = async (code) => {
      const res = await fetch(apiUrl);
      console.log("Clone Result " + res.json);
      params.status = "logged-in";
    };
    let apiUrl = localStorage.getItem("apiUrl");
    console.log("config ctx pid", ctx.projectid);
    console.log("config ctx code", ctx.code);
    if (!apiUrl) {
      apiUrl = `/api/git/cloneRepository?projectid=${ctx.projectid}&repo=${ctx.repourl}`;
      const projectIdStore = `${ctx.projectid}`;
      localStorage.setItem("apiUrl", apiUrl);
      console.log("projectIdStore " + projectIdStore);
      localStorage.setItem("projectid", projectIdStore);
    }
    console.log("Clone repo called");
    if (router.isReady && code) {
      console.log("router");      
      localStorage.setItem("code", code);
      apiUrl = apiUrl + `&code=${code}`;
      cloneRepo(apiUrl);
      localStorage.removeItem("apiUrl");
      router.push("/project-type");
    }
  }, [router, ctx]);

  return (
    <Layout>
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-medium">
          Let us connect your repo in order to deploy to Sitecore XM Cloud
        </h1>
        <section className="py-4 flex justify-center">
          <GithubLogin {...params} />
        </section>
      </div>
    </Layout>
  );
}