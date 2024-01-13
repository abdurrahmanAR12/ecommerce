import React, { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar';
import Head from 'next/head'
import Link from 'next/link';

export default function Settings() {
    let [w, setWindow] = useState(null),
        [interval, setInt] = useState(null)
    useEffect(() => {
        setInt(setInterval(() => {
            if (w && Object.keys(window).length !== Object.keys(w).length)
                setWindow(window);
            return;
        }, 1000));
        setWindow(window);
    }, [])

    return (
        <div>
            <Head>
                <title>Settings - Millionairo</title>
                <meta name="keywords" content="millionairo settings, millionairo, ecommerce settings" />
            </Head>
            <Navbar />
            <main style={{ width: "50%" }} className="w-md mx-auto">
                <div className="text-gray-800 bg-gray-200 p-3 rounded-lg">
                    <p className="text-2xl font-semibold">Settings</p>
                </div>
                <div className="my-4">
                    <div className="block">
                        <div
                            className="inline-flex justify-between items-center py-2 px-2 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                            <span className="text-sm font-semibold font-medium">Profile information</span>
                        </div>
                    </div>
                    <div className="border p-3 rounded-lg">
                        {w && w.user ? <>
                            <div className="flex items-center justify-center">
                                <img style={{ width: "8em", height: "8em" }} className="w-28 h-28 rounded-full" src={w.user.Pic} alt="" />
                            </div>
                            <div className="flex items-center">
                                <p className="text-base font-semibold">Username: </p>
                                <p className="text-base mx-2">{w.user.Name}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-base font-semibold">Your Email: </p>
                                <p className="text-base mx-2">{w.user.Email}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-base font-semibold">Your Gender: </p>
                                <p className="text-base mx-2">{w.user.Gender}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-base font-semibold">Your City: </p>
                                <p className="text-base mx-2">{w.user.City}</p>
                            </div>
                            <div className="flex justify-center my-2 items-center">
                                <Link href="/settings/update_me">
                                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Update Profile information
                                    </button>
                                </Link>
                                <button type="button"
                                    className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Download information
                                </button>
                            </div>
                        </> :
                            <>
                                <div style={{ width: "8em", height: "8em" }} className="mx-auto my-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full px-2"></div>
                                <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                            </>
                        }
                    </div>
                </div>
                <div className="my-4">
                    <div className="block">
                        <div
                            className="inline-flex justify-between items-center py-2 px-2 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                            <span className="text-sm font-semibold font-medium">Privacy and Security</span>
                        </div>
                    </div>
                    <div className="block">
                        <div
                            className="inline-flex justify-between items-center py-1 px-2 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                            <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                </svg>
                            </span>
                            <span className="text-sm font-semibold font-medium">We respect your Privacy and Data that you made
                                on our Store, Any piece of your information can not leak or spied, We have best of our
                                Security</span>
                        </div>
                    </div>
                    <div
                        className="w-full items-center py-1 px-2 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                        <div className="my-2 px-2 flex items-center">
                            <div className="text-base flex-1">
                                <p>
                                    Can we use your information for Suggessions on our Store
                                </p>
                            </div>
                            <div className="mx-4">
                                <select
                                    className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="Yes">Yes&apos; We can</option>
                                    <option value="Yes">No&apos; We can't</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-full items-center py-1 px-2 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                        <div className="my-2 px-2 flex items-center">
                            <div className="text-base flex-1">
                                <p>Do you agree if we use your Search History for improving searching on the store</p>
                            </div>
                            <div className="mx-4">
                                <select
                                    className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="Yes">Yes&apos; We can</option>
                                    <option value="Yes">No&apos; We can't</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-full items-center py-1 px-2 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                        <div className="my-2 px-2 flex items-center">
                            <div className="text-base flex-1">
                                <p>Store my Single Piece of data for improvements</p>
                            </div>
                            <div className="mx-4"><select
                                className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="Yes">Yes&apos; We can</option>
                                <option value="Yes">No&apos; We can't</option>
                            </select></div>
                        </div>
                    </div>
                </div>
                {/* <div
                    className="flex w-full items-center py-1 px-2 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="my-2 px-2 flex items-center">
                        <div className="text-base flex-1">
                            <p>How would your Expierience on the Store</p>
                        </div>
                        <div className="mx-4"></div>
                    </div>
                </div> */}
            </main>
        </div>
    );
}
