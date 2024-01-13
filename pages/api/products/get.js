import { isValidObjectId } from "mongoose";
import { Product } from "../../../Models/Product";
import { decodeUtf8, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess, signJwt, verifyPayload } from "../../../utils/utils";
import { Image } from "../../../Models/Image";
import { Category } from "../../../Models/Category";


export default async function handler(req, res) {
    if (req.query["page"])
        return getProducts(req, res);
    if (req.query["id"])
        return getProduct(req, res);
}

async function getProduct(req, res) {
    let productId = req.query["id"];
    try {
        productId = verifyPayload(productId);
    } catch (error) {
        return sendRespnonseJson404(res, "Sorry, Something went wrong");
    }
    productId = (productId) ? productId.cat ? productId.cat : null : null;
    if (!productId)
        return sendRespnonseJson404(res, "Sorry, Something went wrong");
    if (!isValidObjectId(productId))
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    let vProduct = await Product.findById(productId);
    if (!vProduct)
        return sendRespnonseJson404(res, "The Product that you are going to not exists");
    return sendRespnonseJsonSucess(res, await GenerateProduct(vProduct));
}

async function getProducts(req, res) {
    let page = parseInt(req.query["page"]),
        prods = await Product.find().skip(page * 8).limit(8);
    return sendRespnonseJsonSucess(res, await GenerateProduct(prods));
}

export async function GenerateProduct(cat, decode = true, id = true) {
    if (Array.isArray(cat)) {
        let pusher = [];
        for (let i = 0; i < cat.length; i++) {
            let c = cat[i],
                Pic = [];
            for (let i = 0; i < c.Pic.length; i++) {
                let p = await Image.findById(c.Pic[i]);
                Pic.push(`/api/images/get?id=${signJwt({ cat: p.id })}`)
            }
            pusher.push(new Object({
                id: id ? signJwt({ cat: c.id }) : cat.id,
                Name: decode ? decodeUtf8(c.Name) : c.Name,
                Category: (await Category.findById(c.Category)).Name,
                Pic,
                Price: c.Price,
                route: c.Name.replace(/[ ]/g, "-").replace(/\\/g).replace(/[/]/g, ""),
                Description: decode ? decodeUtf8(c.Description) : c.Description,
                Stock: c.Stock,
                OverView: (c.OverView)
            }));
        }
        return pusher;
    }
    if (typeof (cat) === "object") {
        let c = cat, Pic = [];
        for (let i = 0; i < c.Pic.length; i++) {
            let p = await Image.findById(c.Pic[i]);
            Pic.push(`/api/images/get?id=${signJwt({ cat: p.id })}`)
        }
        return new Object({
            id: id ? signJwt({ cat: c.id }) : cat.id,
            Name: decode ? decodeUtf8(c.Name) : c.Name,
            Category: (await Category.findById(c.Category)).Name,
            Pic,
            Price: c.Price,
            route: c.Name.replace(/[ ]/g, "-").replace(/\\/g).replace(/[/]/g, ""),
            Description: decode ? decodeUtf8(c.Description) : c.Description,
            Stock: c.Stock,
            OverView: (c.OverView)
        });
    }
    console.log("Invalid argument ", cat);
    return new Object({});
}
