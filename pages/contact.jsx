import React from 'react'
import Navbar from '../Components/Navbar';
import Link from 'next/link';

export default function Contact() {
    function sub() {
        let body = new FormData(document.getElementById("contact_form"));
        fetch("/api/data/contact/submit", { body, method: "post" }).then(async res => ({ status: res.status, json: await res.json() })).then(json => {
            createToast(json.json, json.status === 200 ? "check" : "danger");
        });
    }

    return (
        <>
            <Navbar />
            <div className="my-4 flex flex-col items-center w-md mx-auto px-2 py-3 rounded-lg">
                <p className="my-4 text-center text-2xl">Have any concern? We are here to help you</p>
                <form className="space-y-6 w-md" id="contact_form">
                    <div className="text-base text-gray-500">Contact info</div>
                    <div className="flex items-center">
                        <div className="mx-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                Real Name</label>
                            <input type="text" name="Name" id="Name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Example: Abdur Rahman" required />
                        </div>
                        <div className="mx-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                Email Address</label>
                            <input type="email" name="Email" id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="name@company.com" required />
                        </div>
                    </div>
                    <div className="my-2">
                        <label htmlFor="concern" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                            Concern</label>
                        <textarea id="concern" name="concern"
                            placeholder="Don't include personal information like Phone Numbers, ID's or any other personal thing"
                            className="bg-gray-50 w-full h-56 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required></textarea>
                    </div>
                    <div className="flex items-center">
                        <Link href="/" type="button">
                            <span className="mx-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Cancel
                            </span>
                        </Link>
                        <button onClick={sub} type="button"
                            className="mx-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}
