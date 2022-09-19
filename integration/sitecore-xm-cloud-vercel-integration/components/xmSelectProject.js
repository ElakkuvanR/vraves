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
    vercelProjectid = localStorage.getItem("projectid");
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
    <div className="space-y-2 text-center">
      <h1 className="font-medium w-full uppercase text-center text-4xl sm:text-2xl dark:text-white text-gray-800">
        Please provide below details
      </h1>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="font-bold text-gray-800 md:text-right mb-1 md:mb-0 pr-4">
            Project
          </label>
        </div>
        <div className="md:w-2/4">
          <select className="block w-52 text-gray-700 py-2 px-3 w-full py-2 px-4  border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
          <label className="font-bold text-gray-800 md:text-right mb-1 md:mb-0 pr-4">
            Environment
          </label>
        </div>
        <div className="md:w-2/4">
          <select className="block w-52 text-gray-700 py-2 px-3 border border-gray-300 bg-white w-full py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ref={selectedEnvironment}>
            {environments.map(environment => (
              <option key={environment.id} value={environment.id}>
                {environment.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

  )
}

export default XMSelectProject