import { Product } from "../../../Models/Product";
import { Category } from "../../../Models/Category";
import { encodeUtf8, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess } from "../../../utils/utils";
import { GenerateProduct } from "./get"

export default async function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    let Name = req.query['n'],
        page = parseInt(req.query['page']);
    if (!page || isNaN(page))
        page = 0;
    if (!Name)
        return sendRespnonseJson404(res, "404 - page not found");
    let category = await Category.findOne({ Name: encodeUtf8(Name) });
    if (!category)
        return sendRespnonseJson404(res, "404 - page not found");
    let products = await Product.find({ Category: category.id });
    let ind = 0,
        results = [];
    for (let i = page * 4; i < products.length; i++) {
        if (ind === 4)
            break;
        let p = products[i];
        results.push(await GenerateProduct(p, true, true));
        ind++;
    }
    return sendRespnonseJsonSucess(res, results);
}