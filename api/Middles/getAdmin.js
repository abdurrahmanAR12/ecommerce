let { isValidObjectId } = require("mongoose"),
    { sendRespnonseJson400, verifyPayload, comparePassword } = require("../../utils/utils"),
    { User } = require("../Models/User");


module.exports = { getAdmin, getAdminOptional, getUser, getUserOptional };
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getAdmin(req, res, next) {
    try {
        let token = req.headers["Admin_token"],
            verification = token ? verifyPayload(token) : null;
        if (!(token || verification))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the Administrator");
        if ((!verification.user) || (!verification.user.id) || (!verification.super) || (!isValidObjectId(verification.user.id)))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the Administrator");
        let user = await User.findById(verification.user.id);
        if (!comparePassword(verification.user.Password, user.Password) || (!user.super))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the Administrator")
        req.user = verification.user;
        return next();
    } catch (error) {
        return sendRespnonseJson400(res, "Sorry, Can not authorize the Administrator")
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getAdminOptional(req, res, next) {
    try {
        let token = req.headers["Admin_token"];
        if (!(token))
            return next()
        let verification = verifyPayload(token);
        if ((!verification.user) || (!verification.user.id) || (!verification.super) || (!isValidObjectId(verification.user.id)))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the Administrator");
        let user = await User.findById(verification.user.id);
        if (!comparePassword(verification.user.Password, user.Password) || (!user.super))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the Administrator")
        req.user = verification.user;
        return next();
    } catch (error) {
        return next();
    }
}

async function getUser(req, res, next) {
    try {
        let token = req.headers["token"],
            verification = token ? verifyPayload(token) : null;
        // console.log(token, verification)
        if (!(token || verification))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the user");
        if ((!verification.user) || (!verification.user.id) || (!isValidObjectId(verification.user.id)))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the user");
        let user = await User.findById(verification.user.id);
        if ((verification.user.Password !== user.Password))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the user")
        req.user = verification.user;
        return next();
    } catch (error) {
        return sendRespnonseJson400(res, "Sorry, Can not authorize the user")
    }
}

async function getUserOptional(req, res, next) {
    try {
        let token = req.headers["token"];
        if (!(token))
            return next()
        let verification = verifyPayload(token);
        if ((!verification.user) || (!verification.user.id) || (!isValidObjectId(verification.user.id)))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the user");
        let user = await User.findById(verification.user.id);
        if (!comparePassword(verification.user.Password, user.Password))
            return sendRespnonseJson400(res, "Sorry, Can not authorize the user")
        req.user = verification.user;
        return next();
    } catch (error) {
        return next();
    }
}
