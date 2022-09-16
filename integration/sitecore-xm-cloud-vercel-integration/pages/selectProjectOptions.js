import Layout from 'components/layout'

export default function SelectProjectOptions() {
  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">
            Setup Sitecore XM Cloud Project
          </h1>
        </section>

        <section className="py-4 ">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-medium">
              Please provide below details
            </h1>
            <section className="py-4 flex justify-center">
              <CreateProjectPrompt />
            </section>
          </div>
        </section>

        <section className="py-4 flex justify-center">
          {/* This redirect should happen programmatically if you're done with everything on your side */}
          <button
            className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
            onClick={() => {
              router.push(router.query.next);
            }}
          >
            Redirect me back to Vercel
          </button>
        </section>
      </div>
    </Layout>    
  )
}
