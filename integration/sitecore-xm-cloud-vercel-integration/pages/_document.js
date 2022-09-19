import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class RootDoc extends Document {
  render() {
    return (
      <Html>
        <Head />
        <head></head>
        <body>
          <div id={"globalLoader"}>
            <div className="loader">
              <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-max">Please hold on and have some coffee !!!</div>
                <div className="w-10 h-10 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default RootDoc;
