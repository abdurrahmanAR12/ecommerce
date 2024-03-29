import { Product } from "../../../Models/Product";
import { decodeUtf8, sendRespnonseJsonSucess, sendRespnonseJson400, signJwt } from "../../../utils/utils";
import fuzzysort from "fuzzysort";


export default function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    return getSearchWords(req, res);
}

async function getSearchWords(req, res) {
    let key = req.query["key"],
        prods = (await Product.find()),
        index = fuzzysort.go(key, prods, { key: ['Name'], limit: 10 });

    // flex = require("flexsearch"),
    // ind = new flex.Index({
    //     profile: "match",
    //     tokenize: "full",
    //     depth: true
    // });
    let results = [];
    for (let i = 0; i < index.length; i++) {
        results[results.length] = index[i].obj.Name;
    }
    // let r_s = ind.search(key),
    //     results = []
    // for (let i = 0; i < r_s.length; i++)
    //     results.push(({ id: signJwt({ cat: prods[r_s[i]].id }), Name: decodeUtf8(prods[r_s[i]].Name) }))
    return sendRespnonseJsonSucess(res, results.length ? results : "No Results");
}