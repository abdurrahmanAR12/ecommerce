import React, { useContext } from 'react'
import Sidebar from '../../Components/sidebar'
import Link from 'next/link'
import { context, AdminTokenString } from '../../Components/context/context';
import Login from '../../Components/Admin/Login';

export default () => {
    let { loggedIn } = useContext(context);
    return (<>
        {loggedIn ? <New /> : <Login />}
    </>)
}


function New() {
    function sendApiCall() {
        let body = new FormData(document.getElementById("form-auth"))
        fetch("/api/auth/admins/new", {
            method: "post",
            body,
            headers: { "admin_token": localStorage[AdminTokenString] }
        }).then(async r => {
            return { status: r.status, json: await r.json() }
        }).then(response => {
            if (response.status === 200) {
                window.createToast(response.json, "check");
                localStorage[AdminTokenString] = response.json.token;
                createToast("Logged in successfully");
            } else window.createToast(response.json, "danger");
        }).catch(_e => window.createToast("Error, Failed to reach the system", "danger"));
    }


    return (
        <div>
            <Sidebar />
            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div style={{ width: "60em" }} className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                    <form className="w-full border-b max-w-full mx-auto" id='form-auth' encType="multipart/form-data">
                        <div className="block">
                            <div
                                className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                                <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                    </svg>
                                </span><span className="text-sm font-medium">Create our new but another Administrator:</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm my-2 font-medium">Admin Username: </label>
                            <input type="text" name="Name"
                                className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Username here..." spellCheck="false" required />
                            <label className="text-sm my-1 font-medium">Admin Email Address: </label>
                            <input type="text" name="Email"
                                className="block w-full mb-4 p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Email Address here..." spellCheck="false" required />
                            <label className="text-sm my-1 font-medium">Password: </label>
                            <input type='password' name="Password"
                                className="block w-full mb-4 p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Admin Password here..." required />
                            <label className="text-sm my-1 font-medium">Confirm Password: </label>
                            <input type='password' name="CPassword"
                                className="block w-full mb-4 p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Confirm Password here..." required />
                        </div>
                        <div className="flex center  absolute right-2.5 bottom-2.5">
                            <Link href="/admin/dash">
                                <span className="text-black mx-2 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800">
                                    Cancel
                                </span>
                            </Link>
                            <button onClick={sendApiCall} type="button"
                                className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Create Admin
                            </button>
                        </div>
                    </form>
                </div>
                <div
                    className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0">
                </div>
            </section>
        </div>
    )
}
