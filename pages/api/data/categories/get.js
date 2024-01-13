import { Category } from "../../../../Models/Category";
import { generateCategory, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../../utils/utils";

export default async function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    if (req.query.key)
        return filterCategories(req, res);
    else return getCats(res)
}

async function getCategoriesJson() {
    return generateCategory(await Category.find(), true, true, true);
}

async function getCats(res) {
    return sendRespnonseJsonSucess(res, await getCategoriesJson());
}

async function filterCategories(req, res) {
    let cats = await Category.find(),
        c_ret = [],
        key = req.query['key'].toLowerCase();
    for (let i = 0; i < cats.length; i++) {
        let c = cats[i];
        if (c.Name.toLowerCase().includes(key) || c.Type.toLowerCase().includes(key))
            c_ret.push(generateCategory(c));
    }
    return sendRespnonseJsonSucess(res, c_ret.length === 0 ? "No results" : c_ret);
}
