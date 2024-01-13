export default async function da(ctx) {
    let { Product } = require("../../Models/Product");
    let p = await Product.find();
    return { props: { products: await generateProduct(p) } }
}