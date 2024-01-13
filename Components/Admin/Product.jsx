import Link from 'next/link';
import React, { useState, useEffect } from 'react'

export const AdminTokenString = "_a_<(8)>tystsspotrtins7afs7n5o2az=";

export function Product({ id, Stock, Price, Description, Name, Pic }) {
    let [product, setProduct] = useState({ modal: false, quantity: 1 }),
        [w, setWindow] = useState(null);

    function add() {
        window.addToCart(id, product.quantity);
    }

    useEffect(() => {
        setWindow(window);
    }, [])

    return (
        <>
            {product.modal &&
                <div className='backdrop text-center'>
                    <div tabIndex="-1"
                        className="mt-10 mx-auto p-4 overflow-hidden md:inset-0 h-[calc(100%-1rem)] max-h-md">
                        <div className="relative mt-10 mx-auto w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button onClick={e => setProduct({ ...product, modal: false })} type="button"
                                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round"
                                            strokeLinejoin="round" strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-6 text-center">
                                    <svg className="mx-auto mb-4 bi bi-question-octagon-fill text-gray-400 w-12 h-12 dark:text-gray-200"
                                        xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor"
                                        viewBox="0 0 18 18">
                                        <path
                                            d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        How much Items you want to buy?</h3>
                                    <div className="flex my-3 items-center justify-center">
                                        <button onClick={e => setProduct({ ...product, quantity: product.quantity > 1 ? (product.quantity - 1) : product.quantity })} className="py-1 px-1 mx-2
                                                        bg-gray-200 hover:bg-gray-300
                                                        mx-1 rounded-md">
                                            <svg className="w-3.5 h-3.5 bi bi-dash" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" viewBox="0 0 18 18">
                                                <path
                                                    d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                            </svg>
                                        </button>
                                        <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product.quantity}</p>
                                        <button onClick={e => setProduct({ ...product, quantity: product.quantity <= Stock ? (product.quantity + 1) : product.quantity })} className="py-1 px-1
                                                        bg-gray-200 mx-2 hover:bg-gray-300
                                                        rounded-md">
                                            <svg className="w-3.5 h-3.5" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 18 18">
                                                <path stroke="currentColor" strokeLinecap="round"
                                                    strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 1v16M1 9h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button onClick={e => {
                                        add()
                                    }} type="button" className="text-white bg-red-600 hover:bg-red-800
                                                    focus:ring-4 focus:outline-none focus:ring-red-300
                                                    dark:focus:ring-red-800 font-medium rounded-lg text-sm
                                                    inline-flex items-center px-5 py-2.5 text-center mr-2">Add to Cart</button>
                                    <button data-modal-hide={id} type="button"
                                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4
                                                focus:outline-none focus:ring-gray-200 rounded-lg border
                                                border-gray-200
                                                text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10
                                                dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500
                                                dark:hover:text-white dark:hover:bg-gray-600
                                                dark:focus:ring-gray-600" onClick={e => setProduct({ ...product, modal: false })}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            <div className="product p-2 shadow-sm">
                <img style={{ height: "15em" }} className="h-auto w-full my-2 rounded-lg"
                    src={Pic ? Pic[0] : ""} alt="" />
                <h1 className="text-2xl mt-4">
                    {Name}
                </h1>
                <p className="mb-4">
                    {Description}
                </p>
                <div className="my-2">
                    <h1 className="font-bold">Rs: {Price}</h1>
                    <h1 className="font-bold">Stock:{Stock}</h1>
                </div>
                <div className="flex justify-center items-center">
                    <Link href={`/admin/edit?id=${id}`}>
                        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group
                    bg-gradient-to-br from-purple-600 to-blue-500
                    group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white
                    dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300
                    dark:focus:ring-blue-800">
                            <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Edit Configs
                            </span>
                        </button>
                    </Link>
                    <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group
                    bg-gradient-to-br from-purple-600 to-blue-500
                    group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white
                    dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300
                                                dark:focus:ring-blue-800">
                        <span onClick={e => setProduct({ ...product, modal: true })} className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Analytics
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}
