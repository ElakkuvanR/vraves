import React, { useRef } from "react";
const XMNewProject = ({ projectName, environmentName }) => {
  return (
    <div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="font-bold text-gray-800 md:text-right mb-1 md:mb-0 pr-4">
            Project Name
          </label>
        </div>
        <div className="md:w-2/4">
          <input
            className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            id="projectname"
            type="text"
            ref={projectName}
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="font-bold text-gray-800 text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Environment Name
          </label>
        </div>
        <div className="md:w-2/4">
          <input
            className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            id="environmentName"
            type="text"
            ref={environmentName}
          />
        </div>
      </div>
    </div>
  );
};

export default XMNewProject;