import React, { useEffect, useState, useContext } from 'react'
import Sidebar from '../../Components/sidebar'
import Order from '../../Components/order';
import { AdminTokenString, context } from '../../Components/context/context';
import Login from '../../Components/Admin/Login';

export default () => {
    let { loggedIn } = useContext(context)
    return (<>{loggedIn ? <Inbox /> : <Login />}</>);
}

export function Inbox() {
    let [orders, setOrders] = useState({ loading: true, values: [] });
    let [concerns, setConcern] = useState({ loading: true, values: [] });

    function getOrders() {
        setOrders({ ...orders, loading: true });
        fetch("/api/admin/orders/get", {
            headers: { "Admin_token": localStorage[AdminTokenString] }
        }).then(res => res.json()).then(json => {
            setOrders({ ...orders, loading: false, values: json });
        });
    }

    function getConcerns() {
        setConcern({ ...concerns, loading: true });
        fetch("/api/data/contact/get", {
            headers: { "Admin_token": localStorage[AdminTokenString] }
        }).then(res => res.json()).then(json => {
            console.log(json)
            setConcern({ ...concerns, loading: false, values: json });
        });
    }

    useEffect(() => {
        getOrders();
        getConcerns()
    }, [])

    return (
        <div>
            <Sidebar />
            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                    <div className='text-center p-2 rounded-lg bg-white'>
                        <h1 className='text-2xl font-semibold'>Inbox</h1>
                    </div>
                    <div className='p-2 my-2 rounded-lg bg-white'>
                        {!orders.loading && orders.values.length !== 0 && <h1 className='ml-4 my-2 border-bottom'>Orders for you:</h1>}
                        {orders.loading ? <Loader /> : orders.values.length === 0 ? <p className='text-sm text-center'>We don't have any of Orders</p> : orders.values.map(order => {
                            <><Order id={order.id} products={order.products} itemLength={order.itmesLength} user={order.user} status={order.status} /></>
                        })}
                    </div>
                    <div className='p-2 my-2 rounded-lg bg-white'>
                        {!concerns.loading && concerns.values.length !== 0 && <h1 className='ml-4 my-2 border-bottom'>Concern Box:</h1>}
                        <div className="mx-auto grid sm:grid-cols-2  grid-cols-2 md:grid-cols-3 gap-2">
                            {concerns.loading ? <Loader /> : concerns.values.length === 0 ? <p className='text-sm text-center'>Nothing to show here</p> : concerns.values.map(concern => {
                                return <div className="p-2 rounded-lg bg-gray-100 sm:w-24 w-96 shadow-sm">
                                    <h1 className="text-sm">
                                        <p>{concern.Name}</p>
                                        <p>{concern.Email}</p>
                                        <p className='text-xs text-gray-800'>{concern.postDate}</p>
                                    </h1>
                                    <div className="my-2">
                                        <p className='text-sm'>Concern :</p>
                                        <div className='bg-white rounded-lg p-2 font-sm'><p>{concern.concern.slice(0, 80)}</p></div>
                                    </div>
                                    <div className="flex my-2">
                                        <button type="button"
                                            className="flex w-full mx-2 text-sm justify-center font-semibold rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Delete
                                        </button>
                                        <button type="button"
                                            className="flex w-full text-sm justify-center font-semibold rounded-md bg-indigo-600 px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            })}
                        </div>

                    </div>
                </div>
            </section >
            <div className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
        </div >
    )
}


function Loader() {
    return <div className='animate-pulse'>
        <div className="flex flex-wrap">
            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
            <div className="h-56 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
        </div>
    </div>
}