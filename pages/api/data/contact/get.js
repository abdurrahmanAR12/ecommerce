import { decodeUtf8, generatePostDate, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../../utils/utils";
import { getAdmin } from "../../../../Middles/getAdmin";
import { Concern } from "../../../../Models/Concern";

export default function handler(req, res) {
    if (req.method !== 'GET')
        return sendRespnonseJson400(res, "Not authorized");
    return getAdmin(req).then(__ => {
        return getContacts(req, res);
    }).catch(__ => {
        console.log(__)
        return sendRespnonseJson400(res, __);
    })
}

async function getContacts(req, res) {
    let c_s = await Concern.find(),
        c_res = [];
    for (let i = 0; i < c_s.length; i++) {
        let c = c_s[i];
        c_res.push({
            Name: decodeUtf8(c.Name ? c.Name : ""),
            Email: decodeUtf8(c.Email),
            concern: decodeUtf8(c.concern),
            postDate: generatePostDate(c)
        });
    }
    return sendRespnonseJsonSucess(res, c_res);
}