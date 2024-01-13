import c from "../Db/connect";

let { model, Schema, models } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../utils/utils"),
    SchemaTypes = getMongooseSchemaTypes();

let Category = ({
    Name: SchemaTypes.String,
    Pic: [SchemaTypes.ObjectId],
    Category: SchemaTypes.ObjectId,
    Description: SchemaTypes.String,
    Price: SchemaTypes.Number,
    OverView: SchemaTypes.Array,
    Stock: SchemaTypes.Number,
    cAt: { type: Date, default: Date.now },
    route: String
});

module.exports.Product = models.Product || model("Product", new Schema(Category, { timestamps: true }));