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
  } else{
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
        `/api/xmcloud/create-xm-cloud-env?environmentName=${selectedEnvironment.current.value}&projectid=${projectId}&domain=${domainsResult?.domains[0]?.name}&rootDirectory=${vercelRootDirectory}`
      );
      const result = await resExistingProject.json();
      window.location.href(localStorage.getItem("next"));
    }
  };

  return (
    <Layout>
      <form className="w-full max-w-sm">
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