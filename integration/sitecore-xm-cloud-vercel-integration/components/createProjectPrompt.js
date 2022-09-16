import Layout from 'components/layout'
import Link from 'next/link'

const CreateProjectPrompt = () => {    
    return (
        <Layout>
        <div className="w-full max-w-2xl divide-y">
            {/* <section className="py-4 flex items-center space-x-2 justify-center">
                <h1 className="text-lg font-medium">Please select an option :</h1>
            </section> */}
            <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
                <section className="py-4 flex justify-center">
                    <Link href="\select-project">
                        <a class="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md 
                        hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Select an existing project</h5>
                            <p class="font-normal text-gray-700 dark:text-gray-400"></p>
                        </a>
                    </Link>
                </section>

                <section className="py-4 flex justify-center">
                    <Link href="\createNewProject">
                        <a class="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md 
                        hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Create a new project</h5>
                            <p class="font-normal text-gray-700 dark:text-gray-400"></p>
                        </a>
                    </Link>
                </section>
            </div>

        </div>
    </Layout >
    );
  };
  
  export default CreateProjectPrompt;