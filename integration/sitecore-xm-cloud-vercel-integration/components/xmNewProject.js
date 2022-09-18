import React, { useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:8000");

const XMNewProject = () => {
  const projectName = useRef();
  const environmentName = useRef();

  client.onmessage = (message) => {
    console.log("got reply! ", message.data);
  };
  client.onopen = () => {
    console.log("Client connected");
  };
  let projectId, code;
  useEffect(() => {
    projectId = localStorage.getItem("projectid");
    code = localStorage.getItem("code");
  });
  
  return (
    <div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
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
          <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
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