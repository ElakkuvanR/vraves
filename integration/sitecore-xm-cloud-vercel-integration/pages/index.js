import Layout from 'components/ui/layout'

export default function Index() {
  return (
    <Layout>
    <div class="bg-white dark:bg-gray-800 flex relative z-20 items-center">
    <div class="container mx-auto px-6 flex flex-col justify-between items-center relative py-8">
        <div class="flex flex-col">
            <h1 class="font-light w-full uppercase text-center text-4xl sm:text-5xl dark:text-white text-gray-800">
                XM Cloud Integration with vercel
            </h1>
            <h2 class="font-light max-w-2xl mx-auto w-full text-xl dark:text-white text-gray-500 text-center py-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
            </h2>
            <div class="flex items-center justify-center mt-4">
                <a href="#" class="uppercase py-2 px-4 bg-gray-800 border-2 border-transparent text-white text-md mr-4 hover:bg-gray-900">
                    Repository
                </a>
                <a href="#" class="uppercase py-2 px-4 bg-transparent border-2 border-gray-800 text-gray-800 dark:text-white hover:bg-gray-800 hover:text-white text-md">
                    Documentation
                </a>
            </div>
        </div>
        <div class="block w-full mx-auto mt-6 md:mt-0 relative">
            <img src="/Homepage2.png" class="max-w-xs md:max-w-2xl m-auto"/>
        </div>
    </div>
</div>

    </Layout>
  )
}
