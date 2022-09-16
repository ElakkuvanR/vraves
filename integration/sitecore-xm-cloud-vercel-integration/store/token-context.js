import React, { useState, useEffect, useCallback } from "react";

const TokenContext = React.createContext({
  vercelcode: "",
  projectid: "",
  nexturl: "",
  repourl: "",
  accesstoken: "",
  setTokenValues: (code, projectId, nextUrl) => {},
});

export const TokenContextProvider = (props) => {
  const [vercelCode, setVercelCode] = useState("");
  const [projectId, setProjectId] = useState("");
  const [nextUrl, setNextUrl] = useState();
  const [repoUrl, setRepoUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const setTokenHandler = (code, projectid, nexturl, token, repo) => {
    setVercelCode(code);
    setProjectId(projectid);
    setNextUrl(nexturl);
    setAccessToken(token);
    setRepoUrl(repo);
  };

  const contextValue = {
    vercelcode: vercelCode,
    projectid: projectId,
    nexturl: nextUrl,
    repourl: repoUrl,
    accesstoken: accessToken,
    setTokenValues: setTokenHandler,
  };
  return (
    <TokenContext.Provider value={contextValue}>
      {props.children}
    </TokenContext.Provider>
  );
};

export default TokenContext;