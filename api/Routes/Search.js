let { Product } = require("../Models/Product"),
    { GenerateProduct } = require("./Products"),
    { getAdmin } = require("../Middles/getAdmin"),
    { isValidObjectId } = require("mongoose"),
    { Category } = require("../Models/Category"),
    { createRouter, getCities: getCitiesJson, getValiadator, sendRespnonseJsonSucess, sendRespnonseJson400, processImage, encodeUtf8, getFileUpload, generateCategory, verifyPayload, sendRespnonseJson404, decodeUtf8 } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true }),
    { body, validationResult, param } = getValiadator();

module.exports.Search = router;

router.get("/key=:key&page=:page", param("key", "key is missing or invalid").exists(), param("page", "page must be number").isInt(), getSearchResults);
router.get("/names/key=:key", param("key", "key is missing or invalid").exists(), getSearchWords);

async function getSearchResults(req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty())
        return sendRespnonseJson404(res, errors.array()[0].msg)
    let key = req.params["key"],
        page = parseInt(req.params["page"]),
        prods = await Product.find(),
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

async function getSearchWords(req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty())
        return sendRespnonseJson404(res, errors.array()[0].msg)
    let key = req.params["key"],
        prods = (await Product.find()).concat(await Category.find()),
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
        results = []
    for (let i = 0; i < r_s.length; i++)
        results.push(decodeUtf8(prods[r_s[i]].Name))
    return sendRespnonseJsonSucess(res, results.length ? results : "No Results");
}
