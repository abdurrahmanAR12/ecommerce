import { sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess, verifyPayload } from "../../../../utils/utils";
import { getAdmin } from "../../../../Middles/getAdmin";
import { Concern } from "../../../../Models/Concern";

export default function handler(req, res) {
    if (req.method !== 'DELETE')
        return sendRespnonseJson400(res, "Not authorized");
    return getAdmin(req).then(__ => {
        if (!req.query['id'])
            return sendRespnonseJson400(res, "Not Authorized");
        return getContacts(req, res);
    }).catch(__ => {
        return sendRespnonseJson400(res, __);
    })
}

async function getContacts(req, res) {
    let id = verifyPayload(req.query['id']);
    id = id ? id.cat ? id.cat : null : null;
    let c_s = await Concern.findById(id)
    if (!c_s)
        return sendRespnonseJson404(res, "Not Found");
    let del = await Concern.findByIdAndDelete(id).then(__ => true).catch(__ => false)
    if (!del)
        return sendRespnonseJson400(res, "Failed to delete")
    return sendRespnonseJsonSucess(res, "Deleted");
}