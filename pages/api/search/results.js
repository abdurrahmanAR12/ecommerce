import { sendRespnonseJson400 } from "../../../utils/utils";
import { Product } from "../../../Models/Product";
import { sendRespnonseJsonSucess } from "../../../utils/utils";
import { GenerateProduct } from "../products/get";
import fuzzysort from "fuzzysort";

export default async function getSearchResults(req, res) {
    let key = req.query["key"],
        page = parseInt(req.query["page"]);
    if (!(key))
        return sendRespnonseJson400(res, "Invalid Params");
    if (!(page) || isNaN(page))
        page = 0;
    let prods = await Product.find(),
        index = fuzzysort.go(key, prods, { key: ['Name'], limit: Infinity });
    let prod, results = [], p = 0;
    for (let i = page * 3; i < index.length; i++) {
        if (p === 3)
            break;
        prod = index[i];
        results[results.length] = (await GenerateProduct(prod.obj));
    }
    return sendRespnonseJsonSucess(res, await GenerateProduct(results));
}

