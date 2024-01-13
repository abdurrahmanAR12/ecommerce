import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../Components/sidebar';
import Link from 'next/link';
import { context } from '../../Components/context/context';
import Login from '../../Components/Admin/Login';

export default () => {
    let { loggedIn } = useContext(context);
    return (<>
        {loggedIn ? <Edit /> : <Login />}
    </>)
}


function Edit() {
    let [product, setProductReq] = useState(null),
        [query, setQ] = useState(null),
        [_404, set404] = useState(false),
        [interval, setInt] = useState(null);

    function getProductAnalytics() {
        fetch(`/api/products/get?id=${query.id}`).then(res => res.json()).then(product => {
            if (typeof product === "string")
                set404(true);
            else setProductReq(product)
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
        if (query)
            getProductAnalytics();
    }, [query])

    let [appenders, setAppenders] = useState(null),
        [categories, setCategories] = useState({}),
        [productControls, setProductControls] = useState({ show: false });

    function getCats() {
        setCategories({ ...categories, values: [], loading: true });
        fetch(`/api/data/categories/get`).then(res => res.json()).then(json => {
            setCategories({ ...categories, loading: false, values: json });
        });
    }

    useEffect(() => {
        setAppenders(document.getElementById("appenders"));
        window.setProduct = setProduct;
        window.setProductOverview = setProductOverview;
        window.getIndex = getIndex;
        window.product = {
            Name: "",
            Description: "",
            Price: 0,
            OverView: [],
            Stock: 0,
            Category: ''
        };
        getCats()
    }, [])

    function sendApiCall() {
        let body = new FormData,
            product = window.product;
        for (const key in product) {
            let f = product[key]
            if (key === "OverView")
                body.append(key, JSON.stringify(f));
            else if (f !== null)
                body.append(key, (f));
            else {
                //We will do something here when we have some of the thing
                return window.createToast("Something gone wrong, or you have something unexpected please check or Reload", "danger")
            }
        }
        fetch("/api/products/edit", {
            method: "post",
            body
        }).then(async r => {
            return { status: r.status, json: await r.json() }
        }).then(response => {
            window.createToast(response.json, response.status === 200 ? "check" : "danger");
            if (response.status === 200)
                window.location = "/admin/dash"
        }).catch(_e => window.createToast("Error, Failed to reach the system", "danger"));
    }


    function createAboutParagraph() {
        let input = document.createElement("textarea");
        input.className = "block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        input.placeholder = "Describe here what about this Product";
        let id = generateRandomId("textarea-");
        input.id = id;
        input.name = id;
        input.oninput = onChange;
        appenders.appendChild(input);
        setProductOverview({ id, type: "text", text: "" });
    }

    function createSizer() {
        let input = document.createElement("input"),
            p_parent = document.createElement("div"),
            pPrev = document.createElement("p");
        input.className = "block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        p_parent.className = input.className;
        input.placeholder = "The available size...";
        let id = generateRandomId("input-");
        input.id = id;
        input.name = id;
        input.oninput = e => {
            onChange(e, "size");
            pPrev.innerText = e.target.value;
        };
        appenders.appendChild(input);
        setProductOverview({ id, type: "size", text: "" });
    }

    function createFeature() {
        let input = document.createElement("input"),
            p_parent = document.createElement("div"),
            pPrev = document.createElement("p");
        input.className = "block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        p_parent.className = input.className;
        input.placeholder = "Describe the Product feature here...";
        let id = generateRandomId("input-");
        input.id = id;
        input.name = id;
        p_parent.innerHTML = "<p className='border-b mb-1 py-1'>Features: </p>";
        pPrev.className = "text-1xl"
        p_parent.appendChild(pPrev)
        input.oninput = e => {
            onChange(e, "feature");
            pPrev.innerText = "✔   " + e.target.value;
        };
        appenders.appendChild(input);
        appenders.appendChild(p_parent);
        setProductOverview({ id, type: "feature", text: "" });
    }

    function createDiscounter() {
        let input = document.createElement("input"),
            p_parent = document.createElement("div"),
            input2 = document.createElement("input");
        p_parent.className = "flex";
        input.type = "number";
        input2.type = input.type;
        input.className = "block w-md mx-4 p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        input2.className = input.className;
        input.placeholder = "From";
        input2.placeholder = "to";
        let id = generateRandomId("input-");
        input.id = id;
        input2.id = id + "_2";
        input2.name = id + "_2";
        p_parent.innerHTML = "<p className='py-1'>Discount bar: </p>";
        // p_parent.appendChild(pPrev)
        input.oninput = e => {
            let id = e.target.id,
                val = window.product.OverView[window.getIndex(id)]
            setProductOverview({ ...val, from: e.target.value });
        };
        input2.oninput = e => {
            let val = window.product.OverView[window.getIndex(id)]
            setProductOverview({ ...val, to: e.target.value });
        };
        p_parent.appendChild(input);
        p_parent.appendChild(input2);
        appenders.appendChild(p_parent);
        setProductOverview({ id, type: "discount", from: "", to: "" });
    }

    function createOther() {
        let input = document.createElement("input"),
            p_parent = document.createElement("div"),
            input2 = document.createElement("input");
        p_parent.className = "flex";
        input.type = "number";
        input2.type = input.type;
        input.className = "block w-md mx-4 p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        input2.className = input.className;
        input.placeholder = "Field Name";
        input2.placeholder = "Field value";
        let id = generateRandomId("input-");
        input.id = id;
        input2.id = id + "_2";
        input2.name = id + "_2";

        input.oninput = e => {
            let id = e.target.id,
                val = window.product.OverView[window.getIndex(id)]
            setProductOverview({ ...val, name: e.target.value });
        };
        input2.oninput = e => {
            let val = window.product.OverView[window.getIndex(id)]
            setProductOverview({ ...val, value: e.target.value });
        };
        p_parent.appendChild(input);
        p_parent.appendChild(input2);
        appenders.appendChild(p_parent);
        setProductOverview({ id, type: "other", name: "", value: "" });
    }

    function createUploader() {
        let input = document.createElement("input"),
            imageParent = document.createElement("div");
        input.type = "file";
        input.accept = "image/*"
        input.className = "block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        imageParent.className = input.className;
        input.placeholder = "Describe here what about this Product";
        let id = generateRandomId("input-");
        input.id = id;
        input.name = id;
        input.onchange = e => {
            if (e.target.files.length) {
                setProduct({ [id]: e.target.files[0] });
                createImageCanvas(e.target.files[0], "imgParent-" + id);
            }
            else {
                setProduct({ [id]: null });
                document.getElementById("imgParent-" + id).innerHTML = "<p className='my-2'>Preview:</p>";
            };
        };
        appenders.appendChild(input);
        imageParent.id = "imgParent-" + id;
        imageParent.innerHTML = "<p className='my-2'>Preview:</p>";
        appenders.appendChild(imageParent);
        setProduct({ [id]: null })
    }

    function createColorizer() {
        let input = document.createElement("select");
        input.className = "block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        input.placeholder = "Describe here what about this Product";
        let id = generateRandomId("input-");
        input.id = id;
        input.name = id;
        input.onchange = e => setProductOverview({ [id]: { type: "color", value: e.target.value } });
        fetch("/api/data/colors").then(r => r.json()).then(colors => {
            for (let i = 0; i < colors.length; i++) {
                let op = document.createElement("option");
                op.value = colors[i];
                op.innerText = op.value;
                input.appendChild(op);
            }
            input.value = colors[0];
            setProductOverview({ [id]: { type: "color", value: colors[0] } })
            appenders.appendChild(input);
        });
    }

    function createColorizerFromData(data) {
        let input = document.createElement("select");
        input.className = "block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        input.placeholder = "Describe here what about this Product";
        let id = generateRandomId("input-");
        input.id = id;
        input.name = id;
        input.value = data.id;
        input.onchange = e => setProductOverview({ [id]: { type: "color", value: e.target.value } });
        fetch("/api/data/colors").then(r => r.json()).then(colors => {
            for (let i = 0; i < colors.length; i++) {
                let op = document.createElement("option");
                op.value = colors[i];
                op.innerText = op.value;
                input.appendChild(op);
            }
            input.value = colors[0];
            setProductOverview({ [id]: data.value })
            appenders.appendChild(input);
        });
    }

    function createImageCanvas(file, id) {
        let r = new FileReader();
        r.onload = e => {
            let img = document.createElement("img"),
                imageP = document.getElementById(id);
            img.src = r.result;
            imageP.innerHTML = "<p className='my-2'>Preview:</p>";
            imageP.appendChild(img);
        }
        r.readAsDataURL(file);
    }

    function generateRandomId(prefiex = "") {
        let abc = 'abcdefghijklmnopqrstuvxyz10875',
            value = [];
        for (let i = 0; i < abc.length; i++) {
            let s = abc[parseInt(Math.random() * abc.length)];
            value.push(s);
        }
        if (document.getElementById(value.join("")))
            return generateRandomId(prefiex);
        return value.join("");
    }

    function setProduct(data) {
        window.product = { ...window.product, ...data };
    }

    function onChange(e, type) {
        let val = window.product.OverView[getIndex(e.target.id)];
        if (!e.target.files)
            setProductOverview({ id: e.target.id, type: val.type ? val.type : "text", text: e.target.value });
        else if (e.target.files && e.target.file.length)
            setProduct({ ...window.product, [e.target.id]: e.target.files[0] });
    }

    function getIndex(id) {
        let keys = Object.keys(window.product.OverView)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (window.product.OverView[key].id == id)
                return i;
        }
        return false;
    }

    function setProductOverview(data) {
        let keys = Object.keys(window.product.OverView)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (window.product.OverView[key].id == data.id) {
                window.product.OverView[key] = data;
                return;
            }
        }
        window.product.OverView.push(data);
    }

    return (
        <div>
            <Sidebar />
            {productControls.show && <div className="backdrop" onClick={e => e.target.className === "backdrop" ? setProductControls({ ...productControls, show: false }) : null}>
                <div className="fixed z-30 bottom-6 right-6 group">
                    <div className="flex flex-col justify-end py-1 mb-4 space-y-2 bg-white border border-gray-100 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700">
                        <ul className="text-sm text-gray-500 dark:text-gray-300">
                            <li>
                                <button onClick={createAboutParagraph}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">About Paragraph</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={createFeature}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">Feature List</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={createDiscounter}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">Discount bar</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={createColorizer}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">Color List</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={createSizer}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">Sizer</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={createUploader}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">Product Image Uploader</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={createOther}
                                    className="flex items-center w-full px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white">
                                    <span className="text-sm font-medium">Some Other thing</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>}

            <div className="fixed z-30 bottom-6 right-6 group">
                <button onClick={e => setProductControls({ show: !productControls.show })} type="button" aria-expanded="false"
                    className="flex items-center justify-center ml-auto text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 1v16M1 9h16" />
                    </svg>
                    <span className="sr-only">Open actions menu</span>
                </button>
            </div>

            <section
                className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div style={{ width: "60em" }} className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-10 relative">
                    <form className="w-full border-b max-w-full mx-auto" encType="multipart/form-data">
                        <div className="block">
                            <div
                                className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                                <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                    </svg>
                                </span><span className="text-sm font-medium">Basics</span>
                            </div>
                        </div>
                        {product ? <div className="mb-4">
                            <label className="text-sm my-2 font-medium">Title of the product: </label>
                            <input type="text" value={product.Name} name="Name" id="Name"
                                className="block w-full p-4 mb-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="The title of your Product..." spellCheck="false" required />
                            <label className="text-sm my-1 font-medium">Description: </label>
                            <textarea type="text" value={product.Description} id="Description" name="Description"
                                className="block w-full mb-4 p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="The Product Description here..." spellCheck="false" required></textarea>
                            <label className="text-sm my-1 font-medium">Category: </label>
                            <select name="Category" value={categories.length && categories[0].id}
                                className="block w-full mb-4 p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Product Category..." required>
                                {Array.isArray(categories.values) && categories.values.length && categories.values.map(cat => {
                                    return <option value={cat.id}>{cat.Name}</option>
                                })}
                            </select>
                            <label className="text-sm my-1 font-medium">Stock count: </label>
                            <input type="number" name="Stock" value={product && product.Stock}
                                className="block w-full p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="How you have the items..." required />
                            <label className="text-sm my-1 font-medium">Price: </label>
                            <input type="number" value={product && product.Price}
                                className="block w-full p-4 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Price of the Item..." required />
                        </div> : <>
                            <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14 px-2 my-2"></div>
                            <div className="h-14 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                            <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14 px-2 my-2"></div>
                            <div className="h-24 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                            <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14 px-2 my-2"></div>
                            <div className="h-12 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                            <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14 px-2 my-2"></div>
                            <div className="h-12 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                            <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14 px-2 my-2"></div>
                            <div className="h-12 bg-gray-200 rounded-md dark:bg-gray-700 w-full px-2 my-2"></div>
                        </>}
                        <div className="block">
                            <div
                                className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                                <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                    </svg>
                                </span><span className="text-sm font-medium">Now you have to decide what to add here:</span>
                            </div>
                            <div id="appenders" className="my-2">

                            </div>
                        </div>
                        <div className="flex center  absolute right-2.5 bottom-2.5">
                            <Link href="/admin/dash">
                                <span className="text-black mx-2 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800">
                                    Cancel
                                </span>
                            </Link>
                            <button onClick={sendApiCall} type="button"
                                className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                <div
                    className="bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0">
                </div>
            </section>
        </div>
    );
}
