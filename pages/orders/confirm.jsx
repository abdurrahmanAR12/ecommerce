import Link from 'next/link'
import Router from 'next/router';
import React, { useState, useEffect } from 'react'
import NotFound from "../../Components/404"

export default function Comfirm() {
    let [products, setProducts] = useState({ loading: true, value: "Checking for configurations..." }),
        [query, setQ] = useState(null),
        [_404, set404] = useState(false),
        [interval, setInt] = useState(null);

    function getProducts() {
        fetch(`/api/orders/confirm?id=${query.id}`).then(async res => ({ status: res.status, json: (await res.json()) })).then(prods => {
            console.log(prods)
            setProducts({ ...products, loading: false, ...prods });
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

    useEffect(() => {
        if (query) {
            getProducts()
        };
    }, [query])

    return (
        <div>
            {query ? <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div class="text-center">
                    <div class="w-56 mx-auto">
                        <svg class="w-56 h-56" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="green"
                            viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                    </div>
                    <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        {products.loading ? "Checking..." : products.status === 200 ? "Success" : "Failed"}
                    </h1>
                    <p class="mt-6 text-base leading-7 text-gray-600">
                        {"We did something successfully"}
                    </p>
                    <div class="mt-10 mb-4">
                        <Link href="/">
                            <button class="rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Go back home
                            </button>
                        </Link>
                    </div>
                    <Link href="/contact">
                        <button
                            class="text-sm font-semibold text-gray-900">
                            Contact support<span
                                aria-hidden="true">&rarr;</span>
                        </button>
                    </Link>
                </div>
            </main> : <NotFound title={"Not Found"} description={"Sorry the, no link present or expired"} />
            }
        </div>
    )
}
