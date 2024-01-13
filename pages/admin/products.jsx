import React, { useContext, useEffect, useState } from 'react'
import { Product } from '../../Components/Admin/Product';
import { Loader } from '../../Components/Products';
import InfiniteScroll from "react-infinite-scroll-component"
import Sidebar from '../../Components/sidebar';
import { context } from '../../Components/context/context';
import Login from '../../Components/Admin/Login';

export default () => {
    let { loggedIn } = useContext(context);
    return (<>
        {loggedIn ? <Products /> : <Login />}
    </>);
}


export function Products() {
    let [products, setProducts] = useState({ loading: false, hasMore: true, show: false, page: 0, values: [] });
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
        getProducts();
    }, []);

    return (
        <div className='bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0'>
            <Sidebar />
            <div style={{ marginTop: "6em" }}
            >
                <p className="text-center font-semibold text-2xl text-black">
                    Your Product listings:
                </p>
                <InfiniteScroll loader={<Loader />} next={getMoreProducts} dataLength={products.values.length} endMessage={<p className='text-center my-2'>No more Products</p>} hasMore={products.hasMore}>
                    <div style={{ maxWidth: "60%" }} className="mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                        {!products.loading ? Array.isArray(products.values) && products.values.length && products.values.map(product => {
                            return <Product key={product.id} id={product.id} Name={product.Name} Description={product.Description} Stock={product.Stock} Price={product.Price} Pic={product.Pic} />
                        }) : ""}
                    </div>
                </InfiniteScroll >
            </div>
        </div>
    )
}
