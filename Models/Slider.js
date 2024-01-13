import "../Db/connect";

let { Schema, model, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    data: Types.Buffer,
    route: String,
    description: String,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Slider = models.Slider ? models.Slider : model("Slider", new Schema(Image));