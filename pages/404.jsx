import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function NotFound({ title, description }) {
    return (
        <div>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Not Found - 404</title>
            </Head>
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-indigo-600">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        {title ? title : "Page not found"}
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                        {description ? description : "Sorry, we couldn’t find the page you’re looking for."}
                    </p>
                    <div style={{ cursor: "default" }}>
                        <div className="mt-10 mx-auto mb-4 w-56">
                            <Link href="/">
                                <p className="rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Go back home
                                </p>
                            </Link>
                        </div>
                        <Link href="/contact">
                            <p className='text-sm font-semibold text-gray-900'>
                                Contact support <span
                                    aria-hidden="true">&rarr;</span>
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
