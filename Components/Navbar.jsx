// import Script from 'next/script';
import { CircularProgress } from '@material-ui/core';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Router from 'next/router';
import { ArrowDownIcon } from "@heroicons/react/24/solid"
import { Dropdown } from 'flowbite-react';
import { isMobile } from "react-device-detect"
import { Menu, MenuItem, Button } from "@material-ui/core"
import { TextField } from "@material-ui/core"


export function AccountMenu({ open, handleClose, inputValue, onChange, getSugessions, results, anchorEl }) {

    useMemo(() => { getSugessions() }, [inputValue]);

    return (
        <React.Fragment>
            <Menu style={{ width: "100%" }}
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    variant: "elevation",
                    elevation: 10,
                    sx: {
                        width: 350,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            // transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ul className="h-48 pt-2 w-96 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownSearchButton" id="search-results">
                    <div className="flex h-12">
                        <TextField value={inputValue} onChange={onChange} fullWidth color="primary" variant="outlined" type='text' label="Search here..." />
                        <Button onClick={inputValue !== "" && Router.push(`/results?key=${inputValue}`)} variant='contained'>
                            Go
                        </Button>
                    </div>
                    <div className="mt-6">
                        {Array.isArray(results) ? results.map(result => {
                            return <MenuItem onClick={handleClose}>
                                {result}
                            </MenuItem>
                        }) : <p className='text-center text-sm'> {results}</p>}
                    </div>
                </ul>
            </Menu>
        </React.Fragment>
    );
}

export default function Navbar({ categories, key = "" }) {
    let [search, setSearch] = useState({ value: key, loading: false, x: 0, show: false, results: [] });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function getNames() {
        if (search.loading)
            return;
        setSearch({ ...search, loading: true });
        fetch(`/api/search/names?key=${search.value}`).then(res => res.json()).then(json => {
            setSearch({ ...search, loading: false, results: json });
        });
    }

    // function submit(e) {
    //     e.preventDefault()
    //     if (search.value !== "")
    //         document.getElementById("searcher").click()
    // }

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
                        {/* <button data-collapse-toggle="navbar-user" type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-user" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button> */}
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
                                <AccountMenu onChange={onChange} open={open} results={search.results} inputValue={search.value} getSugessions={getNames} anchorEl={anchorEl} handleClose={handleClose} />
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
