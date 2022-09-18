import Link from 'next/link'

const SelectProjectType = ({showProjectType, showExistingProjectSelect}) => {
    return (
        <div className="w-full max-w-xl divide-y" style={{
            display: showProjectType ? "inline" : "none"
        }}>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">     
                <section className="py-4 flex justify-center">
                    <Link href="/project-configuration?isNewProject=true">
                        <a className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md 
                        hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Create a new project</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400"></p>
                        </a>
                    </Link>
                </section>
                <section className="py-4 flex justify-center" style={{
                    display: showExistingProjectSelect ? "inline" : "none"
                }}>
                    <Link href="/project-configuration?isNewProject=false">
                        <a className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md 
                        hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Select an existing project</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400"></p>
                        </a>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default SelectProjectType;