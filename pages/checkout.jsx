import React, { useEffect, useState } from 'react'
import Router from 'next/router';
import Navbar from '../Components/Navbar';
import Script from 'next/script';
import NotFound from '../Components/404';

export default function Checkout() {
    let [product, setProduct] = useState({ value: {}, loading: true, }),
        [query, setQ] = useState(null),
        [_404, set404] = useState(false),
        [interval, setInt] = useState(null)
    function getProduct() {
        fetch(`/api/products/get?id=${query.id}`).then(res => res.json()).then(prod => {
            if (typeof prod === "string")
                set404(true);
            else setProduct({ ...product, value: prod, loading: false })
        });
    }

    useEffect(() => {
        function func() {
            if (Object.keys(Router.default.router.state.query).length) {
                if (!query)
                    setQ(Router.default.router.state.query);
                clearInterval(interval);
            }
        }
        setInt(setInterval(func, 1000));
    }, [])

    function getCheck(id, q) {
        window.addToCart(id, q)
        window.location.pathname = "/cart"
    }

    useEffect(() => {
        if (query)
            getProduct();
    }, [query])

    return (
        <>
            <Navbar />
            <div>
                {product.loading && <Loader />}

                {!product.loading && Object.keys(product.value).length !== 0 && <div>
                    <div id="gallery" style={{ width: "100%", marginTop: "4em" }} className="relative w-full" data-carousel="slide">
                        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                            {(product.value.Pic.length > 1) ? product.value.Pic.map(pic => {
                                return <div key={pic} className="hidden duration-700 ease-in-out" data-carousel-item>
                                    <img src={pic} className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="" />
                                </div>
                            }) : <img src={product.value.Pic[0]}
                                className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="" />}
                            {product.value.Pic.length > 1 &&
                                <>
                                    <button type="button"
                                        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                                        data-carousel-prev>
                                        <span
                                            className="inline-flex items-center justify-center bg-gray-600 w-10 h-10 rounded-full dark:bg-gray-800/30 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                            <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 6 10">
                                                <path stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M5 1 1 5l4 4" />
                                            </svg>
                                            <span className="sr-only">Previous</span>
                                        </span>
                                    </button>
                                    <button type="button"
                                        className="absolute top-0 right-0 z-30  flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                                        data-carousel-next>
                                        <span
                                            className="inline-flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                            <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 6 10">
                                                <path stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="m1 9 4-4-4-4" />
                                            </svg>
                                            <span className="sr-only">Next</span>
                                        </span>
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                    <div className="md:flex md:w-full items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
                        <div className="xl:w-96 md:w-full lg:ml-8 md:mt-0 mt-6">
                            <div className="border-b border-gray-200 pb-6">
                                <p className="text-sm leading-none text-gray-600 dark:text-gray-300 ">
                                    {product.Category}
                                </p>
                                <h1
                                    className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">
                                    {product.Name}
                                </h1>
                            </div>
                            <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Availablillity</p>
                                <div className="flex items-center justify-center">
                                    {product.Stock === 0 ? <p className="text-sm leading-none text-pink-800 dark:text-gray-300">Not Available</p>
                                        : <p className="text-sm leading-none text-gray-600 dark:text-gray-300">Available</p>}
                                    <div className="w-6 h-6 bg-gradient-to-b from-gray-900 to-indigo-500 ml-3 mr-4 cursor-pointer">
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Stock</p>
                                <div className="flex items-center justify-center">
                                    <p className="text-sm leading-none text-gray-600 dark:text-gray-300">
                                        {product.value.Stock}
                                    </p>
                                    <div className="w-6 h-6 bg-gradient-to-b from-gray-900 to-indigo-500 ml-3 mr-4 cursor-pointer"></div>
                                </div>
                            </div>
                            <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Price</p>
                                <div className="flex items-center justify-center">
                                    <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">Rs:{product.value.Price}
                                    </p>
                                </div>
                            </div>
                            <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-gray-300">How much to buy? </p>
                                <div className="flex items-center justify-center">
                                    <button className="py-1 px-1 mx-2 bg-gray-200 hover:bg-gray-300 mx-1 rounded-md">
                                        <svg className="w-3.5 h-3.5 bi bi-dash" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16"
                                            height="16" fill="currentColor" viewBox="0 0 18 18">
                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                        </svg>
                                    </button>
                                    <p id="quantity" className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">1</p>
                                    <button className="py-1 px-1 bg-gray-200 mx-2 hover:bg-gray-300 rounded-md">
                                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 18 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M9 1v16M1 9h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="w-md flex items-center">
                                <button className="dark:bg-white dark:text-gray-900 my-2 rounded-md dark:hover:bg-gray-100 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center
                    leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none" onClick={e => {
                                        getCheck(query.id, 1);
                                    }}>
                                    Order now
                                    <svg className="text-gray-300 mx-2 dark:text-white cursor-pointer" width="6" height="10"
                                        viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                                            strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="dark:bg-white mx-2 dark:text-gray-900 rounded-md dark:hover:bg-gray-100 focus:outline-none
            focus:ring-2
            focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none
            text-white
                    bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                                    Add to Cart
                                    <svg className="w-3.5 h-3.5 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M9 1v16M1 9h16" />
                                    </svg>
                                </button>
                            </div>
                            <p className="xl:pr-48 text-base my-2 lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7">
                                {product.value.Description}
                            </p>
                            <div className="bg-gray-100 hidden p-1 my-2 rounded-md">
                                <h2 className="text-2xl my-2 text-black">Additional Product details:</h2>
                                <div id="about" className="my-3"></div>
                                <div id="features" className="hidden">
                                    <div className="hidden items-center">
                                        <h2 className="text-base text-gray-500">Features:</h2>
                                        <div className="border-b w-full mx-4"></div>
                                    </div>
                                </div>
                                <div id="colors" className="hidden flex items-center">
                                    <h2 className="text-base text-gray-500">Colors:</h2>
                                </div>
                                <div id="other"></div>
                                <div id="sizes" className="hidden flex my-3 items-center">
                                    <h2 className="text-base text-gray-500">Available Sizes:</h2>
                                </div>
                                <div id="tags" className="hidden flex my-3 items-center">
                                    <h2 className="text-base text-gray-500">Tags:</h2>
                                </div>
                            </div>


                            <div className="">
                                <p className="text-2xl text-gray-500">Our terms and conditions about every single Product:</p>
                                <div className="border-t border-b py-4 mt-7 border-gray-200">
                                    <div data-menu className="flex justify-between items-center cursor-pointer">
                                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Shipping and returns</p>
                                        <button
                                            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded"
                                            role="button" aria-label="show or hide">
                                            <svg className="transform text-gray-300 dark:text-white" width="10" height="6" viewBox="0 0 10 6"
                                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 1L5 5L1 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="hidden pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 dark:text-gray-300"
                                        id="sect">You will be responsible for paying for your own shipping costs for returning your
                                        item. Shipping costs are nonrefundable
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="border-b py-4 border-gray-200">
                                    <div data-menu className="flex justify-between items-center cursor-pointer">
                                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Contact us</p>
                                        <button
                                            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded"
                                            role="button" aria-label="show or hide">
                                            <svg className="transform text-gray-300 dark:text-white" width="10" height="6" viewBox="0 0 10 6"
                                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 1L5 5L1 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="hidden pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 dark:text-gray-300"
                                        id="sect">If you have any questions on how to return your item to us, <a
                                            className="text-gray-600 hover:text-blue-800" href="/contact_us">contact us</a>.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Script strategy="afterInteractive" src='/js/menu.product47788.js' />
                </div>}
                {!product.loading && (_404 || (!product && !(query || (query && query.id)))) && <NotFound />}
            </div>
        </>
    );
}


function Loader() {
    return (<>
        <div role='status' className='animate-pulse'>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 w-full px-2 my-2"></div>
            <div role='status' className="justify-center flex-wrap">
                <div className="flex">
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                </div>
                <div className="flex">
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                </div>
                <div className="flex">
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                </div>
                <div className="flex">
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                </div>
                <div className="flex">
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                    <div className="h-12 mx-2 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                </div>
                <div className="h-24 my-2 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
            </div>
        </div>
    </>)
}