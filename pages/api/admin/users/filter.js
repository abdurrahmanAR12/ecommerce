import { User } from "../../../../Models/User";
import { encodeUtf8, generateUser, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../../utils/utils";

export default function handler(req, res) {
    if (!req.query['key'])
        return sendRespnonseJson400(res, "Something went wrong")
    else getUsers(req, res);
}

async function getUsers(req, res) {
    let page = parseInt(req.query['page']),
        key = req.query['key'];
    if (isNaN(page))
        page = 0;
    if (!key)
        return sendRespnonseJson400(res, "Key is missing")
    key = encodeUtf8(key);
    let users = await User.find({ super: false }),
        flex = require("flexsearch"),
        indexer = new flex.Index({
            profile: "speed",
            tokenize: "full",
            depth: true
        }),
        user_res = [], ind = 0;
    for (let i = 0; i < users.length; i++)
        indexer.add(i, users[i].Name);
    let results = indexer.search(key)
    for (let i = page * 4; i < results.length; i++) {
        let user = users[results[i]];
        user_res.push(generateUser(user));
        if (ind === 4)
            break;
        ind++;
    }
    return sendRespnonseJsonSucess(res, user_res);
}