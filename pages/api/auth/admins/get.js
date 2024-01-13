import { getAdmin } from "../../../../Middles/getAdmin";
import { User } from "../../../../Models/User";
import { generateUser, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess } from "../../../../utils/utils";

export default async function handler(req, res) {
    return getAdmin(req, res).then(__ => {
        if (req.query['all'])
            return getUsers(req, res);
        else return getUserReq(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function getUsers(req, res) {
    let users = await User.find({ super: true }), us_ = [];
    for (let i = 0; i < users.length; i++)
        us_.push(generateUser(users[i], true));
    return sendRespnonseJsonSucess(res, us_);
}

async function getUserReq(req, res) {
    let user = await User.findById(req.user.id);
    if (!user)
        return sendRespnonseJson404(res, "Not found");
    if (!user.super)
        return sendRespnonseJson404(res, "Not Found");
    return sendRespnonseJsonSucess(res, generateUser(user, true));
} 