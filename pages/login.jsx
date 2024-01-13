import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Signup() {
    function createAc() {
        let body = new FormData(document.getElementById("form-auth"));
        fetch(`/api/auth/login`, {
            method: "post",
            body
        }).then(async res => {
            let json = (await res.json());
            if (typeof json == "string")
                return ({ status: res.status, msg: json })
            return ({ status: res.status, ...json })
        }).then(json => {
            if (json.token) {
                localStorage[window.tokenString] = json.token;
                window.createToast(json.msg, "check");
            }
            else window.createToast(json.msg, json.status === 200 ? "check" : "danger");
        });
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto" src="/images/logo.png" alt="no" />
                    <h1 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Millionairo</h1>
                    <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Welcome Back</h2>
                    <h3 className="mt-2 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900">
                        Enter your basic Account information below to Get inside
                    </h3>
                    <form id='form-auth' className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email
                            address</label>
                        <div className="mt-1">
                            <input id="email" placeholder="Your Email here" name="Email" type="email"
                                autocomplete="email" required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-1">
                            <input id="password" name="Password" placeholder="Your Password here" type="password"
                                autocomplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />

                            <div className='my-2'>
                                <button onClick={createAc} type="button"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Sign In
                                </button>
                            </div>
                            <p id="messenger" className="block rounded-md bg-black-600 text-sm font-medium leading-6 text-gray-900"></p>
                        </div>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Not a member? <Link href="/signup">
                                <span role='button' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Create your Account now
                                </span>
                            </Link>
                        </p>
                        <p className="m-2 text-center text-sm text-gray-500">
                            <Link href="/recovery">
                                <span role='button' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    I have Forgot my Account Password
                                </span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
