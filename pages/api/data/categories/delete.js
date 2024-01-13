import { isValidObjectId } from "mongoose";
import { Category } from "../../../../Models/Category";
import { sendRespnonseJson400, sendRespnonseJsonSucess, verifyPayload } from "../../../../utils/utils";
import { getAdmin } from "../../../../Middles/getAdmin"


export default async function handler(req, res) {
    return getAdmin(req).then(async _ => {
        if (req.method !== 'DELETE')
            return sendRespnonseJson400(res, "Not Authorized");
        let id = req.query['id'];
        id = id ? verifyPayload(id) : null;
        id = id ? id.cat : null;
        if ((!isValidObjectId(id)))
            return sendRespnonseJson400(res, "Somethinga went wrong, Sorry");
        let cat = await Category.findById(id);
        if (!cat)
            return sendRespnonseJson400(res, "Something went wrong, Sorry");
        let d = await Category.findByIdAndDelete(cat.id).then(res_ => true).catch(_e => false);
        if (!d)
            return sendRespnonseJson400(res, "Sorry, Failed to delete the Category");
        return sendRespnonseJsonSucess(res, "Success, Category deleted successfully");
    }).catch(e => {
        console.log(e)
        return sendRespnonseJson400(res, e);
    });
} 