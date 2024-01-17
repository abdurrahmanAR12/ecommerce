import React, { useEffect, useState } from 'react'
import InfiniteScroll from "react-infinite-scroll-component"
import { Product } from '../Components/Product';
import Router from 'next/router';
import Navbar from '../Components/Navbar';
import NotFound from '../Components/404';
import Head from 'next/head';
import { Grid, Box } from "@material-ui/core"
import Skeleton from "@mui/material/Skeleton"


export default function Category() {
    let [products, setProducts] = useState({ loading: true, page: 0, hasMore: true, values: [] }),
        [query, setQ] = useState(null),
        [_404, set404] = useState(false),
        [interval, setInt] = useState(null),
        [keys, setKeys] = useState([]);

    function getProducts() {
        setProducts({ ...products, loading: true })
        fetch(`/api/products/categories?n=${query.id}&page=${products.page}`).then(res => res.json()).then(prods => {
            if (typeof prods === "string")
                set404(true);
            else setProducts({ ...products, values: prods, loading: false, hasMore: prods.length ? true : false });
        }).catch(e => {
            setProducts({ ...products, loading: false })
        });
    }

    function getMoreProducts() {
        fetch(`/api/products/categories?n=${query.id}&page=${products.page + 1}`).then(res => res.json()).then(prods => {
            if (typeof prods === "string")
                set404(true);
            else {
                if (prods.length)
                    setProducts({ ...products, values: products.values.concat(prods) });
                else setProducts({ ...products, hasMore: false });
            };
        })
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

        // fetch("/api/data/categories/get").then(res => res.json()).then(cats => {
        //     for (let i = 0; i < cats.length; i++) {
        //         keys.push("Millionairo " + cats[i].Name);
        //     }
        //     setKeys(keys.join(","))
        // })
    }, [])

    useEffect(() => {
        if (query) {
            setProducts({ ...products, page: query.page ? query.page : 0 });
            getProducts()
        };
    }, [query])

    return (
        <>
            <Navbar />
            <Head>
                <title>Product Categories - Millionairo</title>
                {/* <meta name="keywords" content={keys.toString() + ",products,product millionairo,categories, millionairo"} /> */}
            </Head>
            <div>
                <p className="text-center h-12 mx-auto bg-gray-100 p-2 w-1/2 rounded-lg">{query && query.id}</p>
                <InfiniteScroll loader={<Loader />} next={query && getMoreProducts} dataLength={products.values.length} endMessage={_404 ? "" : <p className='text-center my-2'>{products.values.length ? "No more Products" : "Nothing to show here"}</p>} hasMore={_404 ? false : products.hasMore}>
                    <div style={{ maxWidth: "60%" }} className="mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                        {!products.loading && Array.isArray(products.values) && products.values.length !== 0 && products.values.map(product => {
                            return <Product key={product.id} id={product.id} Name={product.Name} Description={product.Description} Stock={product.Stock} Price={product.Price} Pic={product.Pic} />
                        })}
                    </div>
                </InfiniteScroll>
                {(_404 || (!products.loading && (!query || (query && !query.id)))) && <NotFound />}
            </div>
        </>
    )
}

export function Loader() {
    return (<>
        <div className="text-center">
            <Grid container className='my-2'>
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
        </div>
    </>)
}
