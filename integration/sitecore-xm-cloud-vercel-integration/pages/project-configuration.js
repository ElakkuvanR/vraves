import React, { useEffect, useRef } from "react"
import Layout from 'components/ui/layout'
import { useRouter } from "next/router";
import XMNewProject from 'components/XMNewProject'
import XMSelectProject from 'components/XMSelectProject'

const XMProjectConfiguration = () => {
  const router = useRouter();

  const projectName = useRef();
  const environmentName = useRef();
  const selectedProject = useRef();
  const selectedEnvironment = useRef();

  const isNewProject = (router.query.isNewProject === 'true');
  var projectSetupComponent;
  if (isNewProject) {
    projectSetupComponent = <XMNewProject
      projectName={projectName}
      environmentName={environmentName}
    />
  } else {
    projectSetupComponent = <XMSelectProject
      selectedProject={selectedProject}
      selectedEnvironment={selectedEnvironment}
    />
  }

  let projectId, code;
  useEffect(() => {
    projectId = localStorage.getItem("projectid");
    code = localStorage.getItem("code");
  });

  const addProjectHandler = async (handler) => {
    const vercelDomain = await fetch(
      `/api/vercel/get-domain-by-projectid?projectid=${projectId}&code=${code}`
    );
    const domainsResult = await vercelDomain.json();
    console.log(domainsResult);
    const vercelRootDirectory = localStorage.getItem("rootDirectory");

    if (isNewProject) {
      const resNewProject = await fetch(
        `/api/xmcloud/create-xm-cloud-env?projectname=${projectName.current.value}&environmentName=${environmentName.current.value}&projectid=${projectId}&domain=${domainsResult?.domains[0]?.name}&rootDirectory=${vercelRootDirectory}`
      );
      const result = await resNewProject.json();
      window.location.href(localStorage.getItem("next"));
    } else {
      const resExistingProject = await fetch(
        `/api/xmcloud/create-xm-cloud-env?environmentId=${selectedEnvironment.current.value}&projectid=${projectId}&domain=${domainsResult?.domains[0]?.name}&rootDirectory=${vercelRootDirectory}`
      );
      const result = await resExistingProject.json();
      window.location.href(localStorage.getItem("next"));
    }
  };

  return (
    <Layout>
      <form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
        <section className="py-4 ">
          <div className="space-y-2 text-center">
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
            {/* <button
              onClick={router.back()}
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Go Back
            </button> */}
          </div>
        </section>
        {/* <section className="py-4 ">
          <div className="md:flex md:items-center">
            <div className="md:w-2/3"> */}

              {/* <button
              onClick={router.back()}
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Go Back
            </button> */}
            {/* </div>
          </div>
        </section> */}
      </form>
    </Layout>
  )
};

export default XMProjectConfiguration;