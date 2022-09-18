import "tailwindcss/tailwind.css";
import { TokenContextProvider } from "store/token-context";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
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
