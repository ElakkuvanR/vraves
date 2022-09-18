import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useHttp from "hooks/use-http";

// This hook is not used and to be checked 
export default function useVercelProjectDetails(token) {
  const [data, setData] = useState({});
  const router = useRouter();
  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const fetchProjectDetails_Callback = (result) => {
      setData({
        projectid: result.currentProjectId,
        repopath: `https://${projectJson.link.type}.com/${projectJson.link.org}/${projectJson.link.repo}.git`,
        next: next,
      });
    };
    if (router.isReady) {
      const { code, currentProjectId, next } = router.query;
      sendRequest(
        {
          url: `https://api.vercel.com/v9/projects/${currentProjectId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        fetchProjectDetails_Callback,
        false
      );
    }
  }, [router, sendRequest]);
  return {
    projectid: data.projectid,
    repopath: data.repopath,
    next: data.next,
  };
}
