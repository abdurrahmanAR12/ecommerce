import Link from 'next/link';
import React from 'react';

export default function Order({ products, id, itemLength, user, status }) {
    // function getProducts() {
    //     setProducts({ ...products, loading: true });
    //     fetch(`/api/products/get?id=`).then(res => {
    //         return res.json()
    //     }).then(json => {
    //         setProducts({ ...products, value: json, loading: false });
    //     });
    // }

    return (
        <>
            <div className="p-2 shadow-sm">
                {/* <img style={{ height: "15em" }} className="h-auto w-full my-2 rounded-lg"
                    src={""} alt="" /> */}
                <h1 className="text-2xl mt-4">
                    {user.Name}
                </h1>
                <p className="mb-4">
                    {itemLength} Products
                </p>
                <div className="my-2">
                    <h1 className="font-bold">Rs: {products.totalPrice}</h1>
                    <h1 className="font-bold">Stock:{products.quantity}</h1>
                </div>
                <div className="my-2">
                    <p className='font-semibold'>Customer Details:</p>
                    <h1>Phone: {user.phone_no}</h1>
                    <h1>Email Address:{user.Email}</h1>
                </div>
                <div className="my-2">
                    <p className='font-semibold'>Customer Address Details:</p>
                    <p className='font-sm'>{user.address}</p>
                </div>
                <Link href={"/checkout?id=" + id}>
                    <span role='button'
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            View Details
                        </span>
                    </span>
                </Link>
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group
                bg-gradient-to-br from-purple-600 to-blue-500
                group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white
                dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300
                                            dark:focus:ring-blue-800">
                    <span onClick={''
                        // e => setProduct({ ...product, modal: true })
                    } className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Reply
                    </span>
                </button>
            </div>
        </>
    );
}
