let { model, Schema } = require("mongoose"),
    { getMongooseSchemaTypes } = require("../../utils/utils"),
    SchemaTypes = getMongooseSchemaTypes();

let Category = ({
    Name: SchemaTypes.String,
    Pic: SchemaTypes.Buffer,
    Type: SchemaTypes.String,
    cAt: { type: Date, default: Date.now }
});

module.exports.Category = model("Category", new Schema(Category, { timestamps: true }));