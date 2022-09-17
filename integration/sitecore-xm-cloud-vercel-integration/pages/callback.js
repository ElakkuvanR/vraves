import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import useHttp from "hooks/use-http";
import TokenContext from "store/token-context";
import Loader from "components/UI/loader";
import useVercelToken from "lib/vercel/get-vercel-token";
import useVercelProjectDetails from "lib/vercel/get-vercel-project-details";

export default function CallbackPage() {
  const router = useRouter();
  const { sendRequest, isLoading, error } = useHttp();
  const [data, setData] = useState({});
  const ctx = useContext(TokenContext);
  const { accessToken } = useVercelToken();
  const click = () => {
    console.log("accessToken" + accessToken);
  };
  return (
    <>
      {/* <Loader text="Please hold on for a moment while we setup things in background !!!"></Loader> */}
      <button onClick={click}>Click me</button>
    </>
  );
}
