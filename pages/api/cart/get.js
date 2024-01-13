import { Cart } from "../../../Models/Cart";
import { sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils";
import { getUser } from "../../../Middles/getAdmin";
import { generateCartItems } from "./create";

export default function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    return getUser(req).then(__ => {
        return getCart(req, res);
    }).catch(e => {
        console.log(e)
        return sendRespnonseJson400(res, e);
    });
}

async function getCart(req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
        return sendRespnonseJsonSucess(res, "You have not built your cart");
    return sendRespnonseJsonSucess(res, (await generateCartItems(cart)));
}