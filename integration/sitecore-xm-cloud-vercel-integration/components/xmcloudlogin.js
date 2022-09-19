import React, { useRef } from "react";
import { render } from "react-dom";
const XMCloudLogin = (props, { hideLogin }) => {
    return (
        <>
            <section className="py-4 " style={{
                display: hideLogin ? "none" : "inline"
            }}>
                <div className="space-y-2 text-center">
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="font-light text-gray-800 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                Client-ID
                            </label>
                        </div>
                        <div className="md:w-2/4">
                            <input
                                className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                id="clientid"
                                type="text"
                                ref={props.clientId}
                            />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="font-light text-gray-800 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                Client-Secret
                            </label>
                        </div>
                        <div className="md:w-2/4">
                            <input
                                className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                id="clientsecret"
                                ref={props.clientSecret}
                            />
                        </div>
                    </div>
                    <div className="w-full px-6 pb-6 ml-auto text-gray-500 md:w-1/3">
                    <button
                        onClick={props.login}
                        className="py-2 px-4 bg-gray-800 hover:bg-gray-800 focus:ring-gray-800 focus:ring-offset-gray-800 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                        type="button"
                    >
                        Log-in XMCloud
                    </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default XMCloudLogin;