import { isValidObjectId } from "mongoose";
import { Order } from "../../../Models/Order";
import { sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils";

export default async function cancelOrder(req, res) {
    let orderId = req.params["id"];
    orderId = orderId ? verifyPayload(orderId) : null;
    orderId = orderId ? orderId.cat ? orderId.cat : null : null;
    if (!isValidObjectId(orderId))
        return sendRespnonseJson400(res, "Sorry, The link is expired");
    let or = await Order.findById(orderId);
    if (!or || or.status === "unconfirmed")
        return sendRespnonseJson400(res, "Sorry, You order has no confirmation");
    let orC = await (await Order.findByIdAndDelete(or.id)).then(_ => true).catch(_f => false);
    if (!orC)
        return sendRespnonseJson400(res, "Sorry, can not cancel the order, Please try later");
    return sendRespnonseJsonSucess(res, "You order has been canceled");
}