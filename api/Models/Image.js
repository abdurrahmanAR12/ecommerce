let { Schema, model } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    data: Types.Buffer,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Image = model("Images", new Schema(Image));