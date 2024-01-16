// import Script from 'next/script';
// import { CircularProgress } from '@material-ui/core';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownIcon } from "@heroicons/react/24/solid"
import { Dropdown } from 'flowbite-react';
import { isMobile } from "react-device-detect"
import dynamic from "next/dynamic"

const AccountMenu = dynamic(() => import("./AccountMenu", { ssr: false }))

export default function Navbar({ categories, ـkey = "" }) {
    let [search, setSearch] = useState({ value: ـkey, loading: false, x: 0, show: false, results: [] });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function getNames() {
        if (search.loading || search.value == "")
            return;
        setSearch({ ...search, loading: true });
        fetch(`/api/search/names?key=${search.value}`).then(res => res.json()).then(json => {
            setSearch({ ...search, loading: false, results: json });
        });
    }
    function onChange(e) {
        setSearch({ ...search, value: e.target.value })
    }

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
                                <img className="w-8 h-8 rounded-full" src={"/images/user.png"} alt="user photo" />
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
                    </div>
                    <div className={`items-center justify-betweenhidden  w-full ${isMobile ? "" : "flex"} md:w-auto md:order-1`}>
                        {<ul className={`flex font-medium ${isMobile ? "" : "p-4"} md:p-0 mt-4 rounded-lg bg-white md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700`}>
                            <Link href={"/"}>
                                <li>
                                    <button className={`best-shadow sm:my-2 sm:w-full py-2 lg:px-4 rounded-lg`}>
                                        <span
                                            className="block text-black text-sm"
                                            aria-current="page">Home</span>
                                    </button>
                                </li>
                            </Link>
                            <li>
                                <Dropdown inline arrowIcon={false} className='bg-white py-2 best-shadow border-0 rounded-lg' label={<>
                                    <span className='best-shadow py-2 sm:my-2 sm:w-full lg:px-4 rounded-lg flex items-center'>
                                        <span
                                            className="block text-sm text-black mx-2"
                                            aria-current="page">Categories</span>
                                        <ArrowDownIcon fill='black' width={16} height={16} />
                                    </span></>}>
                                    {categories && categories.length ? categories.map(c => {
                                        return <>
                                            <Link key={c.id} href={`/category?id=${c.Name}`}>
                                                <li role='button' className="text-sm hover:bg-gray-50 transition-all py-2 px-4">
                                                    {c.Name}
                                                </li>
                                            </Link>
                                        </>
                                    }) : <p className='text-sm mx-4'>Nothing to show here</p>}
                                </Dropdown>
                            </li>
                            {<li>
                                <button onClick={handleClick} className='best-shadow py-2 sm:my-2 sm:w-full lg:px-4 rounded-lg flex items-center'>
                                    <span className="block text-sm text-black mx-2"
                                        aria-current="page">Search</span>
                                    <ArrowDownIcon fill='black' width={16} height={16} />
                                </button>
                                <AccountMenu _key={ـkey} open={open} results={search.results} inputValue={search.value} anchorEl={anchorEl} handleClose={handleClose} />
                            </li>}
                            <Link href="/contact">
                                <li>
                                    <button className='best-shadow sm:my-2 sm:w-full py-2 lg:px-4 rounded-lg flex items-center'>
                                        <span
                                            className="block text-sm text-black mx-2"
                                            aria-current="page">
                                            Contact us
                                        </span>
                                    </button>
                                </li>
                            </Link>
                        </ul>
                        }
                    </div>
                </div>
            </nav >
        </>
    )
}
