import "tailwindcss/tailwind.css";
import toast, { Toaster } from "react-hot-toast";
import { TokenContextProvider } from "store/token-context";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const projectId = localStorage.getItem("projectid");
    if(projectId){
      console.log("Pusher Channel ==>", projectId);
      Pusher.logToConsole = true;
      // if (projectId) {
      const pusher = new Pusher(`${process.env.NEXT_PUBLIC_KEY}`, {
        cluster: "eu",
      });
  
      const channel = pusher.subscribe(projectId);
  
      channel.bind("logs", function (data) {
        console.log("logs from server--->", data);
        switch (data.type) {
          case "error":
            toast.error(data.message);
          case "info":
            toast(
              data.message,
              {
                duration: 2500,
              }
            );
          case "success":
            toast.success(data.message);
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
    };
  }, [router]);
  return (
    <TokenContextProvider>
      <Component {...pageProps} />
      {/* <div><Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      /></div> */}
    </TokenContextProvider>
  );
}

export default MyApp;
