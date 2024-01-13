import React, { useState } from 'react'
import { Product } from '../Components/Product';
// import Navbar from ;
import InfiniteScroll from "react-infinite-scroll-component"
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic"
let Navbar = dynamic(() => import('../Components/Navbar'), { ssr: false });


export async function getServerSideProps(ctx) {
    let fuzzysort = require("fuzzysort"),
        { Product } = require("../Models/Product"),
        { Image } = require("../Models/Image"),
        { Category } = require("../Models/Category"),
        { decodeUtf8 } = require("../utils/utils"),
        key = ctx.query["key"],
        page = parseInt(ctx.query["page"]);
    if (!(key))
        return { initialResults: null };
    page = 0;
    let prods = await Product.find(),
        index = fuzzysort.go(key, prods, { key: ['Name'], limit: Infinity });
    let prod, results = [], p = 0;
    for (let i = page * 3; i < index.length; i++) {
        if (p === 3)
            break;
        prod = index[i];
        results[results.length] = (await GenerateProduct(prod.obj));
    }


    async function GenerateProduct(cat, decode = true) {
        if (Array.isArray(cat)) {
            let pusher = [];
            for (let i = 0; i < cat.length; i++) {
                let c = cat[i], Pic = [];
                // console.log(c.Pic)
                for (let i = 0; i < c.Pic.length; i++) {
                    let p = await Image.findById(c.Pic[i]);
                    Pic[Pic.length] = (`/images?id=${p.route}`)
                }
                pusher[pusher.length] = (new Object({
                    Name: decode ? decodeUtf8(c.Name) : c.Name,
                    Category: (await Category.findById(c.Category)).Name,
                    Pic,
                    Price: c.Price,
                    Description: decode ? decodeUtf8(c.Description) : c.Description,
                    Stock: c.Stock,
                    OverView: (c.OverView),
                    route: c.route ? c.route : null
                }));
            }
            return pusher;
        }
        if (typeof (cat) === "object") {
            let c = cat, Pic = [];
            for (let i = 0; i < c.Pic.length; i++) {
                let p = await Image.findById(c.Pic[i]);
                Pic.push(`/images?id=${p.route}`)
            }
            return (new Object({
                Name: decode ? decodeUtf8(c.Name) : c.Name,
                Category: (await Category.findById(c.Category)).Name,
                Pic,
                Price: c.Price,
                Description: decode ? decodeUtf8(c.Description) : c.Description,
                Stock: c.Stock,
                OverView: (c.OverView),
                route: c.route ? c.route : null
            }));
        }
        console.log("Invalid argument ", cat);
        return new Object({});
    }


    function generateCategory(cat, decode = true, id = false, type = false) {
        if (Array.isArray(cat)) {
            let pusher = [];
            for (let i = 0; i < cat.length; i++) {
                let c = cat[i];
                pusher.push(new Object({ Name: decode ? decodeUtf8(c.Name) : c.Name, Type: type ? decode ? decodeUtf8(c.Type) : c.Type : null }))
            }
            return pusher;
        }
        if (typeof (cat) === "object")
            return new Object({ Name: decode ? decodeUtf8(cat.Name) : cat.Name, Type: type ? decode ? decodeUtf8(cat.Type) : cat.Type : null })

        console.log("Invalid argument ", cat);
        return new Object({});
    }
    return { props: { initialResults: (results), _key: key, categories: generateCategory(await Category.find(), true, false) } };
}

export default function Results({ initialResults, categories, _key }) {

    let [products, setProducts] = useState({ loading: false, hasMore: true, show: false, page: 0, values: initialResults });
    function getMoreProducts() {
        fetch(`/api/search/results?key=${_key}&page=${(products.page + 1)}`).then(res => res.json()).then(json => {
            if (!json.length)
                setProducts({ ...products, page: (products.page + 1), loading: false, hasMore: false });
            else setProducts({ ...products, page: (products.page + 1), loading: false, values: products.values.concat(json) });
        });
    }

    // useEffect(() => console.log(isMobile), [])

    return (<>
        <Navbar ـkey={_key} categories={categories} />
        <InfiniteScroll loader={<Loader />} next={getMoreProducts} dataLength={products.values.length} endMessage={<p className='text-center my-2'>No more Products</p>} hasMore={products.hasMore}>
            <div className={`mx-auto container ${isMobile ? "" : "grid grid-cols-2 md:grid-cols-3 gap-4"}`}>
                {Array.isArray(products.values) && products.values.length !== 0 && products.values.map(product => {
                    return <Product key={product.id} id={product.id} Name={product.Name} Description={product.Description} Stock={product.Stock} Price={product.Price} Pic={product.Pic} />
                })}
            </div>
        </InfiniteScroll>
    </>)
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
