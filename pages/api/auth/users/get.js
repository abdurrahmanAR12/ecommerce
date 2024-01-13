import { getUser } from "../../../../Middles/getAdmin";
import { User } from "../../../../Models/User";
import { generateUser, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess } from "../../../../utils/utils";

export default async function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    return getUser(req, res).then(__ => {
        return getUserReq(req, res)
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function getUserReq(req, res) {
    let user = await User.findById(req.user.id);
    if (!user)
        return sendRespnonseJson404(res, "Not found");
    return sendRespnonseJsonSucess(res, generateUser(user));
} 