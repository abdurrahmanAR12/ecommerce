import React, { useEffect, useState, useContext } from 'react'
import Sidebar from '../../Components/sidebar'
import Link from 'next/link';
import Category from '../../Components/Admin/Category';
import Login from '../../Components/Admin/Login';
import { context } from '../../Components/context/context';

export default function Exporter() {
    let { loggedIn } = useContext(context);
    return (<>
        {loggedIn ? <Dashboard /> : <Login />}
    </>)
}


function Dashboard() {
    let [productControls, setProductControls] = useState({ show: false, typeModal: false, categoryModal: false }),
        [cats, setCats] = useState({ loading: true, wrong: false, values: [] });

    function getCats() {
        fetch("/api/data/categories/get").then(res => res.json()).then(json => {
            setCats({ ...cats, loading: false, values: json });
        }).catch(e => {
            setCats({ ...cats, loading: false, wrong: true });
        });
    }

    useEffect(getCats, [])

    return (
        <div>
            <Sidebar />
            <div>
                <section
                    className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                        <div className='text-center p-2 rounded-lg bg-white'>
                            <h1 className='text-2xl font-semibold'>Dashboard</h1>
                        </div>
                        {!cats.loading ? cats.values.length !== 0 ? <>
                            <div className="mx-4 mt-2 text-sm">Product Categories: </div>
                            <div className="mx-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {cats.values.map(cat => {
                                    return <Category getCats={getCats} cat={cat} />
                                })}
                            </div>
                        </> :
                            <p className='text-sm'>We did not have any categories, please create some categories to organize products</p> :
                            <div className='animate-pulse'>
                                <div className="h-14 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                                <div className="flex justify-center flex-wrap">
                                    <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                                    <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                                    <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                                    <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                                    <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                                    <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                                </div>
                            </div>}
                    </div>
                </section>
                {productControls.show && <div className="backdrop" onClick={e => e.target.className === "backdrop" ? setProductControls({ ...productControls, show: false }) : null}>
                    <div className="fixed z-30 bottom-6 right-6 group">
                        <div className="flex flex-col justify-end py-1 mb-4 space-y-2 bg-white border border-gray-100 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700">
                            <ul className="text-sm text-gray-500 dark:text-gray-300">
                                <li>
                                    <Link href={"/admin/new"}>
                                        <span role='button'
                                            className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                            <span className="text-sm font-medium">Admin Account</span>
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/admin/createProduct"}>
                                        <span role='button'
                                            className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                            <span className="text-sm font-medium">Product</span>
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={e => setProductControls({ ...productControls, show: false, typeModal: true })} className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                        <span className="text-sm font-medium">Type</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={e => setProductControls({ ...productControls, show: false, categoryModal: true })}
                                        className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                        <span className="text-sm font-medium">Category</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>}

                {productControls.typeModal && <>
                    <div className="backdrop" onClick={e => e.target.className === "backdrop" ? setProductControls({ ...productControls, typeModal: false }) : null}>
                        <div tabIndex="-1" aria-hidden="true"
                            class="overflow-y-auto overflow-x-hidden z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                            <div class="mx-auto w-1/2 p-4 w-full max-w-2xl h-full md:h-auto">
                                {/* <!-- Modal content --> */}
                                <div class="p-4  relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    {/* <!-- Modal header --> */}
                                    <div
                                        class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                            Create new Type
                                        </h3>
                                        <button onClick={e => setProductControls({ ...productControls, typeModal: false })} type="button"
                                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                            <span class="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    {/* <!-- Modal body --> */}
                                    <form action="#">
                                        <div>
                                            <label for="name"
                                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type Name</label>
                                            <input type="text" name="Type"
                                                class="w-full my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Type here..." required />
                                        </div>
                                        <div className="flex justify-center">
                                            <button onClick={e => setProductControls({ ...productControls, typeModal: false })} type='button'
                                                class="text-black mx-2 inline-flex items-center bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                Cancel
                                            </button>
                                            <button type='button'
                                                class="text-black mx-2 inline-flex items-center bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                        clipRule="evenodd"></path>
                                                </svg>
                                                Create Type
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}

                {productControls.categoryModal && <>
                    <div className="backdrop" onClick={e => e.target.className === "backdrop" ? setProductControls({ ...productControls, categoryModal: false }) : null}>
                        <div tabIndex="-1" aria-hidden="true"
                            class="overflow-y-auto overflow-x-hidden z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                            <div class="mx-auto w-1/2 p-4 w-full max-w-2xl h-full md:h-auto">
                                {/* <!-- Modal content --> */}
                                <div class="p-4  relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    {/* <!-- Modal header --> */}
                                    <div
                                        class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                            Create new Category
                                        </h3>
                                        <button onClick={e => setProductControls({ ...productControls, categoryModal: false })} type="button"
                                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                            <span class="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    {/* <!-- Modal body --> */}
                                    <form action="#">
                                        <div class="grid gap-4 mb-4 sm:grid-cols-2">
                                            <div>
                                                <label for="name"
                                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                                <input type="text" name="Name"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Category name here..." required />
                                            </div>
                                            <div>
                                                <label for="brand"
                                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                                                <input type="text" name="Type" id="brand"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Category Type here..." />
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button onClick={e => setProductControls({ ...productControls, categoryModal: false })} type='button'
                                                class="text-black mx-2 inline-flex items-center bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                Cancel
                                            </button>
                                            <button type='button'
                                                class="text-black mx-2 inline-flex items-center bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                        clipRule="evenodd"></path>
                                                </svg>
                                                Add new Category
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}


                <div className="fixed z-30 bottom-6 right-6 group">
                    <button onClick={e => setProductControls({ show: !productControls.show })} type="button" aria-expanded="false"
                        className="flex items-center justify-center ml-auto text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M9 1v16M1 9h16" />
                        </svg>
                        <span className="sr-only">Open actions menu</span>
                    </button>
                </div>
            </div>
            <div className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
        </div>
    );
}



