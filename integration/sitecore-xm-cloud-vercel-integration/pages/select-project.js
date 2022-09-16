import React, { useEffect, useState, useRef } from "react"
import Layout from 'components/layout'

const ProjectSelection = () => {
  const clientId = useRef();
  const clientSecret = useRef();
  const [projects, setProjects] = useState([])
  const [environments, setEnvironments] = useState([])
  const selectedProject = useRef();
  const selectedEnvironment = useRef();

  const fetchProjects = async () => {
    const response = await fetch("/api/xmcloud/fetch-xm-projects")
    const data = await response.json()
    if (data.length >= 1) {
      setProjects(data)
      fetchEnvironments()
    }
  }

  const fetchEnvironments = async () => {
    const response = await fetch(
      `/api/xmcloud/fetch-xm-environments?projectid=${selectedProject.current.value}`
    )
    const data = await response.json()
    if (data.length >= 1) {
      setEnvironments(data)
    }
  }

  const handleProjectSelection = event => {
    fetchEnvironments()
  };

  const addProjectHandler = async (handler) => {
    const res = await fetch(
      `/api/xmcloud/create-xm-cloud-env?clientid=${clientId.current.value}&clientsecret=${clientSecret.current.value}&projectname=${selectedProject.current.value}&envname=${selectedEnvironment.current.value}`
    );
  };

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">Setup Sitecore XM Cloud Project</h1>
        </section>

        <section className="py-4 ">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-medium">
              Select and existing project and enviroment
            </h1>
          </div>
        </section>

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

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Project
            </label>
          </div>
          <div className="md:w-2/3">
            <select className="mt-1 bg-gray-200 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              ref={selectedProject} onChange={handleProjectSelection}>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Environment
            </label>
          </div>
          <div className="md:w-2/3">
            <select className="mt-1 bg-gray-200 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              ref={selectedEnvironment}>
              {environments.map(environment => (
                <option key={environment.id} value={environment.id}>
                  {environment.name}
                </option>
              ))}
            </select>
          </div>
        </div>

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
      </div>
    </Layout>
  )
}

export default ProjectSelection