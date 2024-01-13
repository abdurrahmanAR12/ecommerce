import { sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils"

export default function colors(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    if (req.query['key'])
        return filterColors(req, res);
    return getColorsReq(req, res);
}

function getColors() {
    return ["Black", "White", "Gold", "Silver", "Purple", "Gray", "Brown", "Palm", "Olive", "Light Green", "Green", "Lime", "Lime green"];
}

function getColorsReq(req, res) {
    let colors = getColors();
    return sendRespnonseJsonSucess(res, colors);
}

function filterColors(req, res) {
    let flex = require("flexsearch"),
        ind = new flex.Index({
            profile: "match",
            tokenize: "full",
            depth: true
        }),
        colors = getColors();
    ind.add(colors);
    let r_s = ind.search(req.query["key"]),
        p = [];
    for (let i = 0; i < r_s.length; i++)
        p.push(colors[r_s[i]]);
    return sendResponseRawSuccess(res, p);
}


