import React, { useEffect, useState, useRef } from "react"
import Layout from 'components/layout'

const XMSelectProject = () => {
  const [projects, setProjects] = useState([])
  const [environments, setEnvironments] = useState([])
  const selectedProject = useRef();
  const selectedEnvironment = useRef();
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
    <div>
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
    </div>
  )
}

export default XMSelectProject