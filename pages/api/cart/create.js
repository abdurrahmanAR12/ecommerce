import { isValidObjectId } from "mongoose";
import { Cart } from "../../../Models/Cart";
import { Product } from "../../../Models/Product";
import { sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess, verifyPayload } from "../../../utils/utils";
import { getUser } from "../../../Middles/getAdmin";
import { GenerateProduct } from "../products/get";
import { bus } from "../../../Middles/bus"
import { z } from "zod";

export default function handler(req, res) {
    return getUser(req).then(_ => {
        return createCart(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

export let config = {
    api: {
        bodyParser: false
    }
};

async function createCart(req, res) {
    return bus(req).then(async __ => {
        let schema = z.object({
            productId: z.string().trim().nonempty(),
            quantity: z.string().trim().nonempty(),
        });
        let response = schema.safeParse(req.body);
        if (!response.success) {
            let { errors } = response.error;
            return sendRespnonseJson400(res, errors);
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await (new Cart({ user: req.user.id })).save().then(_ => true).catch(_e => false);
            if (!cart)
                return sendRespnonseJson404(res, "Can't built your cart right now");
            cart = await Cart.findOne({ user: req.user.id });
        }
        let productId = verifyPayload(req.body.productId);
        productId = productId ? productId.cat ? productId.cat : null : null;
        if (!isValidObjectId(productId))
            return sendRespnonseJson400(res, "Something went wrong");
        let product = await Product.findById(productId)
        if (!product)
            return sendRespnonseJson400(res, "Something went wrong");
        if (product.Stock === 0)
            return sendRespnonseJson404(res, "The product is not available right now");
        if (product.Stock < parseInt(req.body.quantity))
            return sendRespnonseJson400(res, "You have selected the products are out of stock right now, Please less your counts, You can order new when new stock comes in");
        // console.log(cart)
        let items = cart.items,
            alr = filterCartItems(items, product.id);
        if (alr) {
            let q = parseInt(req.body.quantity);
            if ((q + items[alr.i].quantity) < product.Stock)
                items[alr.i].quantity += q;
            else return sendRespnonseJson400(res, "You have selected the products are out of stock right now, Please less your counts, You can order new when new stock comes in");
        }
        else items.push({ productId: product.id, quantity: req.body.quantity });
        let update = await (await Cart.findByIdAndUpdate(cart.id, { $set: { items } })).save().then(_ => true).catch(_e => false);
        if (!update)
            return sendRespnonseJson404(res, "Can't build your cart right now, Please try later");
        return sendRespnonseJsonSucess(res, "Added");
    }).catch(e => {
        console.log(e)
        return sendRespnonseJson400(res, e);
    });
}

export function filterCartItems(items, itemId) {
    try {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.productId.toString() === itemId)
                return { i };
        }
        return {};
    } catch (error) {
        return {};
    }
}


export async function generateCartItems(cart) {
    let r_items = [],
        cartItems = cart.items,
        quantity = 0, totalPrice = 0;
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i],
            product = await Product.findById(item.productId)
        if (!product) {
            let c = await Cart.findOne({ user: cart.user }),
                ind = filterCartItems(c),
                items = c.items.filter((_item, i) => i !== ind.i);
            await (await Cart.findByIdAndUpdate(c.id, { $set: { items } })).save();
            continue;
        }
        totalPrice += (item.quantity * product.Price);
        quantity += item.quantity;
        r_items.push({ ...await GenerateProduct(product, true, true), total: item.quantity * product.Price, quantity: item.quantity });
    }
    return { quantity, totalPrice, items: r_items };
}