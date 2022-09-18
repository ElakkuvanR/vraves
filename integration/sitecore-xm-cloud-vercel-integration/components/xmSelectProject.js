import React, { useEffect, useState } from "react"

const XMSelectProject = ({ selectedProject, selectedEnvironment }) => {
  const [projects, setProjects] = useState([])
  const [environments, setEnvironments] = useState([])

  let vercelProjectid;

  const fetchProjects = async () => {
    vercelProjectid = localStorage.getItem("projectid");
    const response = await fetch(`/api/xmcloud/fetch-xm-projects?projectid=${vercelProjectid}`)
    const data = await response.json()
    if (data.length >= 1) {
      setProjects(data)
      fetchEnvironments()
    }
  }

  const fetchEnvironments = async () => {
    const response = await fetch(
      `/api/xmcloud/fetch-xm-environments?projectid=${selectedProject.current.value}&vercelprojid=${vercelProjectid}`
    )
    const data = await response.json()
    if (data.length >= 1) {
      setEnvironments(data)
    }
  }

  const handleProjectSelection = event => {
    fetchEnvironments()
  };

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <section className="py-4 ">
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-medium">
          Please provide below details
        </h1>
        <section className="py-4 flex justify-center">
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
        </section>
      </div>
    </section>

  )
}

export default XMSelectProject