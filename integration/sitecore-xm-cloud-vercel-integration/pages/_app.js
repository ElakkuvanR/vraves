import "tailwindcss/tailwind.css";
import toast, { Toaster } from "react-hot-toast";
import { TokenContextProvider } from "store/token-context";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pusher = new Pusher(`${process.env.NEXT_PUBLIC_KEY}`, {
    cluster: "eu",
  });
  let channel, projectId;
  useEffect(() => {
    projectId = localStorage.getItem("projectid");
    if (projectId) {
      console.log("Pusher Channel ==>", projectId);
      Pusher.logToConsole = true;
      channel = pusher.subscribe(projectId);
      channel.bind("logs", function (data) {
        console.log("logs from server--->", data);
        // toast.success(data.type);
        if(data.message && data.message.length > 0){
          switch (data.type) {
            case "error":
              toast.error(data.message);
              break;
            case "info":
              toast(data.message, {
                duration: 2500,
              });
              break;
            case "success":
              toast.success(data.message);
              break;
          }

        }
      });
    }
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
      pusher.unsubscribe(projectId);
    };
  }, [router]);
  return (
    <TokenContextProvider>
      <Component {...pageProps} />
      <div>
        <Toaster
          position="top-center"     
          toastOptions={{
            // Define default options
            className: "",
            duration: 10000,
            style: {
              "max-width": "480px",
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 5000
            },
            error: {
              duration: 5000
            },
          }}     
        />
      </div>
    </TokenContextProvider>
  );
}

export default MyApp;
