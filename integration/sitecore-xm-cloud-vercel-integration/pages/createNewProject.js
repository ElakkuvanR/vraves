import Layout from 'components/UI/layout'
import XMCloudForm from 'components/xmcloudform'

export default function CreateNewProject() {

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
                <XMCloudForm/>
              </section>
           </div>
        </section>        
      </div>
    </Layout>
  )
}
