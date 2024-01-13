import { isValidObjectId } from "mongoose";
import { Order } from "../../../Models/Order";
import { sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils";

export default async function confirmOrder(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(req, 'Something went wrong');
    let orderId = req.query["id"];
    orderId = orderId ? verifyPayload(orderId) : null;
    orderId = orderId ? orderId.cat ? orderId.cat : null : null;
    if (!isValidObjectId(orderId))
        return sendRespnonseJson400(res, "Sorry, The link is expired");
    let or = await Order.findById(orderId);
    if (!or || or.status === "confirmed" || or.status === "canceled")
        return sendRespnonseJson400(res, "Sorry, The link is expired");
    let orC = await (await Order.findByIdAndUpdate(or.id, { $set: { status: "confirmed" } })).save().then(_ => true).catch(_f => false);
    if (!orC)
        return sendRespnonseJson400(res, "Sorry, The link is expired");
    return sendRespnonseJsonSucess(res, "You order has been confirmed");
}
