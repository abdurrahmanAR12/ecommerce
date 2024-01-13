import React from 'react'

export default function CartItem({ Name, Price, Stock, getCart, Description, Pic, quantity, id, totalPrice }) {

    function removeItem() {
        fetch(`/api/cart/clear?id=${id}`, {
            method: "get",
            headers: { "token": window.token }
        }).then(async res => ({ status: res.status, json: await res.json() })).then(json => {
            createToast(json.json, json.status === 200 ? "check" : "danger");
            if (json.status == 200) {
                getCart()
            }
        }).catch(_e => {
            createToast("Can't reach the system", "danger");
        });
    }


    return (
        <div>
            <div className="p-2 shadow-sm">
                <img style={{ height: "15em" }} className="h-auto w-full my-2 rounded-lg"
                    src={Pic ? Pic[0] : ""} alt="" />
                <h1 className="text-2xl mt-4">
                    {Name}
                </h1>
                <p className="mb-4">
                    {Description}
                </p>
                <div className="my-1 p-2 rounded-lg bg-white">
                    <h1 className="text-sm">Rs: {Price}</h1>
                    <h1 className="text-sm">Stock: {Stock}</h1>
                    <h1 className="text-sm">Quantity: {quantity}</h1>
                    <h1 className="text-sm">Total Price: {totalPrice}</h1>
                </div>
                <div className="my-2">
                    <button onClick={removeItem} role='button'
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Remove
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
