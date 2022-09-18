import React, { useEffect, useRef } from "react"
import Layout from 'components/ui/layout'
import SelectProjectType from 'components/SelectProjectType'
import XMCloudLogin from 'components/xmcloudlogin';
import XMSelectProject from 'components/xmSelectProject';

export default function projectType() {
  const selectProjectProps = {
    loggedin: false,
    hasprojects: false
  };
  //Log in XMCloud
  const xmcloudLogin = async (handler) => {
    const vercelProjectid = localStorage.getItem("projectid");
    const xmCloudLogin = await fetch(`/api/xmcloud/fetch-xm-projects?projectid=${vercelProjectid}&clientid=${loginProps.clientId}&clientsecret=${loginProps.clientSecret}`);
    const loginResponse = await xmCloudLogin.json();
    if(loginResponse.IsAuthenticated){
      const response = await fetch(`/api/xmcloud/fetch-xm-projects?projectid=${vercelProjectid}`)
      const data = await response.json()
      if (data.length >= 1) {
        selectProjectProps.hasprojects = true;
      }
    }
  }

  const loginProps = {
    clientId: useRef(),
    clientSecret: useRef(),
    login: xmcloudLogin
  };

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">
            Setup Sitecore XM Cloud Project
          </h1>
        </section>
        <XMCloudLogin {...loginProps}/>
        <SelectProjectType {...selectProjectProps} />
      </div>
    </Layout>
  )
}
