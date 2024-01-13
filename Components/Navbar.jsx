// import Script from 'next/script';
import { CircularProgress } from '@material-ui/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { ArrowDownIcon } from "@heroicons/react/24/solid"
import { Dropdown } from 'flowbite-react';


export default function Navbar() {
    let [search, setSearch] = useState({ value: "", loading: false, x: 0, show: false, results: [] }),
        [categories, setCats] = useState({ loading: false, show: false, x: 0, values: [] }),
        [w, setWindow] = useState(null),
        [interval, setInt] = useState(null);

    function getNames() {
        if (search.loading)
            return;
        setSearch({ ...search, results: [], loading: true });
        fetch(`/api/search/names?key=${search.value}`).then(res => res.json()).then(json => {
            setSearch({ ...search, loading: false, results: json });
        });
    }

    function getCats() {
        setCats({ ...categories, values: [], loading: true });
        fetch(`/api/data/categories/get`).then(res => res.json()).then(json => {
            setCats({ ...categories, loading: false, values: json });
            window.categories = json;
        });
    }

    function submit(e) {
        e.preventDefault()
        if (search.value !== "")
            document.getElementById("searcher").click()
    }

    useEffect(() => {
        if (location.pathname === "/search") {
            function func() {
                if (Object.keys(Router.default.router.state.query).length) {
                    if (search.value === "")
                        setSearch({ ...search, value: Router.default.router.state.query.key });
                    clearInterval(interval);
                    // setInt()
                }
            }
            // func()
            setInt(setInterval(func, 1000));
        }
        setWindow(window);
        getCats();
    }, []);

    useEffect(() => {
        if (search.show)
            setSearch({ ...search, x: search.x - (document.getElementById("dropdownSearch").getClientRects()[0].width / 1.8) })
    }, [search.show]);

    useEffect(getNames, [search.value]);

    return (
        <>
            <nav style={{ position: "sticky", top: 0, left: 0, zIndex: 110 }} className="bg-white best-shadow border-gray-200 py-1 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/">
                        <div role='button' className="flex transition-all items-center">
                            <img src="/images/logo.svg" className="w-10 h-10" alt="" />
                            <span className="self-center text-4xl font-semibold whitespace-nowrap">Store</span>
                        </div>
                    </Link>
                    <div className="flex items-center md:order-2">
                        <Dropdown className='rounded-lg py-2 best-shadow border-0' inline arrowIcon={false} label={<>
                            <div type="button" className="best-shadow bg-white p-1 flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                                <img className="w-8 h-8 rounded-full" src={w ? w.user ? w.user.Pic : "/images/user.png" : "/images/user.png"} alt="user photo" />
                            </div>
                        </>}>
                            <div role='button' className="block pl-2 text-sm px-2 w-48 my-1 py-2 transition-all hover:bg-gray-50">
                                My Profile
                            </div>
                            <div role='button' className="block pl-2 text-sm px-2 w-48 my-1 py-2 transition-all hover:bg-gray-50">
                                Privacy and Terms
                            </div>
                            <div role='button' className="block pl-2 text-sm px-2 w-48 my-1 py-2 transition-all hover:bg-gray-50">
                                Settings
                            </div>
                            <div role='button' className="block pl-2 text-sm px-2 w-48 my-1 py-2 transition-all hover:bg-gray-50">
                                Payment Methods
                            </div>
                            <div role='button' className="block pl-2 text-sm px-2 w-48 my-1 py-2 transition-all hover:bg-gray-50">
                                Logout
                            </div>
                        </Dropdown>
                        <button data-collapse-toggle="navbar-user" type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-user" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-betweenhidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg bg-white md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <Link href={"/"}>
                                <li>
                                    <button className='best-shadow sm:my-2 sm:w-full py-2 px-4 rounded-lg'>
                                        <span
                                            className="block text-black text-sm"
                                            aria-current="page">Home</span>
                                    </button>
                                </li>
                            </Link>
                            <li>
                                <Dropdown inline arrowIcon={false} className='bg-white py-2 best-shadow border-0 rounded-lg' label={<>
                                    <div className='best-shadow py-2 sm:my-2 sm:w-full px-4 rounded-lg flex items-center'>
                                        <span
                                            className="block text-sm text-black mx-2"
                                            aria-current="page">Categories</span>
                                        <ArrowDownIcon fill='black' width={16} height={16} />
                                    </div></>}>
                                    {categories.loading ? <><div className='bg-gray-50 h-10 mx-2 my-2 rounded-lg'></div>
                                        <div className='bg-gray-50 h-10 mx-2 my-2 rounded-lg'></div>
                                        <div className='bg-gray-50 h-10 mx-2 my-2 rounded-lg'></div>
                                        <div className='bg-gray-50 h-10 mx-2 my-2 rounded-lg'></div>
                                        <div className='bg-gray-50 h-10 mx-2 my-2 rounded-lg'></div>
                                        <div className='bg-gray-50 h-10 mx-2 my-2 rounded-lg'></div></> : categories.values.length !== 0 ? categories.values.map(c => {
                                            return <>
                                                <Link key={c.id} href={`/category?id=${c.Name}`}>
                                                    <div role='button' className="text-sm hover:bg-gray-50 transition-all py-2 px-4">
                                                        {c.Name}
                                                    </div>
                                                </Link>
                                            </>
                                        }) : <p className='text-sm mx-4'>Nothing to show here</p>}
                                </Dropdown>
                            </li>
                            <li>
                                <Dropdown className='bg-white block border-0 best-shadow rounded-lg w-96' inline arrowIcon={false} label={<button className='best-shadow py-2 px-4 rounded-lg flex items-center'>
                                    <span
                                        className="block sm:my-2 text-sm sm:w-full text-black mx-2"
                                        aria-current="page">Search</span>
                                    <ArrowDownIcon fill='black' width={16} height={16} />
                                </button>}>
                                    <div className="p-3">
                                        <form onSubmit={submit} className="bg-white best-shadow relative">
                                            <Link href={`/search?key=${encodeURI(search.value)}`} ><span id='searcher'></span></Link>
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                        strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </div>
                                            <input type="text" spellCheck={false} value={search.value} autoComplete='off' onChange={e => setSearch({ ...search, value: e.target.value })} id="input-group-search"
                                                className="block bg-white w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Search in Store" />
                                        </form>
                                    </div>

                                    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownSearchButton" id="search-results">
                                        {!(search.value.length && search.results.length) ?
                                            <p className="text-center"> Start typing above to see the magic</p> :
                                            Array.isArray(search.results) ? search.results.map(r => {
                                                return <>
                                                    <li key={r.id}>
                                                        <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <Link href={`/checkout?id=${r.id}`}>
                                                                <span role='button' className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{r.Name}</span>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                </>
                                            }) : (!search.loading) && <p className="text-center">{search.results}</p>
                                        }
                                        {search.loading && <div className='text-center'>
                                            <CircularProgress color='primary' size={20} />
                                        </div>}
                                    </ul>
                                </Dropdown>
                                {/* </div> */}
                            </li>
                            <li>
                                <button className='best-shadow sm:my-2 sm:w-full py-2 px-4 rounded-lg flex items-center'>
                                    <span
                                        className="block text-sm text-black mx-2"
                                        aria-current="page">Offers</span>
                                </button>
                            </li>
                            <Link href="/contact">
                                <li>
                                    <button className='best-shadow sm:my-2 sm:w-full py-2 px-4 rounded-lg flex items-center'>
                                        <span
                                            className="block text-sm text-black mx-2"
                                            aria-current="page">
                                            Contact us
                                        </span>
                                    </button>
                                </li>
                            </Link>
                            {w && !w.token && <li>
                                <Link href="/login">
                                    <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                        <span
                                            className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Sign In
                                        </span>
                                    </button>
                                </Link>
                                <Link href="/signup">
                                    <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                        <span
                                            className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Create an Account
                                        </span>
                                    </button>
                                </Link>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav >
        </>
    )
}
