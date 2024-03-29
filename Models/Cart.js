import c from "../Db/connect";

let { Schema, model, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    Types = getMongooseSchemaTypes();

let Cart = {
    user: Types.ObjectId,
    items: [{ productId: Types.ObjectId, quantity: { type: Number, default: 1 } }],
    cAt: { type: Types.Date, default: Date.now }
}

module.exports.Cart = models.Cart ? models.Cart : model("Cart", new Schema(Cart, { timestamps: true }));