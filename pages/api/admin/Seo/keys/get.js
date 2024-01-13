import { getAdmin } from "../../../../../Middles/getAdmin";
import { Key } from "../../../../../Models/Key";
import { decodeUtf8, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../../../utils/utils";

export default function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not authorized");
    return getAdmin(req).then(__ => {
        return getKeys(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    })
}

async function getKeys(req, res) {
    try {
        let keys = (await Key.find())[0];
        if (!keys) {
            keys = (await ((((new Key({ keys: [] }))))).save());
            keys = await Key.findById(keys.id);
        }
        return sendRespnonseJsonSucess(res, decodeUtf8(keys.keys.join(",")));
    } catch (error) {
        return sendRespnonseJsonSucess(res, 'Something went wrong');
    }
}