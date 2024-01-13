let { Schema, model, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    keys: [Types.String],
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Key = models.keys ? models.keys : model("keys", new Schema(Image));