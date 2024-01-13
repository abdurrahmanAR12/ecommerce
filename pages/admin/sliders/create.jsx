import Link from 'next/link';
import React, { useContext } from 'react'
import Sidebar from '../../../Components/sidebar';
import { context } from '../../../Components/context/context';
import Login from '../../../Components/Admin/Login';

export default () => {
    let { loggedIn } = useContext(context);
    return (
        <>{loggedIn ? <Create /> : <Login />}</>
    );
}


export function Create() {
    function sendApiCall() {
        let body = new FormData(document.getElementById("form-auth"));
        fetch("/api/sliders/create", {
            method: "post",
            body
        }).then(async res => ({ status: res.status, json: await res.json() })).then(json => {
            createToast(json.json, json.status === 200 ? "check" : "danger");
        }).catch(_e => {
            createToast("Failed to reach to system", "danger");
        });
    }

    return (
        <div>
            <Sidebar />
            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div style={{ width: "60em" }} className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                    <div>
                        <h1 className='text-2xl font-semibold'>Sliders boosts our productivity a lot.</h1>
                        <h1 className='text-l'>You can create slider by choosing your file below, They will show up on our App's top slider section of Homepage</h1>
                    </div>
                    <form id='form-auth' className="w-full my-4 border-b max-w-full mx-auto" encType="multipart/form-data">
                        <label className="text-sm my-1 font-medium">Choose Slider: </label>
                        <input type="file" name='Image' className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        <label className="text-sm my-1 font-medium">Description for your Image: </label>
                        <textarea placeholder='Your Productive Description here...' type="text" name='description' className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                        </textarea>
                    </form>
                    <div className="flex center  absolute right-2.5 bottom-2.5">
                        <Link href="/admin/dash">
                            <span className="text-black mx-2 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800">
                                Cancel
                            </span>
                        </Link>
                        <button onClick={sendApiCall} type="button"
                            className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Done
                        </button>
                    </div>
                </div>
            </section>

            <div
                className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0">
            </div>

        </div>
    );
}
