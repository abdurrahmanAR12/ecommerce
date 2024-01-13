import { Cart } from "../../../Models/Cart";
import { sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess, verifyPayload } from "../../../utils/utils";
import { getUser } from "../../../Middles/getAdmin";
import { filterCartItems } from "./create";

export default async function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");

    return getUser(req).then(__ => {
        if (req.query['id'])
            return clearCartItem(req, res);
        return clear(req, res)
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function clear(req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
        return sendRespnonseJson404(res, "You don't have built your cart");
    cart = await (await Cart.findByIdAndUpdate(cart.id, { $set: { items: [] } })).save().then(_ => true).catch(_e => false);
    if (!cart)
        return sendRespnonseJson400(res, "Sorry, we can't clear your cart right now, Please try again later");
    return sendRespnonseJsonSucess(res, "Cart cleared");
}

async function clearCartItem(req, res) {
    let id = req.query['id'];
    id = verifyPayload(id);
    id = id ? id.cat ? id.cat : null : null;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
        return sendRespnonseJson404(res, "You don't have built your cart");

    let items = filterCartItems(cart.items, id);
    cart = await (await Cart.findByIdAndUpdate(cart.id, { $set: { items } })).save().then(_ => true).catch(_e => false);
    if (!cart)
        return sendRespnonseJson400(res, "Sorry, we can't remove this item from your cart right now, Please try again later");
    return sendRespnonseJsonSucess(res, "Removed");
}

