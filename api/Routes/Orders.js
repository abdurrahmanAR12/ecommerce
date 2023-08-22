const Order = require("../Models/Order");
const { generateCartItems } = require("./Cart");
const { render404 } = require("./Frontend");
let { User } = require("../Models/User"),
    { Image } = require("../Models/Image"),
    { Cart } = require("../Models/Cart"),
    { getUser } = require("../Middles/getAdmin"),
    { isValidObjectId } = require("mongoose"),
    { Category } = require("../Models/Category"),
    { createRouter, getCities: getCitiesJson, getValiadator, sendRespnonseJsonSucess, sendRespnonseJson400, processImage, encodeUtf8, getFileUpload, generateCategory, verifyPayload, sendRespnonseJson404, signJwt, getEnvironmentVariables } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true }),
    { body, validationResult } = getValiadator();

router.use(getFileUpload());

module.exports.Orders = router

async function createOrder(req, res) {
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    let user = await User.findById(req.user.id),
        cart = await Cart.finOne({ user: user.id });
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
}


async function confirmOrder(req, res) {
    let orderId = verifyPayload(req.params["order_id"]);
    orderId = orderId ? orderId.cat ? orderId.cat : null : null;
    if (!isValidObjectId(orderId))
        return render404(res, "Sorry, The link is expired");
    let or = await Order.findById(orderId);
    if (!or || or.status === "confirmed" || or.status === "canceled")
        return render404(res, "Sorry, The link is expired");
    let orC = await (await Order.findByIdAndUpdate(or.id, { $set: { status: "confirmed" } })).save().then(_ => true).catch(_f => false);
    if (!orC)
        return render404(res, "Sorry, The link is expired");
    return res.render("confirmOrd", { title: "You order has been confirmed" });
}

async function cancelOrder(req, res) {
    let orderId = verifyPayload(req.params["order_id"]);
    orderId = orderId ? orderId.cat ? orderId.cat : null : null;
    if (!isValidObjectId(orderId))
        return render404(res, "Sorry, The link is expired");
    let or = await Order.findById(orderId);
    if (!or || or.status === "unconfirmed")
        return render404(res, "Sorry, You order has no confirmation");
    let orC = await (await Order.findByIdAndDelete(or.id)).then(_ => true).catch(_f => false);
    if (!orC)
        return render404(res, "Sorry, can not cancel the order, Please try later");
    return res.render("confirmOrd", { title: "You order has been canceled" });
}

function sendMail(email, subject = "", html = "") {
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


router.post("/", getUser, [
    body("Email", "The Email feild is must be an Email").isEmail(),
    body("phone_no", "Please provide a valid Pakistani phone number").isMobilePhone("en-PK", { strictMode: true }),
    body("address", "Please provide your address").isString().trim().notEmpty(),
    body("Name", "Please provide your Real Name").isString().trim().notEmpty()
], createOrder);

router.post("/confirm/:order_id", confirmOrder);
router.post("/cancel/:order_id", cancelOrder);

