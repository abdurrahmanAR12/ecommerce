import { getCities as getCitiesJson, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils"

export default function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not a valid method");
    if (req.query["key"])
        return filterCities(req, res);
    return getCities(res);
}

function filterCities(req, res) {
    let cities = getCitiesJson(),
        c_ret = [];
    for (let i = 0; i < cities.length; i++) {
        let c = cities[i];
        if (c.toLowerCase().includes(req.query["key"].toLowerCase()))
            c_ret.push(c);
    }
    return sendRespnonseJsonSucess(res, c_ret.length === 0 ? "No results" : c_ret);
}

function getCities(res) {
    return sendRespnonseJsonSucess(res, getCitiesJson());
}
