import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../Components/sidebar'
import { AdminTokenString, context } from '../../Components/context/context'
import Login from '../../Components/Admin/Login';
import User from '../../Components/Admin/user';

export default () => {
    let { loggedIn } = useContext(context);
    return (<>{loggedIn ? <Users /> : <Login />}</>);
}

export function Users() {
    let [users, setUsers] = useState({ loading: true, values: [] }),
        { s } = useContext(context);

    function getUsers() {
        fetch("/api/auth/admins/users/getAll", {
            headers: { "admin_token": s[AdminTokenString] }
        }).then(res => res.json()).then(users => {
            setUsers({ ...users, loading: false, values: users });
            // console.log(users)
        })
    }

    useEffect(() => {
        getUsers()
    }, [s])

    return (
        <>
            <Sidebar />
            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                    <div className='text-center p-2 rounded-lg bg-white'>
                        <h1 className='text-2xl font-semibold'>User List of our Store, Total: {users.values.length < 10 ? "0" + users.values.length : users.values.length}</h1>
                    </div>
                    <div className='w-full'>
                        <h1 className='text-sm mx-4 my-2'>Note that: We can't do anything with our users personal information, Only the users can do that</h1>
                        <div className="flex mt-4 items-center">
                            <div className="w-48 mx-2 text-sm">Name</div>
                            <div className="w-48 mx-2 text-sm">Email</div>
                            <div className="w-48 mx-2 text-sm">Gender</div>
                            <div className="w-48 mx-2 text-sm">City (Pakistan)</div>
                            <div className="w-48 mx-2 text-sm">Age</div>
                            <div className="w-48 text-sm">Profile Pic</div>
                        </div>
                        <div className="mx-auto p-4">
                            {users.loading ? <Loader /> : users.values.length !== 0 && users.values.map(cat => {
                                return <User user={cat} />
                            })}
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>

            </section>
        </>
    )
}

function Loader() {
    return <>
        <div role='status' className="animate-pulse">
            <div className="h-14 bg-gray-200 rounded-lg dark:bg-gray-700 w-full px-2 my-2"></div>
            <div className="h-14 bg-gray-200 rounded-lg dark:bg-gray-700 w-full px-2 my-2"></div>
            <div className="h-14 bg-gray-200 rounded-lg dark:bg-gray-700 w-full px-2 my-2"></div>
            <div className="h-14 bg-gray-200 rounded-lg dark:bg-gray-700 w-full px-2 my-2"></div>
            <div className="h-14 bg-gray-200 rounded-lg dark:bg-gray-700 w-full px-2 my-2"></div>
            <div className="h-14 bg-gray-200 rounded-lg dark:bg-gray-700 w-full px-2 my-2"></div>
        </div>
    </>
}