import { isValidObjectId } from "mongoose";
import { getAdmin } from "../../../../../Middles/getAdmin";
import { User } from "../../../../../Models/User";
import { generateUser, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess, verifyPayload } from "../../../../../utils/utils";

export default async function handler(req, res) {
    return getAdmin(req, res).then(__ => {
        if (req.query['id'])
            return getUserReq(res);
        else return getUsers(res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function getUsers(res) {
    let users = await User.find({ super: false }), us_ = [];
    for (let i = 0; i < users.length; i++)
        us_.push(generateUser(users[i], false));
    return sendRespnonseJsonSucess(res, us_);
}

async function getUserReq(req, res) {
    if (!req.query.id)
        return sendRespnonseJson404(res, "Not Found");
    let id = verifyPayload(req.query.id);
    id = id ? id.user ? id.user.id ? id.user.id : null : null : null;
    if (!isValidObjectId(id))
        return sendRespnonseJson404(res, "Not found");
    let user = await User.findById();
    if (!user)
        return sendRespnonseJson404(res, "Not found");
    if (user.super)
        return sendRespnonseJson404(res, "Not Found");
    return sendRespnonseJsonSucess(res, generateUser(user));
} 