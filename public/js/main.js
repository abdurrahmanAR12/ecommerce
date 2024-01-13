function createMetadata(name, content) {
    let meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
}

window.createMetadata = createMetadata;

window.getToaster = function () {
    return document.getElementById("toaster");
}

function createBackdrop() {
    document.getElementById("backdrop").className = "backdrop";
}
function RemoveBackdrop() {
    document.getElementById("backdrop").className = "backdrop-hidden";
}
window.appendInBackdrop = function (node) {
    document.getElementById("backdrop").appendChild(node);
}
window.removeNode = function (node) {
    document.getElementById("backdrop").removeChild(node);
}
window.clearBackdrop = function () {
    let ch = document.getElementById("backdrop").children;
    if (ch.length)
        for (c of ch)
            c.remove();
}
window.createBackdrop = createBackdrop;
window.removeBackdrop = RemoveBackdrop;
window.generateRandomId = generateRandomId;
window.createToastCheck = createToastCheck;
window.createToastSimple = createToastSimple;
window.createToastDanger = createToastDanger;

window.createToast = function (title, type) {
    let t = { "simple": createToastSimple, "danger": createToastDanger, "check": createToastCheck };
    let t_L = window.getToaster()
    if (t_L.children.length > 2)
        t_L.children.map(ch => ch.remove())

    return t[type](title);
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

function addToCart(id, q) {
    let body = new FormData;
    body.append("productId", id);
    body.append("quantity", q);
    fetch("/api/cart/create", {
        method: "post",
        headers: { "token": window.token },
        body
    }).then(async res => ({ status: res.status, json: await res.json() })).then(decodedResponse => {
        console.log(decodedResponse)
        if (typeof decodedResponse === "string")
            window.createToast(decodedResponse.json, decodedResponse.status === 200 ? "check" : "danger");
        else window.createToast(decodedResponse.json.msg, decodedResponse.status === 200 ? "check" : "danger");
    }).catch(_e => {
        return window.createToast("Failed to reach the system", "danger");
    });
}


function createToastCheck(title) {
    let t = window.getToaster(),
        mainElem = document.createElement("div"),
        elemIcon = document.createElement("div");
    mainElem.className = "flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800";
    mainElem.role = "alert"
    elemIcon.className = "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    elemIcon.innerHTML = `
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                viewBox="0 0 20 20">
                <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="sr-only">Check icon</span>
    `;

    let titleElem = document.createElement("div");
    titleElem.className = "ml-3 text-sm font-normal";
    titleElem.innerText = title;
    let button = document.createElement("button");
    button.type = "button";
    button.className = "ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700";
    let id = generateRandomId("button");
    mainElem.id = id;
    button.innerHTML = `
    <span class="sr-only">Close</span>
<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
</svg>`
    button.setAttribute("data-dismiss-target", `#${id}`)
    button.setAttribute("aria-label", `Close`)
    mainElem.appendChild(elemIcon);
    mainElem.appendChild(titleElem);
    mainElem.appendChild(button);
    t.appendChild(mainElem);
    setTimeout(() => {
        mainElem.remove()
    }, 3000);
}

function createToastSimple(title) {
    let t = window.getToaster(),
        mainElem = document.createElement("div"),
        elemIcon = document.createElement("div");
    mainElem.className = "flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800";
    mainElem.role = "alert"
    elemIcon.className = "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    elemIcon.innerHTML = `<svg class="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45" aria-hidden="true"
xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9" /></svg>`;
    let titleElem = document.createElement("div");
    titleElem.className = "ml-3 text-sm font-normal";
    titleElem.innerText = title;
    let button = document.createElement("button");
    button.type = "button";
    button.className = "ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700";
    let id = generateRandomId("button");
    mainElem.id = id;
    button.innerHTML = `
    <span class="sr-only">Close</span>
<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
</svg>`
    button.setAttribute("data-dismiss-target", `#${id}`)
    button.setAttribute("aria-label", `Close`)
    mainElem.appendChild(elemIcon);
    mainElem.appendChild(titleElem);
    mainElem.appendChild(button);
    t.appendChild(mainElem);
    setTimeout(() => {
        mainElem.remove()
    }, 3000);
}
function createToastDanger(title) {
    let t = window.getToaster(),
        mainElem = document.createElement("div"),
        elemIcon = document.createElement("div");
    mainElem.className = "flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800";
    mainElem.role = "alert"
    elemIcon.className = "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    elemIcon.innerHTML = `
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="red"
    viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
    </svg><span class="sr-only">Error icon</span>`;
    let titleElem = document.createElement("div");
    titleElem.className = "ml-3 text-sm font-normal";
    titleElem.innerText = title;
    let button = document.createElement("button");
    button.type = "button";
    button.className = "ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700";
    let id = generateRandomId("button");
    mainElem.id = id;
    button.innerHTML = `<span class="sr-only">Close</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg>`;
    button.setAttribute("data-dismiss-target", `#${id}`)
    button.setAttribute("aria-label", `Close`)
    mainElem.appendChild(elemIcon);
    mainElem.appendChild(titleElem);
    mainElem.appendChild(button);
    t.appendChild(mainElem);
    setTimeout(() => {
        mainElem.remove()
    }, 3000);
}





window.tokenString = "token_wind_mil_(:).mit.mint.t.ss";
let token = localStorage[window.tokenString];

function getUser() {
    window.token = token
    fetch("/api/auth/users/get", { headers: { "token": token } }).then(res => res.json()).then(user => {
        window.user = user;
        // document.getElementById("profile_photo_nav").src = user.Pic;
        // console.log(window.user)
    });
}

if (token)
    getUser();

else console.log("no user")