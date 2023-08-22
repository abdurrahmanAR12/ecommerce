const { GenerateProduct } = require("./Products");

let { Cart } = require("../Models/Cart"),
    { Product } = require("../Models/Product"),
    { getUser } = require("../Middles/getAdmin"),
    { isValidObjectId } = require("mongoose"),
    { createRouter, getCities: getCitiesJson, getValiadator, sendRespnonseJsonSucess, sendRespnonseJson400, processImage, encodeUtf8, getFileUpload, generateCategory, verifyPayload, sendRespnonseJson404, signJwt, decodeUtf8 } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true }),
    { body, validationResult } = getValiadator();

router.use(getFileUpload());

module.exports.Carts = router;
module.exports.generateCartItems = generateCartItems;

router.get("/", getUser, getCart);
router.post("/clear", getUser, cleartCart);
router.post("/", getUser, [
    body("productId", "Product id is missing").isJWT(),
    body("quantity", "Quantity is missing").isInt()
], createCart);

router.delete("/", getUser, body("productId", "Product id must be provided").isJWT(), deleteCartItem);


async function deleteCartItem(req, res) {
    try {
        res.removeHeader('x-powered-by');
        let errors = validationResult(req);
        if (!errors.isEmpty())
            return sendRespnonseJson400(res, errors.array()[0].msg);
        let cart = await Cart.findOne(req.user.id);
        if (!cart)
            return sendRespnonseJson400(res, "You don't have this item in your cart");
        let productId = verifyPayload(req.body.productId);
        productId = productId ? productId.cat ? productId.cat : null : null;
        if (!isValidObjectId(productId))
            return sendRespnonseJson400(res, "Something went wrong");
        let product = await Product.findById(productId)
        if (!product)
            return sendRespnonseJson400(res, "Something went wrong");
        let items = cart.items.filter(item => item.productId !== product.id),
            update = await (await Cart.findByIdAndUpdate(cart.id, { $set: { items } })).save().then(_ => true).catch(_e => false);
        if (!update)
            return sendRespnonseJson404(res, "Can't delete this item from your cart right now");
        return sendRespnonseJson404(res, "Removed");
    } catch (error) {
        return sendRespnonseJson404(res, "Can't delete this item from your cart right now");
    }
}

async function createCart(req, res) {
    res.removeHeader('x-powered-by');
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
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
    let items = cart.items,
        alr = filterCartItems(items, product.id);
    // console.log(alr)
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
}

function filterCartItems(items, itemId) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.productId.toString() === itemId)
            return { i };
    }
    return false;
}

async function GenerateCart(cart) {
    let totalPrice = 0,
        pusher = [],
        quantity = 0;
    for (let i = 0; i < cart.items.length; i++) {
        let item = cart.items[i],
            product = await Product.findById(item.productId);
        if (!product) {
            let items = cart.items;
            items = items.filter(i => i.productId !== item.productId);
            await (await Cart.findByIdAndUpdate(cart.id, { $set: { items } })).save().then(_ => true).catch(_ => false);
            cart = await Cart.findById(cart.id);
            continue;
        }
        totalPrice += (product.Price * item.quantity);
        pusher.push({
            id: signJwt({ cat: product.id }),
            Price: `Rs: ${product.Price}`,
            quantity: item.quantity,
            Name: decodeUtf8(product.Name),
            Pic: `/api/images/${signJwt({ cat: product.id })}`,
            totalPrice: `Rs: ${item.quantity * product.Price}`
        });
    }
    return { quantity, items: pusher };
}

async function cleartCart(req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
        return sendRespnonseJson404(res, "You don't have built your cart");
    cart = await (await Cart.findByIdAndUpdate(cart.id, { $set: { items: [] } })).save().then(_ => true).catch(_e => false);
    if (!cart)
        return sendRespnonseJson400(res, "Sorry, we can't clear your cart right now, Please try again later");
    return sendRespnonseJsonSucess(res, "Cart cleared");
}

async function getCart(req, res) {
    res.removeHeader('x-powered-by');
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
        return sendRespnonseJsonSucess(res, "You have not built your cart");
    return sendRespnonseJsonSucess(res, (await generateCartItems(cart)));
}

async function generateCartItems(cart) {
    let r_items = [],
        cartItems = cart.items,
        quantity = 0, totalPrice = 0;
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i],
            product = await Product.findById(item.productId)
        if (!product) {
            let c = Cart.findOne({ user: cart.user }),
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