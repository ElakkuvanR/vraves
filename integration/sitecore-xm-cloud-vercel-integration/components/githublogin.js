import React, { Component } from "react";
import Link from 'next/link';

export default function GithubLogin(props) {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const REDIRECT_URI = process.env.GITHUB_CLONE_REDIRECT_URL ?? "http://localhost:3000/configure";
  console.log("Github href", `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}`)
  return (
    <Link href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}`}>
          <a className="py-2 px-4 rounded-lg bg-gray-800 border-2 border-transparent text-white text-md mr-4 hover:bg-gray-800" style={{
      display: props?.status === "logged-in" ? "none" : "inline"
    }}>Authorize Github</a>
    </Link>
  );
}
