import { Product } from "../../../Models/Product";
import { sendRespnonseJson404, sendRespnonseJsonSucess, sendRespnonseJson400, verifyPayload } from "../../../utils/utils";
import { isValidObjectId } from "mongoose";
import { getAdmin } from "../../../Middles/getAdmin";

export default async function handler(req, res) {
    return getAdmin(req).then(_ => {
        return deleteProduct(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function deleteProduct(req, res) {
    if (req.method !== 'DELETE')
        return sendRespnonseJson400(res, "Not authorized");
    let productId = verifyPayload(req.query["id"]);
    productId = (productId) ? productId.cat ? productId.cat : null : null;
    if (!productId)
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    if (!isValidObjectId(productId))
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    let vProduct = await Product.findById(productId);
    if (!vProduct)
        return sendRespnonseJson404(res, "The Product that you are going to not exists");
    return Product.findByIdAndDelete(vProduct.id).then(res_ => {
        return sendRespnonseJsonSucess(res, "Successful, The Product is deleted");
    }).catch(_e => {
        return sendRespnonseJson400(res, "Failed, Sorry, we can not delete this Product right now, Please try again later");
    });
}