import { useEffect, useContext, useState } from "react";
import GithubLogin from "components/githublogin";
import Layout from "components/layout";
import { useRouter } from "next/router";
import TokenContext from "store/token-context";

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const ctx = useContext(TokenContext);
  const router = useRouter();
  const [data, setData] = useState("");
  const params = {
    status: "",
  };
  const clickMeHand = () => {
    setData("elakk");
    console.log("1" + ctx.accesstoken);
    console.log("2" + data);
  };
  useEffect(() => {
    const { code } = router.query;
    const cloneRepo = async (code) => {
      const res = await fetch(apiUrl);
      params.status = "logged-in";
    };
    let apiUrl = localStorage.getItem("apiUrl");
    if (!apiUrl) {
      apiUrl = `/api/git/cloneRepository?projectid=${ctx.projectid}&repo=${ctx.repourl}`;
      localStorage.setItem("apiUrl", apiUrl);
    }
    console.log("Clone repo called");
    if (router.isReady && code) {
      console.log("router");
      apiUrl = apiUrl + `&code=${code}`;
      cloneRepo(apiUrl);
      localStorage.removeItem("apiUrl");
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
        <button onClick={clickMeHand}>Click Me</button>
      </div>
    </Layout>
  );
}