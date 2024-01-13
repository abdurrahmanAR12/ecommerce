import c from "../Db/connect";

let { Schema, model, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    pass: Types.Buffer,
    user: Types.ObjectId,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Image = models.Image ? models.Image : model("Image", new Schema(Image));