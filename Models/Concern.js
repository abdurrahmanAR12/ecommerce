import c from "../Db/connect";

let { Schema, model, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    Types = getMongooseSchemaTypes();

let Image = {
    Name: String,
    Email: String,
    concern: String,
    cAt: { type: Types.Date, default: Date.now }
};

module.exports.Concern = models.Concern ? models.Concern : model("Concern", new Schema(Image, { timestamps: true }));