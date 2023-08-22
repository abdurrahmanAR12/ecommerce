let express = require("express"),
    utf8 = require("utf8"),
    fileUpload = require("express-fileupload"),
    bcryptjs = require('bcryptjs'),
    jwt = require("jsonwebtoken"),
    { readFileSync } = require("fs"),
    path = require("path"),
    sharp = require("sharp");

/**
 * 
 * @param {Array<any>} arr 
 * @param {number} from 
 * @param {number} to 
 * @returns {Array<any>}
 */
function slice(arr, from = 0, to = 3) {
    return { arr: arr.slice(from ? from : 0, to ? to : 3), i: to ? (to + 3) : 3 };
};
/**
 * 
 * @param {import("express").RouterOptions} options 
 * @returns {express.Router}
 */
function createRouter(options) {
    return express.Router(options);
}

function createApp() {
    return express();
}
/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function decodeUtf8(str) {
    // console.log("decding")
    return utf8.decode(str);
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function encodeUtf8(str) {
    // console.log("encoding")
    return utf8.encode(str);
}

function getFileUpload() {
    return fileUpload();
}

function getValiadator() {
    let v = require("express-validator")
    return (v);
}

/**
 * 
 * @param {import("express").Response} res 
 * @param {object} options 
 * @returns 
 */
function sendRespnonseJsonSucess(res, options) {
    return res.status(200).json(options);
}
/**
 * 
 * @param {string} str 
 */
function createHashSalted(str) {
    let s = bcryptjs.genSaltSync(10);
    let hash = bcryptjs.hashSync(str, s);
    return hash;
}

/**
 * Syncronous function
 * Returns ```true``` if the password and hash are comparable eachother, otherwise ```false```
 * @param {string} passsword The original Password 
 * @param {string} hash Hashed version of password
 * @returns {boolean}
 */
function comparePassword(passsword, hash) {
    let comparison = bcryptjs.compareSync(passsword, hash);
    return comparison;
}

/**
 * 
 * @param {import("express").Response} res 
 * @param {object} options 
 * @returns 
 */
function sendRespnonseJson404(res, options) {
    return res.status(404).json(options);
}

/**
 * 
 * @param {import("express").Response} res 
 * @param {object} options 
 * @returns 
 */
function sendRespnonseJson400(res, options) {
    return res.status(400).json(options);
}
/**
 * 
 * @param {import("express").Response} res 
 * @param {Buffer<any>|string|Array<any>} data 
 * @returns 
 */
function sendResponseRawSuccess(res, data) {
    return res.status(200).send(data);
}

/**
 * 
 * @param {string|Buffer|object} payload 
 * @param {string=} secretKey 
 */
function signJwt(payload, secretKey) {
    let t = jwt.sign(payload, secretKey || getEnvironmentVariables().jwt);
    return t;
}
/**
 * 
 * @returns {Array<string>}
 */
function getCities() {
    return (JSON.parse(readFileSync("./api/Data/cities.json").toString()).map(elem => elem.name)).concat("Other");
}

function isValidCity(cityName) {
    if (typeof (cityName) !== "string")
        return false;
    let cities = getCities();
    for (let i = 0; i < cities.length; i++)
        if (cityName === cities[i])
            return true;
    return false;
}

/**
 * 
 * @param {string} token 
 * @param {string=} secretKey 
 */
function verifyPayload(token, secretKey) {
    // console.log(t)
    let t = jwt.verify(token, secretKey || (getEnvironmentVariables()).jwt);
    return t;
}

function getEnvironmentVariables() {
    let dotEnv = require("dotenv"),
        env = dotEnv.parse(readFileSync("./.env").toString());;
    return env;
}

function generateUser(user) {
    return new Object({ Name: decodeUtf8(user.Name), Age: user.Age, City: user.City, Gender: user.Gender, Pic: `/api/auth/users/photos/${signJwt({ cat: user.id })}`, Email: decodeUtf8(user.Email) });
}
/**
 * 
 * @param {string} gender 
 */
function isGender(gender) {
    if (typeof gender !== "string")
        return false;
    let arr = ["Male", "Female", "Custom"];
    for (let i = 0; i < arr.length; i++) {
        let e = arr[i];
        if (gender === e)
            return true;
    }
    return false;
}

/**
 * 
 * @param {number} age 
 */
function isValidAge(age) {
    let a = parseInt(age);
    if (isNaN(a)) return false;
    if (a < 0) return false;
    if (a >= 100) return false;
    return true;
}

/**
 * 
 * @param {Object} post 
 * @returns {string}
 */
function generatePostDate(post) {
    let date = new Date(),
        past_years = date.getUTCFullYear() - post.createdAt.getUTCFullYear(),
        past_months = date.getUTCMonth() - post.createdAt.getUTCMonth(),
        past_days = date.getUTCDate() - post.createdAt.getUTCDate(),
        past_hours = date.getHours() - post.createdAt.getHours(),
        past_minutes = date.getMinutes() - post.createdAt.getMinutes(),
        past_seconds = date.getSeconds() - post.createdAt.getSeconds(),
        postDate = `${past_years !== 0 ? (past_years === 1 ? (past_years + " Year") : (past_years + " Years")) :
            past_months !== 0 ? (past_months === 1 ? (past_months + " Month") : (past_months + " Months")) :
                past_days !== 0 ? (past_days === 1 ? (past_days + " Day") : (past_days + " Days")) :
                    past_hours !== 0 ? (past_hours === 1 ? (past_hours + " Hour") : (past_hours + " Hours")) :
                        past_minutes !== 0 ? (past_minutes === 1 ? (past_minutes + " Minute") :
                            (past_minutes + " Minutes")) :
                            (past_seconds === 1 ? (past_seconds + " Second") : (past_seconds + " Seconds"))} ago`;
    return postDate;
}

/**
 * 
 * @param {string} string 
 */
function validateResponseGroup(string) {
    let r = ["high_resolution", "image_details"];
    for (let i = 0; i < r.length; i++) {
        if (r[i] == string)
            return true;
    }
    return false;
}
/**
 * 
 * @param {string} or The order to validate, This can be `popluar` or `latest`
 * @returns {boolean}
 */
function validateOrder(or) {
    let a = ["latest", "popular"];
    for (let i = 0; i < a.length; i++)
        if (a[i] === or)
            return true;
    return false;
}

/**
 * 
 * @param {import("cors").CorsOptions} options 
 * @returns 
 */
function getCors(options) {
    let c = require("cors");
    return c(options);
}

function resolvePath(path_to_resolve) {
    return path.resolve(path_to_resolve);
}

function getMongooseSchemaTypes() {
    let { SchemaTypes } = require("mongoose")
    return SchemaTypes;
}

function processImage(image) {
    let img = sharp(image);
    return img;
}

function generateCategory(cat, decode = true, id = false) {
    if (Array.isArray(cat)) {
        let pusher = [];
        for (let i = 0; i < cat.length; i++) {
            let c = cat[i];
            pusher.push(new Object({ id: id ? signJwt({ cat: c.id }) : null, Name: decode ? decodeUtf8(c.Name) : c.Name, Pic: `${signJwt({ cat: c.id })}`, Type: decode ? decodeUtf8(c.Type) : c.Type }))
        }
        return pusher;
    }
    if (typeof (cat) === "object")
        return new Object({ id: id ? signJwt({ cat: cat.id }) : null, Name: decode ? decodeUtf8(cat.Name) : cat.Name, Pic: `${signJwt({ cat: cat.id })}`, Type: decode ? decodeUtf8(cat.Type) : cat.Type })

    console.log("Invalid argument ", cat);
    return new Object({});
}


// console.log((getCities())[getCities().length-1])

module.exports = {
    generatePostDate,
    generateCategory,
    isValidCity,
    getCities,
    processImage,
    getMongooseSchemaTypes,
    resolvePath,
    getCors,
    sendResponseRawSuccess,
    validateOrder,
    validateResponseGroup,
    slice,
    isValidAge,
    isGender,
    createApp,
    sendRespnonseJson404,
    verifyPayload,
    getEnvironmentVariables,
    signJwt,
    comparePassword,
    sendRespnonseJson400,
    createHashSalted,
    sendRespnonseJsonSucess,
    createRouter,
    getValiadator,
    getFileUpload,
    decodeUtf8,
    encodeUtf8,
    generateUser
}