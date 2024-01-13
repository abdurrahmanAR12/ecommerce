import { Key } from "../../../../../Models/Key"
import { encodeUtf8, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess } from "../../../../../utils/utils";
import { getAdmin } from "../../../../../Middles/getAdmin"
import { bus } from "../../../../../Middles/bus"

export default function handler(req, res) {
    return getAdmin(req).then(__ => {
        return bus(req).then(__ => {
            return createKeys(req, res);
        }).catch(__ => {
            return sendRespnonseJson400(res, __);
        })
    }).catch(__ => {
        return sendRespnonseJson400(res, __);
    });
}

async function createKeys(req, res) {
    try {
        let keys = (await Key.find())[0];
        if (!keys) {
            keys = (await ((((new Key({ keys: [] }))))).save());
            keys = await Key.findById(keys.id);
        }
        let flex = require("flexsearch"),
            ind = flex.Index({
                profile: "match",
                tokenize: "full",
                depth: true
            })
        ind.add(keys.keys);
        let s = ind.search(encodeUtf8(req.body.key));
        if (s.length)
            return sendRespnonseJsonSucess(res, "All set");
        let k_s = keys.keys;
        k_s.push(encodeUtf8(req.body.key));
        await (await Key.findByIdAndUpdate(keys.id, { $set: { keys: k_s } })).save();
        return sendRespnonseJsonSucess(res, "All set");
    } catch (error) {
        return sendRespnonseJson404(res, "Failed to set, Unknown error");
    }
}