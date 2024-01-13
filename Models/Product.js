import "../Db/connect"
import { Schema, model, models } from "mongoose";

let SchemaTypes = Schema.Types;

let p = new Schema({
    route: String,
    logo: Buffer,
    Name: String,
    id: SchemaTypes.ObjectId,
    heros: [{ image: SchemaTypes.Buffer, title: String, para: String }],
    updates: [{ image: SchemaTypes.Buffer, title: String, para: String }],
    title: SchemaTypes.String,
    para: SchemaTypes.String
});

// console.log(SchemaTypes)

export let Product = models ? models.Product ? models.Product : model("Product", p) : {}