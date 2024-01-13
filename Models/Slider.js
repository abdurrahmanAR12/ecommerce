import c from "../Db/connect";

let { Schema, model, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    data: Types.Buffer,
    description: String,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Slider = models.Slider ? models.Slider : model("Slider", new Schema(Image));