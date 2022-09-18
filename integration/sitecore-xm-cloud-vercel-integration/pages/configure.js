import { useEffect, useContext, useState } from "react";
import GithubLogin from "components/githublogin";
import Layout from "components/ui/layout";
import { useRouter, Router } from "next/router";
import TokenContext from "store/token-context";
import setCollectionToLocalStorage from "lib/helpers/set-local-storage";
import useHttp from "hooks/use-http";

export default function ConfigurePage() {
  const ctx = useContext(TokenContext);
  const { sendRequest, isLoading, error } = useHttp();
  const router = useRouter();
  const params = {
    status: "",
  };
  useEffect(() => {
    const { code } = router.query;
    if (router.isReady) {
      // Only if the router is ready
      const cloneRepoCallBack = (result) => {
        // Can be empty
      };
      let apiUrl = localStorage.getItem("apiUrl");
      if (!apiUrl) {
        apiUrl = `${process.env.GIT_CLONE_REDIRECT_URL}?projectid=${ctx.projectid}&repo=${ctx.repourl}`;
        setCollectionToLocalStorage([
          {
            apiUrl: apiUrl,
          },
        ]);
      }
      console.log("Configure.js ----> ApiUrl: " + apiUrl);
      if (router.isReady && code) {
        apiUrl = apiUrl + `&code=${code}`;
        sendRequest(
          {
            url: `${apiUrl}`,
          },
          cloneRepoCallBack,
          false
        ).finally(() => {
          localStorage.removeItem("apiUrl");
          router.push("/project-type");
        });
      }
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
