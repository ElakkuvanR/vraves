import React, { useEffect, useRef } from "react"
import Layout from 'components/ui/layout'
import SelectProjectType from 'components/SelectProjectType'
import XMCloudLogin from 'components/xmcloudlogin';

export default function projectType() {
  const [showProjectType, setShowProjectType] = React.useState(false)
  const [showExistingProjectSelect, setShowExistingProjectSelect] = React.useState(false)
  const [hideLogin, setHideLogin] = React.useState(false);
  
  //Log in XMCloud
  const xmcloudLogin = async (handler) => {
    const vercelProjectid = localStorage.getItem("projectid");
    const xmCloudLogin = await fetch(`/api/xmcloud/xm-cloud-login?projectid=${vercelProjectid}&clientid=${loginProps.clientId.current.value}&clientsecret=${loginProps.clientSecret.current.value}`);
    const loginResponse = await xmCloudLogin.json();
    if (loginResponse.IsAuthenticated) {
      console.log(loginResponse);
      setHideLogin(true);
      setShowProjectType(true);
      const response = await fetch(`/api/xmcloud/fetch-xm-projects?projectid=${vercelProjectid}`)
      const data = await response.json()
      if (data.length >= 1) {
        setShowExistingProjectSelect(true);
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
        <XMCloudLogin {...loginProps} hideLogin={hideLogin} />
        <SelectProjectType showProjectType={showProjectType} showExistingProjectSelect={showExistingProjectSelect}  />
      </div>
    </Layout>
  )
}
