import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../../Components/sidebar';
import { context } from '../../../Components/context/context';
import Login from '../../../Components/Admin/Login';


export default function exporter() {
    let { loggedIn } = useContext(context);
    return (<>
        {<Index />}
    </>)
}


export function Index() {
    let [images, setImages] = useState([]);

    function sendApiCall() {
        fetch("/api/sliders/get").then(async res => ({ status: res.status, json: await res.json() })).then(json => {
            setImages(json.json)
            // console.log(json)
        }).catch(_e => {
            createToast("Failed to reach to system", "danger");
        });
    }

    useEffect(() => {
        sendApiCall()
    }, [])

    return (
        <div>
            <Sidebar />
            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                    {images.length !== 0 && <div className='text-center p-2 rounded-lg bg-white'>
                        <h1 className='text-2xl font-semibold'>Current Sliders for our Homepage</h1>
                    </div>}
                    {images.length ? <>
                        <div className="mx-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map(image => {
                                return <div className='bg-white w-96 rounded-lg p-2'>
                                    <img className="w-96 h-auto max-w-full rounded-lg"
                                        src={`/api/sliders/get?id=${image.id}`} alt="" />
                                    <p className='text-sm my-2'>{image.description}</p>
                                    <div className="my-2 flex items-center">
                                        <button onClick={null} type="button"
                                            className="bg-gray-100 mx-1 hover:bg-gray-300 text-black focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                                            Edit Config
                                        </button>
                                        <button onClick={null} type="button"
                                            className="mx-1 bg-gray-100 hover:bg-gray-300 text-black  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </> : <div>
                        <div className="h-14 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                        <div className="flex justify-center flex-wrap">
                            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                        </div>
                    </div>
                    }
                </div>
                <div className="fixed z-30 bottom-6 right-6 group">
                    <Link href={"/admin/sliders/create"}>
                        <button type="button" aria-expanded="false"
                            className="flex items-center justify-center ml-auto text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M9 1v16M1 9h16" />
                            </svg>
                            <span className="sr-only">Open actions menu</span>
                        </button>
                    </Link>
                </div>
            </section>
            <div
                className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0">
            </div>

        </div>
    );
}
