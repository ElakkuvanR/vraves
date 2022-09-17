import Layout from 'components/layout'
import SelectProjectType from 'components/SelectProjectType'

export default function projectType() {
  return (
    <Layout>
      <div className="w-full max-w-6xl divide-y">       

        <section className="py-4 ">
          <div className="space-y-2">            
            <section className="py-4 flex justify-center">
              <SelectProjectType />
            </section>
          </div>
        </section>

        {/* <section className="py-4 flex justify-center">
          
          <button
            className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
            onClick={() => {
              router.push(router.query.next);
            }}
          >
            Redirect me back to Vercel
          </button>
        </section> */}
      </div>
    </Layout>    
  )
}
