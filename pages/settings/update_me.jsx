import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Navbar';

export default function UpateMe() {
    let [w, setWindow] = useState(null);

    function update() {
        let body = new FormData(document.getElementById("form-auth"));
        fetch("/api/users/update", {
            method: "post",
            body,
            headers: { "token": window.token }
        }).then(async res => ({ status: res.status, json: (await res.json()) })).then(json => {
            if (json.status === 200)
                return createToast(json.json, "check");
            return createToast(json.json, "danger");
        });
    }

    useEffect(() => {
        setWindow(window);
    }, [])

    return (
        <div>
            <Navbar />
            <main>
                <form id='form-auth' encType="multipart/form-data">
                    <section
                        className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                        <div style={{ width: "60em" }} className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                            <div className="block">
                                <div
                                    className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                                    <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                        </svg>
                                    </span><span className="text-sm font-medium">We have Secured your information but not for
                                        you</span>
                                </div>
                            </div>
                            {w && w.user ?
                                <>
                                    <div className="flex items-center justify-center">
                                        <img style={{ width: "8em", height: "8em" }} className="w-28 h-28 rounded-full" src={w.user.Pic} alt="" />
                                    </div>
                                    <label className="text-sm my-2 font-medium">Your Username: </label>
                                    <input type="text" value={w.user.Name} name="Name" id="Name"
                                        className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your username here..." spellcheck="false" required />
                                    <label className="text-sm my-2 font-medium">Your Email: </label>
                                    <input type="text" value={w.user.Email} name="Email"
                                        className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your Email here..." spellcheck="false" required />
                                    <label className="text-sm my-2 font-medium">Your City: </label>
                                    <input type="text" value={w.user.City} name="City"
                                        className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your City here..." spellcheck="false" required />
                                    <label className="text-sm my-2 font-medium">Your Profile Pic: </label>
                                    <input type="file" name="Profile_Pic"
                                        className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your City here..." spellcheck="false" required />
                                    <label className="text-sm my-2 font-medium">Your Gender: </label>
                                    <select value={w.user.Gender} name="Gender"
                                        className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <label className="text-sm my-2 font-medium">Your Password: </label>
                                    <input type="password" name="Password"
                                        className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your Account Password here..." spellcheck="false" required />

                                    <div className="text-center flex items-center">
                                        <button className="flex mx-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Cancel
                                        </button>
                                        <button onClick={update} className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Update
                                        </button>
                                    </div>
                                </> : <>
                                    <div style={{ width: "8em", height: "8em" }} className="mx-auto my-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full px-2"></div>
                                    <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                    <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                    <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                    <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 mb-1"></div>
                                </>
                            }
                        </div>
                    </section>
                </form>
            </main>
        </div >
    )
}
