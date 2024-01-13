import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import CartItem from '../Components/cartItem';

export default function Cart() {
    let [cart, setCart] = useState({ loading: true, value: {}, clearModal: false, wrong: false }),
        [order, setOrder] = useState({ show: false });

    function getCart() {
        let int = setInterval(get, 1000)
        function get() {
            if (window.token) {
                fetch("/api/cart/get", {
                    headers: { "token": window.token }
                }).then(async res => ({ status: res.status, json: await res.json() })).then(json => {
                    console.log(json)
                    setCart({ ...cart, loading: false, value: json.json })
                }).catch(__ => {
                    setCart({ ...cart, wrong: true, loading: false });
                });
                clearInterval(int)
            }
        }
    }
    function placeOrder() {
        let body = new FormData(document.getElementById("order-form"))
        fetch("/api/orders/create", {
            method: "post",
            body,
            headers: { "token": window.token }
        }).then(async res => ({ status: res.status, json: await res.json() })).then(json => {
            console.log(json)
            if (json.status === 200) {
                setOrder({ ...order, show: false });
            }
            createToast(json.json, json.status === 200 ? "check" : "danger");
        })

    }

    function clearCart() {
        fetch("/api/cart/clear", {
            method: "get",
            headers: { "token": window.token }
        }).then(async res => ({ status: res.status, json: await res.json() })).then(json => {
            createToast(json.json, json.status === 200 ? "check" : "danger");
            if (json.status == 200) {
                setCart({ ...cart, clearModal: false })
                getCart()
            }
        }).catch(_e => {
            createToast("Can't reach the system", "danger");
        });
    }

    useEffect(() => {
        getCart()
    }, [])

    return (
        <>
            <Navbar />
            <div>
                <div style={{ width: "75%" }} className="mx-auto text-center p-2 bg-gray-300 rounded-lg">
                    <div className="text-2xl text-gray-500">Your Cart</div>
                </div>
                <div style={{ width: "75%" }} id="cartMain" className="mx-auto my-4 p-2 bg-gray-300 rounded-lg">
                    {cart.value.items && cart.value.items.length && <h1 className='text-sm text-center my-2 text-white'>Products in your Cart:</h1>}
                    {!cart.loading ? <>
                        {(Array.isArray(cart.value.items) && cart.value.items.length !== 0) ?
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {cart.value.items.map(product => {
                                    return <CartItem getCart={getCart} key={product.id} id={product.id} Name={product.Name} Description={product.Description} quantity={product.quantity} totalPrice={product.total} Stock={product.Stock} Price={product.Price} Pic={product.Pic} />
                                })}
                            </div> : <p className='text-center my-4 text-sm'>You don't have anything in your cart</p>
                        }</> : <Loader />}
                    {Object.keys(cart.value).length !== 0 ? <div className="text-white mx-4 text-sm">
                        <p className='my-2 text-sm'>Total Quantity: {cart.value.quantity}</p>
                        <p className='my-2 text-sm'>Total Price: {cart.value.totalPrice}</p>
                    </div> : <>
                        <div className="h-6 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                        <div className="h-6 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                    </>}
                    {cart.value.items && cart.value.items.length &&
                        <div className="flex items-center">
                            <button onClick={e => setOrder({ ...order, show: !order.show })} className="dark:bg-white mx-2 dark:text-gray-900 my-2 rounded-md dark:hover:bg-gray-100 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center
                    leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                                Place Order
                                <svg className="text-gray-300 mx-2 dark:text-white cursor-pointer" width="6" height="10"
                                    viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="dark:bg-white mx-2 dark:text-gray-900 my-2 rounded-md dark:hover:bg-gray-100 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center
                    leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                                Get Help
                                <svg className="text-gray-300 mx-2 dark:text-white cursor-pointer" width="6" height="10"
                                    viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button onClick={e => setCart({ ...cart, clearModal: true })} className="dark:bg-white mx-2 dark:text-gray-900 my-2 rounded-md dark:hover:bg-gray-100 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center
                    leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                                Clear Cart
                                <svg className="text-gray-300 mx-2 dark:text-white cursor-pointer" width="6" height="10"
                                    viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    }
                    {cart.clearModal && <div className="backdrop" onClick={e => e.target.className === "backdrop" ? setCart({ ...cart, clearModal: false }) : null}>
                        <div tabIndex="-1"
                            className="p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                            <div className=" mx-auto max-w-md max-h-full">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <button onClick={e => setCart({ ...cart, clearModal: false })} type="button"
                                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-hide="modal-clear-cart">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-6 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you
                                            want to clear your cart? This will not be undone</h3>
                                        <button onClick={clearCart} type="button"
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                            Yes, I'm sure
                                        </button>
                                        <button onClick={e => setCart({ ...cart, clearModal: false })} type="button"
                                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No,
                                            cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}

                    {order.show && <><div className="my-4 flex flex-col items-center w-md mx-auto px-2 py-3 rounded-lg">
                        <p className="my-4 text-center text-2xl">To Place order, We need some of your Basic Information</p>
                        <form className="space-y-6 w-md" id="order-form">
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
                                <div className="mx-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone No:</label>
                                    <input type="number" name="phone_no"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="+9234212345678" required />
                                </div>
                            </div>
                            <div className="my-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Address</label>
                                <textarea spellCheck={false} name="address"
                                    placeholder="Your Address here..."
                                    className="bg-gray-50 w-full h-56 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required></textarea>
                            </div>
                            <div className="flex items-center">
                                <button onClick={e => setOrder({ ...order, show: false })} type="button">
                                    <span className="mx-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Cancel
                                    </span>
                                </button>
                                <button onClick={placeOrder} type="button"
                                    className="mx-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                            </div>
                        </form>
                    </div>
                    </>}
                </div>
            </div>
        </>
    )
}




function Loader() {
    return <div>
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
