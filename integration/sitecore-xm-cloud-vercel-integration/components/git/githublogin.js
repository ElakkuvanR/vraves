import React, { Component } from "react";
import Link from "next/link";

// Handles the GitHub Login and returns an access code
export default function GithubLogin(props) {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const REDIRECT_URI =
    process.env.GITHUB_CLONE_REDIRECT_URL ?? "http://localhost:3000/configure";
  console.log(
    `githublogin.js ----> github url: ${process.env.GITHUB_AUTHORIZE_URL}?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}`
  );
  return (
    <Link
      href={`${process.env.GITHUB_AUTHORIZE_URL}?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}`}
    >
      <a
        className="bg-gray-800 hover:bg-gray-800 text-white px-6 py-1 rounded-md"
        style={{
          display: props?.status === "logged-in" ? "none" : "inline",
        }}
      >
        Authorize Github
      </a>
    </Link>
  );
}
