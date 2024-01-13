import { Cart } from "../../../Models/Cart";
import Order from "../../../Models/Order";
import { encodeUtf8, getEnvironmentVariables, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils";
import { getUser } from "../../../Middles/getAdmin";
import { bus } from "../../../Middles/bus";
import { User } from "../../../Models/User";
import { generateCartItems } from "../cart/create";

export let config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    return getUser(req).then(_ => {
        return createOrder(req, res);
    }).catch(e => {
        // console.log(e)
        return sendRespnonseJson400(res, e);
    });
}

async function createOrder(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    return bus(req).then(async __ => {
        let user = await User.findById(req.user.id),
            cart = await Cart.findOne({ user: user.id });
        if (!cart)
            return sendRespnonseJson400(res, "You did not have built your cart");
        let ord = await (new Order({
            status: "unconfirmed",
            products: cart.items, user: {
                email: encodeUtf8(req.body.Email),
                name: encodeUtf8(req.body.Name),
                address: encodeUtf8(req.body.address),
                phoneNo: encodeUtf8(req.body.phone_no)
            }
        })).save().then(_ => _).catch(_ => false);
        if (!ord)
            return sendRespnonseJson400(res, "Sorry, we are failed to make order right now, Please try again");
        let cartItems = (await generateCartItems(cart)),
            htmlString = `<h1>You have ordered ${cart.items.email} Products with total quantity ${cartItems.quantity} Retail Price of Rs.${cartItems.totalPrice} If you ordered this, you have confirm it <a href="${getEnvironmentVariables().systemUrl}/api/orders/confirm/${signJwt({ cat: ord.id })}">here</a> or cancel it <a href="${getEnvironmentVariables().systemUrl}/api/orders/cancel/${signJwt({ cat: ord.id })}">here</a></h1>`;
        let m = await sendMail((req.body.Email), "Millionairo Order confirmation", htmlString).then(_ => true).catch(_e => false);
        if (!m) {
            await Order.findByIdAndDelete(ord.id);
            return sendRespnonseJson400(res, "Sorry, we are failed to make order right now, Please try again");
        }
        return sendRespnonseJsonSucess(res, "All set, Order placed but it is unconfirmed, if you want to confirm your order check your inbox of your Email Address");
    });
}

export function sendMail(email, subject = "", html = "") {
    return new Promise((resolve, reject) => {
        let mailer = require("nodemailer"),
            env_s = getEnvironmentVariables(),
            port = mailer.createTransport({
                service: email.endsWith("gmail.com") ? "gmail" : "outlook",
                auth: {
                    user: env_s.EmailAdmin,
                    pass: env_s.PasswordAdmin
                }
            });
        port.sendMail({
            from: `Millionairo<${env_s.EmailAdmin}>`,
            to: email,
            subject,
            html
        }, (err, info) => {
            if (err) reject(err)
            else resolve(info)
        });
    });
}
