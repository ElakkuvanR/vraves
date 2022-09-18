import { useEffect, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import useHttp from "hooks/use-http";
import TokenContext from "store/token-context";
import Loader from "components/ui/loader";
import useVercelToken from "lib/vercel/get-vercel-token";
import setValueToLocalStorage from "lib/helpers/set-local-storage";

export default function CallbackPage() {
  // Hooks Initialization
  const router = useRouter();
  const { sendRequest, isLoading, error } = useHttp();
  const ctx = useContext(TokenContext);
  const { accessToken } = useVercelToken();

  useEffect(() => {
    if (router.isReady) {
      console.log("Callback.js ----> vercel accessToken: " + accessToken);
      // Only if the Router is ready
      const { code, currentProjectId, next } = router.query;
      if (code) {
        const fetchProjectDetails_Callback = async (result) => {
          // CallBack function
          setValueToLocalStorage("rootDirectory", result.rootDirectory);
          setValueToLocalStorage("next", next);
          console.log(
            "Callback.js ----> Repo Url: " +
              `https://${result.link.type}.com/${result.link.org}/${result.link.repo}.git`
          );
          ctx.setTokenValues(
            code,
            currentProjectId,
            next,
            accessToken,
            `https://${result.link.type}.com/${result.link.org}/${result.link.repo}.git`
          );
          router.push("/configure"); // Redirect to the Router page
        };
        // Get the VercelProject Details with Current Project ID
        sendRequest(
          {
            url: `${process.env.VERCEL_GET_PROJECT_ID_URL}${currentProjectId}`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          fetchProjectDetails_Callback,
          false
        );
      }
    }
  }, [router, accessToken]);
  return (
    <>
      <Loader text="Please hold on for a moment while we setup things in background !!!"></Loader>
    </>
  );
}