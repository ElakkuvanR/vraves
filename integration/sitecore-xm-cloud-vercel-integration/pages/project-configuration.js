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
      <form className="w-full max-w-sm">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Client-ID
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
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
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="clientsecret"
              ref={clientSecret}
            />
          </div>
        </div>

        {projectSetupComponent}

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              onClick={addProjectHandler}
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Setup Project
            </button>
          </div>
        </div>
      </form>
    </Layout>
  )
};

export default XMProjectConfiguration;