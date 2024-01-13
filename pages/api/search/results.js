import { sendRespnonseJson400 } from "../../../utils/utils";
import { Product } from "../../../Models/Product";
import { sendRespnonseJsonSucess } from "../../../utils/utils";
import { GenerateProduct } from "../products/get";

export default async function getSearchResults(req, res) {
    let key = req.query["key"],
        page = parseInt(req.query["page"]);

    if (!(key))
        return sendRespnonseJson400(res, "Invalid Params");

    if (!(page) || isNaN(page))
        page = 0;

    let prods = await Product.find(),
        flex = require("flexsearch"),
        ind = new flex.Index({
            profile: "match",
            tokenize: "full",
            depth: true
        });

    let prod;
    for (let i = 0; i < prods.length; i++) {
        prod = prods[i];
        ind.add(i, prod.Name);
    }
    let r_s = ind.search(key),
        results = [], p = 0;

    for (let i = page * 3; i < r_s.length; i++) {
        if (p === 3)
            break;
        results.push(prods[r_s[i]])
        p++;
    }
    return sendRespnonseJsonSucess(res, await GenerateProduct(results));
}

