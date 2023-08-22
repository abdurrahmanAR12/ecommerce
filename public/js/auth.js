function doAuth(e) {
    e.preventDefault();
    let messenger = document.getElementById("messenger"),
        body = new FormData(document.getElementById("form"));
    let login = Array.from(document.getElementById("form").classList).includes("login");
    fetch(`/api/auth/${login ? "login" : "new"}`, {
        method: "post",
        body
    }).then(data => data.json()).then(json => {
        if (json.token) {
            localStorage[window.tokenString] = json.token;
            messenger.innerText = json.msg;
        }
        else messenger.innerText = json;
        // console.log(json)
    });
}
window.doAuth = doAuth;

let btn = document.getElementById("submitter");

btn.addEventListener("click", doAuth);
// console.log("Hello from console")