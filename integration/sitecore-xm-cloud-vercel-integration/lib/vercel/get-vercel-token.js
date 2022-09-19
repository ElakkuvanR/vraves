import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useHttp from "hooks/use-http";
import qs from "querystring";

export default function useVercelToken() {
  const [data, setData] = useState({});
  const router = useRouter();
  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const fetchAccessToken_Callback = (result) => {
      setData({
        accessToken: result.access_token,
        userId: result.user_id,
        teamId: result.team_id,
      });
    };
    if (router.isReady) {
      console.log("Router Ready in Callback.js");
      const { code, currentProjectId, next } = router.query;

      // Get the Vercel Access Token First
      sendRequest(
        {
          url: `${process.env.VERCEL_GET_TOKEN_URL}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: qs.stringify({
            client_id: process.env.VERCEL_CLIENT_ID,
            client_secret: process.env.VERCEL_CLIENT_SECRET,
            code: code,
            redirect_uri: `${process.env.VERCEL_REDIRECT_HOST}/callback`, // this parameter should match the Redirect URL in your integration settings on Vercel
          }),
        },
        fetchAccessToken_Callback,
        false
      );
    }
  }, [router, sendRequest]);
  return {
    accessToken: data.accessToken,
  };
}
