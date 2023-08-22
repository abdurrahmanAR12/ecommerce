let { Schema, model } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    pass: Types.Buffer,
    user: Types.ObjectId,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Image = model("Passwords", new Schema(Image));