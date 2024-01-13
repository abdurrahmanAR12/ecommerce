import { isValidObjectId } from "mongoose";
import Order from "../../../../Models/Order";
import { decodeUtf8, generatePostDate, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess, signJwt, verifyPayload } from "../../../../utils/utils";
import { generateCartItems } from "../../cart/create";
import { getAdmin } from "../../../../Middles/getAdmin";

export default function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    if (req.query['id'])
        return getOrder(req, res);
    else return getOrders(req, res);
}

async function getOrder(req, res) {
    let id = req.query["id"];
    id = id ? verifyPayload(id) : null;
    id = id ? id.cat ? id.cat : null : null;
    if (!isValidObjectId(id))
        return sendRespnonseJson404(res, "Not Found")
    let ord = await Order.findById(id)
    if (!ord)
        return sendRespnonseJson404(res, "Not Found");
    return sendRespnonseJsonSucess(res, await generateOrder(or));
}

async function getOrders(req, res) {
    let page = parseInt(req.query['page']);
    if (isNaN(page))
        page = 0;
    let orders = await Order.find(),
        orders_res = [],
        ind = 0;
    for (let i = page * 4; i < orders.length; i++) {
        let or = orders[i];
        orders_res.push(await generateOrder(or));
        if (ind === 4)
            break;
        ind++;
    }
    return sendRespnonseJsonSucess(res, orders_res);
}

async function generateOrder(order) {
    let user = Object.keys(order.user);
    for (let i = 0; i < user.length; i++) {
        let key = user[i];
        order.user[key] = decodeUtf8(order.user[key]);
    }
    return ({
        id: signJwt({ cat: order.id }),
        products: (await generateCartItems(order.products)),
        itemsLength: (order.products.length),
        user: order.user,
        status: order.status,
        postDate: generatePostDate(order)
    });
}


