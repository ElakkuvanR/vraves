import Layout from 'components/layout'
import Link from 'next/link'

export default function Test(props) {
    return (
        <Layout>
            <div class="bg-white dark:bg-gray-800 flex relative z-20 items-center overflow-hidden">
                <div class="container mx-auto px-6 flex relative py-16">
                    <div class="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
                        <span class="w-20 h-2 bg-gray-800 dark:bg-white mb-12">
                        </span>
                        <h1 class="font-bebas-neue text-6xl sm:text-4xl font-black flex flex-col leading-none dark:text-white text-gray-800">
                            Integration 
                            <span class="text-5xl sm:text-3xl">
                                App
                            </span>
                        </h1>
                        <p class="text-sm sm:text-base text-gray-700 dark:text-white">
                            Integrate a project in XM Cloud through Vercel
                        </p>
                        <div class="flex mt-8">
                            <Link href="/project-configuration?isNewProject=false">
                                <a class="py-2 px-4 rounded-lg bg-gray-800 border-2 border-transparent text-white text-md mr-4 hover:bg-gray-800">
                                    Select Exisiting Project
                                </a>
                            </Link>
                            <Link href="/project-configuration?isNewProject=true">
                                <a class="py-2 px-4 rounded-lg bg-transparent border-2 border-gray-800 text-red dark:text-white hover:bg-gray-800 hover:text-white text-md">
                                    Create Project
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div class="hidden sm:block sm:w-1/3 lg:w-3/5 relative">
                        <img src="/Release.jpg" class="max-w-xs md:max-w-sm m-auto" />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
