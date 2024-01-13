import c from "../Db/connect";

let { model, Schema, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    SchemaTypes = getMongooseSchemaTypes();

let Category = ({
    Name: SchemaTypes.String,
    Type: SchemaTypes.String,
    cAt: { type: Date, default: Date.now }
});

module.exports.Category = models.Category ? models.Category : model("Category", new Schema(Category, { timestamps: true }));