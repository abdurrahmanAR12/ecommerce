import { User } from "../../../../Models/User";
import { generateUser, sendRespnonseJsonSucess } from "../../../../utils/utils";

export default function handler(req, res) {
    if (req.query['id'])
        return null
    else getUsers(req, res);
}

async function getUsers(req, res) {
    let page = parseInt(req.query['page'])
    if (isNaN(page))
        page = 0;

    let users = await User.find({ super: false }),
        user_res = [], ind = 0;

    for (let i = page * 4; i < users.length; i++) {
        let user = users[i];
        user_res.push(generateUser(user));
        if (ind === 4)
            break;
        ind++;
    }
    return sendRespnonseJsonSucess(res, user_res);
}