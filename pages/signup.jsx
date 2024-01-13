import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Signup() {
    let [cities, setCities] = useState([]),
        [w, setWindow] = useState(null);

    function getCities() {
        fetch("/api/data/cities").then(res => res.json()).then(cities => {
            setCities(cities);
        }).catch(__ => {
            window.createToast("Can not reach to the system");
        });
    }

    function createAc() {
        let body = new FormData(document.getElementById("form-auth"));
        fetch(`/api/auth/new`, {
            method: "post",
            body
        }).then(data => data.json()).then(json => {
            if (json.token) {
                localStorage[window.tokenString] = json.token;
                window.createToast(json.msg, "check");
            }
            else if (typeof json === "string") window.createToast(json, "danger");
        });
    }

    useEffect(() => {
        setWindow(setInterval(() => {
            if (window.token)
                window.location.pathname = "/";
            clearInterval(w)
        }, 1000));

        getCities();
    }, [])

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto" src="/images/logo.png" alt="no" />
                    <h1 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Millionairo</h1>
                    <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Signup</h2>
                    <h3 className="mt-2 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900">
                        Create Your Account and enjoy Amazing discounts on every product
                    </h3>
                    <form id="form-auth" className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <label for="name" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-1">
                            <input id="name" placeholder="Your Username here" name="Name" type="text" required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
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
                            <div className="mt-1">
                                <label for="CPassword"
                                    className="block text-sm font-medium leading-6 text-gray-900">Confirm
                                    Password</label>
                                <input id="CPassword" placeholder="Confirm your Password" name="CPassword"
                                    type="password" autocomplete="current-password" required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            <label for="Age" className="block text-sm font-medium leading-6 text-gray-900">Your
                                Age</label>
                            <div className="mt-1">
                                <input id="Age" name="Age" type="number" placeholder="Enter your Age here"
                                    autocomplete="current-password" required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            <label for="City" className="block text-sm font-medium leading-6 text-gray-900">What is your Gender?</label>
                            <div className="mt-1">
                                <select id="Gender" name="Gender" type="text" required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                            <label for="City" className="block text-sm font-medium leading-6 text-gray-900">Select your City</label>
                            <div className="mt-1">
                                <select name="City" type="text" required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    {cities.length && cities.map(city => {
                                        return <option key={city} value={city}>{city}</option>
                                    })}
                                </select>
                            </div>
                            <div className='my-2'>
                                <button onClick={createAc} type="button"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Create account
                                </button>
                            </div>
                            <p id="messenger" className="block rounded-md bg-black-600 text-sm font-medium leading-6 text-gray-900"></p>
                        </div>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already have an Account? <Link href="/login">
                                <span role='button' className='className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"'>
                                    Login instead
                                </span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
