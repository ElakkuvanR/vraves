import "tailwindcss/tailwind.css";
import { TokenContextProvider } from "store/token-context";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const projectId = localStorage.getItem("projectid");
    console.log("Pusher Channel ==>", projectId);
    Pusher.logToConsole = true;
    // if (projectId) {
    const pusher = new Pusher(`${process.env.NEXT_PUBLIC_KEY}`, {
      cluster: "eu",
    });

    const channel = pusher.subscribe(projectId);

    channel.bind("logs", function (data) {
      console.log("logs from server--->", data);
    });

    const handleStart = (url) => {
      console.log(`Loading: ${url}`);
      document.getElementById("globalLoader").style.display = "block";
    };

    const handleStop = () => {
      document.getElementById("globalLoader").style.display = "none";
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);
  return (
    <TokenContextProvider>
      <Component {...pageProps} />
    </TokenContextProvider>
  );
}

export default MyApp;
