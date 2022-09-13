import React, { Component } from "react";


const CLIENT_ID = "a7c691691b0f02469680";
const REDIRECT_URI = "http://localhost:3000/configure";

export default function GithubLogin(props) {
   
    console.log("props", props)
    return (
        <a className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md" style={{
            display: props?.status === "logged-in" ? "none" : "inline"
          }}
        href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`}
        >
       Authorize Github
      </a>
    );
}
