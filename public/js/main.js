window.tokenString = "token_wind_mil_(:).mit.mint.t.ss";
let token = localStorage[window.tokenString];

function getUser() {
    window.token = token
    fetch("/api/auth/getUser", { headers: { "token": token } }).then(res => res.json()).then(user => {
        window.user = user;
        document.getElementById("profile_photo_nav").src = user.Pic;
        console.log(window.user)
    });
}
if (token)
    getUser();

else console.log("no user")