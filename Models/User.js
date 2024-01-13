import c from "../Db/connect";
let { Schema, model, SchemaTypes, models } = require("mongoose");

let u = new Schema({
    Name: SchemaTypes.String,
    Email: SchemaTypes.String,
    Password: SchemaTypes.String,
    ProfilePicture: SchemaTypes.Buffer,
    Age: SchemaTypes.String,
    Gender: SchemaTypes.String,
    City: SchemaTypes.String,
    super: { type: SchemaTypes.Boolean, default: false }
}, { timestamps: true })

let User = models.user ? models.user : model("user", u);

module.exports.User = User;