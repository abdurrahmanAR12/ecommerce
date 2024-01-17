import React, { useEffect, useState } from 'react'
import InfiniteScroll from "react-infinite-scroll-component"
import Link from 'next/link';
import { Carousel } from 'flowbite-react';
import { Product } from "./Product"
import { isMobile } from "react-device-detect"
import { Grid, Box } from "@material-ui/core"
import Skeleton from "@mui/material/Skeleton"


export function Products({ initialProducts }) {
    let [products, setProducts] = useState({ loading: false, hasMore: true, show: false, page: 0, values: initialProducts }),
        [sliders, setSliders] = useState({ loading: true, values: [] });

    function getSlider() {
        setSliders({ ...sliders, loading: true });
        fetch(`/api/sliders/get`).then(res => res.json()).then(json => {
            setSliders({ ...sliders, loading: false, values: json });
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
        // console.log(categories)
        // getCats();
        // console.log(products.values)
        getSlider()
    }, [])

    return (
        <>
            <div className="relative w-full">
                <div className="relative h-96 overflow-hidden rounded-lg md:h-96">
                    <Carousel children={sliders.values.length !== 0 ? sliders.values.map(slider => {
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
                                <div type="button"
                                    className="h-full bg-black focus:outline-none rounded-lg cursor-pointer group focus:outline-none">
                                    <div
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
                                        <svg className="w-4 h-4" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M5 1 1 5l4 4" />
                                        </svg>
                                        <span className="sr-only">Previous</span>
                                    </div>
                                </div>
                            </div>

                        </>} rightControl={
                            <div className="best-shadow rounded-lg bg-white px-2 py-2">
                                <div type="button" className="h-full focus:outline-none bg-black cursor-pointer">
                                    <span
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
                                        <svg className="w-4 h-4" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="sr-only">Next</span>
                                    </span>
                                </div>
                            </div>
                        } >
                    </Carousel>
                </div>
            </div >
            <p className="text-sm w-96 mx-auto text-center mx-4 rounded-lg best-shadow py-2 px-4 mt-4 mb-4">Products Available for you</p>
            <InfiniteScroll loader={<Loader />} next={getMoreProducts} dataLength={products.values.length} endMessage={<p className='text-center my-2'>No more Products</p>} hasMore={products.hasMore}>
                <div className={`mx-auto container ${isMobile ? "" : "grid grid-cols-2 md:grid-cols-3 gap-4"}`}>
                    {Array.isArray(products.values) && products.values.length !== 0 && products.values.map(product => {
                        // console.log(product)
                        return <Product key={product.route} id={product.route} Name={product.Name} Description={product.Description} Stock={product.Stock} Price={product.Price} Pic={product.Pic} />
                    })}
                </div>
            </InfiniteScroll>
        </>
    );
}

export function Loader() {
    return (<>
        <Grid container wrap="nowrap">
            {(Array.from(new Array(3))).map((item, index) => (
                <Box key={index} sx={{ width: 500, marginRight: 2.5, my: 5 }}>
                    <Skeleton variant="rectangular" width={500} height={300} />
                    <Box sx={{ pt: 0.5 }}>
                        <Skeleton />
                        <Skeleton width="60%" />
                    </Box>
                </Box>
            ))}
        </Grid>
    </>)
}
