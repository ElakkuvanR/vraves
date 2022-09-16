import React, { useEffect, useState } from "react"
import Layout from 'components/layout'

const AsyncAwait = () => {
  const [projects, setProjects] = useState([])

  const fetchData = async () => {
    const response = await fetch("/api/xmcloud/fetch-xm-projects")
    const data = await response.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">Setup Sitecore XM Cloud Project</h1>
        </section>

        <section className="py-4 ">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-medium">Please provide below details</h1>
            <section className="py-4 flex justify-center">
              {projects.length > 0 && (
                <select id="country" name="country" autocomplete="country-name" class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  {projects.map(project => (
                    <option key={project.id}>{project.name}</option>
                  ))}
                </select>
              )}
            </section>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default AsyncAwait