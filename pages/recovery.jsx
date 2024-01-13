import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import Sidebar from '../Components/sidebar'

export default function Forgot_password() {
    let [loading, setLoading] = useState(false)

    function recover() {
        setLoading(true)
        let body = new FormData(document.getElementById("form-auth"))
        fetch("/api/auth/recovery", {
            method: "post",
            body
        }).then(async res => {
            return { status: res.status, json: await res.json() }
        }).then(json => {
            setLoading(false)
            createToast(json.json, json.status === 200 ? "check" : 'danger')
        }).catch(e => {
            setLoading(false)
            createToast("Can't reach the system", 'danger');
        });
    }

    return (
        <div>
            <Head>
                <title>Millionairo - Password Recovery</title>
            </Head>
            <Sidebar/>
            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                    <div
                        className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                        <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                            </svg>
                        </span><span className="text-sm lg:font-medium">Next time, create a strong but a remebrable Password for your
                            Account</span>
                    </div>
                    <h1
                        className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
                        It is not a mistake if you have forgot your Password
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
                        Here is the method to get your Password resetted quick and easily,
                        just fill your Email address below
                    </p>
                    <form id='form-auth' onSubmit={e => e.preventDefault()} className="w-full max-w-md mx-auto">
                        <label for="default-email" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Email
                            sign-up</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path
                                        d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                    <path
                                        d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                </svg>
                            </div>
                            <input type="email" name='Email'
                                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter your email here..." required />
                            <button disabled={loading} onClick={recover} type="button"
                                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Reset
                            </button>
                        </div>
                    </form>
                    <div className="w-full my-4 text-center max-w-md mx-auto">
                        <Link href={"/login"}>
                            <span role="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Cancel Reset
                            </span>
                        </Link>
                    </div>
                    <div
                        className="inline-flex my-4 justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                        <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                            </svg>
                        </span><span className="text-sm lg:font-medium">We are going to reset your Password and then we will Email the
                            it to your Address</span>
                    </div>
                </div>
                <div
                    className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0">
                </div>
            </section>
        </div>
    );
}
