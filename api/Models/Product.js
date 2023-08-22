let { model, Schema } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../../utils/utils"),
    SchemaTypes = getMongooseSchemaTypes();

let Category = ({
    Name: SchemaTypes.String,
    Pic: [SchemaTypes.ObjectId],
    Category: SchemaTypes.ObjectId,
    Description: SchemaTypes.String,
    Price: SchemaTypes.Number,
    OverView: SchemaTypes.Array,
    Stock: SchemaTypes.Number,
    cAt: { type: Date, default: Date.now }
});

module.exports.Product = model("Product", new Schema(Category, { timestamps: true }));