import React, { useEffect, useState } from 'react'
import { Product } from './Product';
import InfiniteScroll from "react-infinite-scroll-component"
import Link from 'next/link';
import { Carousel } from 'flowbite-react';

export function Products() {
    let [categories, setCats] = useState({ loading: false, show: false, x: 0, values: [] }),
        [products, setProducts] = useState({ loading: false, hasMore: true, show: false, page: 0, values: [] }),
        [sliders, setSliders] = useState({ loading: true, values: [] });

    function getCats() {
        setCats({ ...categories, values: [], loading: true });
        fetch(`/api/data/categories/get`).then(res => res.json()).then(json => {
            setCats({ ...categories, loading: false, values: json });
        });
    }

    function getSlider() {
        setSliders({ ...sliders, loading: true });
        fetch(`/api/sliders/get`).then(res => res.json()).then(json => {
            setSliders({ ...sliders, loading: false, values: json });
        });
    }

    function getProducts() {
        setProducts({ ...products, page: 0, loading: true });
        fetch(`/api/products/get?page=${products.page}`).then(res => res.json()).then(json => {
            setProducts({ ...products, loading: false, values: json });
        });
    }

    function getMoreProducts() {
        fetch(`/api/products/get?page=${(products.page + 1)}`).then(res => res.json()).then(json => {
            if (!json.length)
                setProducts({ ...products, page: (products.page + 1), loading: false, hasMore: false, values: products.values.concat(json) });
            else setProducts({ ...products, page: (products.page + 1), loading: false, values: products.values.concat(json) });
        });
    }

    useEffect(() => {
        // console.log(Router)
        getCats();
        getSlider()
        getProducts();
    }, [])

    return (
        <div>
            <div id="gallery" className="relative w-full">
                <div className="relative h-96 overflow-hidden rounded-lg md:h-96">
                    <Carousel children={sliders.values.length ?
                        sliders.values.map(slider => {
                            return <div key={slider.id} className="duration-700 relative ease-in-out" data-carousel-item="active">
                                <img src={`/api/sliders/get?id=${slider.id}`}
                                    className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt="" />
                                <p className="text-sm absolute z-30 border-0 py-2 rounded-lg top-0 left-1/2 px-2 bg-white best-shadow">{slider.description}</p>
                            </div>
                        })
                        : [10, 11, 21].map(__ => {
                            return <div className="duration-700 bg-gray-100 ease-in-out">
                                <div className="h-full my-2 bg-gray-200 absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-md dark:bg-gray-700 w-96 px-2 my-2"></div>
                            </div>
                        })} slideInterval={3000} pauseOnHover slide leftControl={<>
                            <div className="best-shadow rounded-lg bg-white px-2 py-2">
                                <button type="button"
                                    className="h-full bg-black focus:outline-none rounded-lg cursor-pointer group focus:outline-none">
                                    <span
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
                                        <svg className="w-4 h-4" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M5 1 1 5l4 4" />
                                        </svg>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </button>
                            </div>

                        </>} rightControl={
                            <div className="best-shadow rounded-lg bg-white px-2 py-2">
                                <button type="button" className="h-full focus:outline-none bg-black cursor-pointer">
                                    <span
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
                                        <svg className="w-4 h-4" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="sr-only">Next</span>
                                    </span>
                                </button>
                            </div>
                        } >
                        { }
                    </Carousel>
                </div>
            </div >
            <p className="text-sm w-96 mx-auto text-center mx-4 rounded-lg best-shadow py-2 px-4 mt-4 mb-4">Products Available for you</p>
            <InfiniteScroll loader={<Loader />} next={getMoreProducts} dataLength={products.values.length} endMessage={<p className='text-center my-2'>No more Products</p>} hasMore={products.hasMore}>
                <div style={{ maxWidth: "60%" }} className="mx-auto sm:flex sm:flex-col sm:items-center sm:justify-center grid grid-cols-2 md:grid-cols-3 gap-4">
                    {!products.loading ? Array.isArray(products.values) && products.values.length && products.values.map(product => {
                        return <Product key={product.id} id={product.id} Name={product.Name} Description={product.Description} Stock={product.Stock} Price={product.Price} Pic={product.Pic} />
                    }) : <Loader/>}
                </div>
            </InfiniteScroll>
        </div >
    );
}

export function Loader() {
    return (<>
        <div id="loaders" className="loaders flex justify-center">
            <div role="status" style={{ width: "25em" }}
                className="max-w-sm mx-2 my-2 p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="flex items-center mt-4 space-x-3">
                    <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
            <div role="status" style={{ width: "25em" }}
                className="max-w-sm mx-2 my-2 p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="flex items-center mt-4 space-x-3">
                    <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
            <div role="status" style={{ width: "25em" }}
                className="max-w-sm mx-2 my-2 p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="flex items-center mt-4 space-x-3">
                    <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
        </div >
    </>)
}
