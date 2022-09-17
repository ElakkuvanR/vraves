import React, { useRef } from "react"
import Layout from 'components/layout'
import { useRouter } from "next/router";
import XMNewProject from 'components/XMNewProject'
import XMSelectProject from 'components/XMSelectProject'

const XMProjectConfiguration = () => {
  const router = useRouter();

  const clientId = useRef();
  const clientSecret = useRef();

  const isNewProject = (router.query.isNewProject === 'true');
  var projectSetupComponent;
  if (isNewProject) {
    projectSetupComponent = <XMNewProject />
  } else{
    projectSetupComponent = <XMSelectProject />
  }

  const addProjectHandler = async (handler) => {
    const vercelDomain = await fetch(
      `/api/vercel/get-domain-by-projectid?projectid=${projectId}&code=${code}`
    );
    const domainsResult = await vercelDomain.json();
    console.log(domainsResult);
    const vercelRootDirectory = localStorage.getItem("rootDirectory");

    if (isNewProject) {
      const resNewProject = await fetch(
        `/api/xmcloud/create-xm-cloud-env?clientid=${clientId.current.value}&clientsecret=${clientSecret.current.value}&projectname=${projectName.current.value}&environmentName=${environmentName.current.value}&projectid=${projectId}&domain=${domainsResult?.domains[0]?.name}&rootDirectory=${vercelRootDirectory}`
      );
    } else {
      const resExistingProject = await fetch(
        `/api/xmcloud/create-xm-cloud-env?clientid=${clientId.current.value}&clientsecret=${clientSecret.current.value}&envid=${selectedEnvironment.current.value}&projectid=${projectId}&domain=${domainsResult?.domains[0]?.name}&rootDirectory=${vercelRootDirectory}`
      );
    }
  };

  return (
    <Layout>
      <form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Client-ID
            </label>
          </div>
          <div className="md:w-2/4">
            <input
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              id="clientid"
              type="text"
              ref={clientId}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Client-Secret
            </label>
          </div>
          <div className="md:w-2/4">
            <input
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              id="clientsecret"
              ref={clientSecret}
            />
          </div>
        </div>

        {projectSetupComponent}

        <div className="w-full px-6 pb-6 ml-auto text-gray-500 md:w-1/3">
            <button
              onClick={addProjectHandler}
              className="py-2 px-4  bg-gray-600 hover:bg-gray-800 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              type="button"
            >
              Setup Project
            </button>
        </div>
      </form>
    </Layout>
  )
};

export default XMProjectConfiguration;