let { Schema, model } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    userName: String,
    Email: String,
    concern: String,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Concern = model("Concerns", new Schema(Image));