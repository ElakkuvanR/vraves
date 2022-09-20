import React, { useEffect, useRef, useState } from "react";
import Layout from "components/ui/layout";
import SelectProjectType from "components/xm-cloud/select-project-type";
import XMCloudLogin from "components/xm-cloud/xm-cloud-login";
import useHttp from "hooks/use-http";

// Handles the XM Cloud Login and fetches the existing projects from XM Cloud
export default function projectType() {
  // Hooks initialization
  const { sendRequest } = useHttp();
  const [showProjectType, setShowProjectType] = useState(false);
  const [showExistingProjectSelect, setShowExistingProjectSelect] =
    useState(false);
  const [hideLogin, setHideLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Log in XMCloud
  const xmcloudLogin = async (handler) => {
    document.getElementById("globalLoader").style.display = "block";
    const vercelProjectid = localStorage.getItem("projectid");

    // Login callback handler
    const xmcloudLoginCallback = (result) => {
      // Sets the necessary state objs
      console.log(
        `project-type.js ----> xmcloudLoginCallback: success ${result.IsAuthenticated}`
      );
      setIsAuthenticated(result.IsAuthenticated);
      setHideLogin(true);
      setShowProjectType(true);
    };
    const apiUrl = `${process.env.XM_CLOUD_LOGIN_API_URL}?projectid=${vercelProjectid}&clientid=${loginProps.clientId.current.value}&clientsecret=${loginProps.clientSecret.current.value}`;
    console.log(`project-type.js ----> apiUrl: ${apiUrl}`);
    // Invoke fetch
    sendRequest(
      {
        url: apiUrl,
      },
      xmcloudLoginCallback
    ).finally(() => {
      const fetchProjectUrl = `${process.env.XM_CLOUD_FETCH_PROJECT_API_URL}?projectid=${vercelProjectid}`;
      console.log(`project-type.js ----> fetchProjectUrl: ${fetchProjectUrl}`);
      // FetchProjects callback handler
      const xmcloudFetchProjectCallback = (result) => {
        setShowExistingProjectSelect(true);
        console.log(
          `project-type.js ----> xmcloudFetchProjectCallback: success ${fetchProjectUrl}`
        );
        document.getElementById("globalLoader").style.display = "none";
      };
      // Invoke fetch
      sendRequest(
        {
          url: fetchProjectUrl,
        },
        xmcloudFetchProjectCallback
      );
    });
  };
  const loginProps = {
    clientId: useRef(),
    clientSecret: useRef(),
    login: xmcloudLogin,
  };

  return (
    <Layout>
      <form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
      <div className="bg-setup bg-no-repeat bg-cover bg-center rounded-lg">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="font-medium w-full uppercase text-center text-4xl sm:text-2xl dark:text-white text-gray-800">
            Setup Sitecore XM Cloud Project
          </h1>
        </section>
        {!hideLogin && <XMCloudLogin {...loginProps} hideLogin={hideLogin} />}
        {hideLogin && (
          <SelectProjectType
            showProjectType={showProjectType}
            showExistingProjectSelect={showExistingProjectSelect}
          />
        )}
      </div>
      </form>
    </Layout>
  );
}
