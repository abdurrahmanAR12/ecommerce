let { isValidObjectId } = require("mongoose"),
    { sendRespnonseJson400, verifyPayload, comparePassword } = require("../utils/utils"),
    { User } = require("../Models/User");

export async function getAdmin(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let token = req.headers["admin_token"];
            let verification = token ? verifyPayload(token) : null;
            if (!(token || verification))
                return reject("Sorry, Can not authorize the Administrator");
            if ((!verification.user) || (!verification.user.id) || (!isValidObjectId(verification.user.id)))
                return reject("Sorry, Can not authorize the Administrator");
            let user = await User.findById(verification.user.id);
            if (((verification.user.Password !== user.Password)) || (!user.super)) {
                return reject("Sorry, Can not authorize the Administrator")
            }
            req.user = verification.user;
            return resolve(true);
        } catch (error) {
            return reject("Sorry, Can not authorize the Administrator")
        }
    });
}

export async function getAdminOptional(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let token = req.headers["admin_token"];
            if (!(token))
                return resolve(false)
            let verification = verifyPayload(token);
            if ((!verification.user) || (!verification.user.id) || (!verification.super) || (!isValidObjectId(verification.user.id)))
                return reject("Sorry, Can not authorize the Administrator");
            let user = await User.findById(verification.user.id);
            if ((verification.user.Password !== user.Password) || (!user.super))
                return reject("Sorry, Can not authorize the Administrator")
            req.user = verification.user;
            return resolve(true);
        } catch (error) {
            return reject(false);
        }
    })
}

export function getUser(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let token = req.headers["token"],
                verification = token ? verifyPayload(token) : null;
            if (!(token || verification))
                return reject("Sorry, Can not authorize the user");
            if ((!verification.user) || (!verification.user.id) || (!isValidObjectId(verification.user.id)))
                return reject("Sorry, Can not authorize the user");
            let user = await User.findById(verification.user.id);
            if ((verification.user.Password !== user.Password))
                return reject("Sorry, Can not authorize the user");
            req.user = verification.user;
            return resolve(true);
        } catch (error) {
            return reject("Sorry, Can not authorize the user");
        }
    });
}

export function getUserOptional(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let token = req.headers["token"];
            if (!(token))
                return resolve(false)
            let verification = verifyPayload(token);
            if ((!verification.user) || (!verification.user.id) || (!isValidObjectId(verification.user.id)))
                return reject("Sorry, Can not authorize the user");
            let user = await User.findById(verification.user.id);
            if ((verification.user.Password!== user.Password))
                return reject("Sorry, Can not authorize the user");
            req.user = verification.user;
            return resolve(true);
        } catch (error) {
            return resolve(false);
        }
    })
}
