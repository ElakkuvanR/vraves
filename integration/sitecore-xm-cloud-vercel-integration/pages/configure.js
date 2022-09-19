import { useEffect, useContext, useState } from "react";
import GithubLogin from "components/git/githublogin";
import Layout from "components/ui/layout";
import { useRouter } from "next/router";
import TokenContext from "store/token-context";
import setCollectionToLocalStorage from "lib/helpers/set-local-storage";
import useHttp from "hooks/use-http";

// This page communicates with GitRepo and set the ApiUrl to local storage
export default function ConfigurePage() {
  const ctx = useContext(TokenContext);
  const { sendRequest } = useHttp();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = {
    status: "",
  };
  useEffect(() => {
    const { code } = router.query;
    setIsLoading(true);
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
          params.status = "logged-in";
          localStorage.removeItem("apiUrl");
          setIsLoading(false);
          router.push("/project-type");
        });
      }
    }
  }, [router, ctx]);

  return (
    <Layout>
      <form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
         <div class="bg-hero bg-no-repeat bg-cover bg-center rounded-lg">
          <div class="text-start w-1/2 py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
            <h2 class="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
              <span className="font-medium w-full uppercase text-center text-4xl sm:text-2xl dark:text-white text-gray-800">
                Let us connect your repo in order to deploy to Sitecore XM Cloud
              </span>
            </h2>
            <div class="lg:mt-0 lg:flex-shrink-0">
              <div class="mt-12 inline-flex rounded-md shadow">
                <GithubLogin {...params} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
}
