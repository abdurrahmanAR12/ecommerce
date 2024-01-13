import React, { useContext } from 'react';
import { AdminTokenString } from './Product';
import { context } from '../context/context';

export default function Login() {
    let { setLoggedIn } = useContext(context);

    function createAc() {
        let body = new FormData(document.getElementById("form-auth"));
        fetch(`/api/auth/admins/login`, {
            method: "post",
            body
        }).then(async res => {
            let json = (await res.json());
            if (typeof json == "string")
                return ({ status: res.status, msg: json })
            return ({ status: res.status, ...json })
        }).then(json => {
            // console.log(json)
            if (json.msg && !json.token)
                window.createToast(json.msg, json.status === 200 ? "check" : "danger");
            else {
                localStorage[AdminTokenString] = json.token;
                if (localStorage[AdminTokenString])
                    setLoggedIn(true);
                window.createToast(json.msg, "check");
            }
        });
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="mt-2 text-center">
                        <div className="flex justify-center items-center">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar" type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" fill-rule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                    </path>
                                </svg>
                            </button>
                            <>
                                <span role='button' className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Millionairo</span>
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                    viewBox="0 0 20 18">
                                    <path
                                        d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex text-sm p-1 justify-center bg-gray-600 text-white rounded-md w-16">Admins</span>
                            </>
                        </div>
                    </div>
                    <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Enter your Credential Information to get to Dashboard</h2>
                    <form id='form-auth' className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email
                            address</label>
                        <div className="mt-1">
                            <input id="email" placeholder="Your Email here" name="Email" type="email"
                                autocomplete="off" required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-1">
                            <input id="password" name="Password" placeholder="Your Password here" type="password"
                                autocomplete="off" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <div className='my-2'>
                                <button onClick={createAc} type="button"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Sign In
                                </button>
                            </div>
                            <p id="messenger" className="block rounded-md bg-black-600 text-sm font-medium leading-6 text-gray-900"></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
