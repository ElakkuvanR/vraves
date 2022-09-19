import Link from "next/link";

const SelectProjectType = ({ showProjectType, showExistingProjectSelect }) => {
  return (
    <div
      className="w-full max-w-xl divide-y"
      style={{
        display: showProjectType ? "inline" : "none",
      }}
    >
      <div>
        <div className="container mx-auto px-6 flex relative py-16">
          <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
            <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12"></span>
            <h1 className="font-bebas-neue text-6xl sm:text-4xl font-black flex flex-col leading-none dark:text-white text-gray-800">
              Time To Create The Project
            </h1>
            <p className="text-sm sm:text-base text-gray-700 dark:text-white">
              Select or create a new project
            </p>
            <div className="flex mt-8">
              <section
                style={{
                  display: showExistingProjectSelect ? "inline" : "none",
                }}
              >
                <Link href="/project-configuration?isNewProject=false">
                  <a className="py-2 px-4 rounded-lg bg-gray-800 border-2 border-transparent text-white text-md mr-4 hover:bg-gray-800">
                    Select Existing Project
                  </a>
                </Link>
              </section>
              <section>
              <Link href="/project-configuration?isNewProject=true">
                <a className="py-2 px-4 rounded-lg bg-transparent border-2 border-gray-800 text-red dark:text-white hover:bg-gray-800 hover:text-white text-md">
                  Create Project
                </a>
              </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProjectType;
