import { Image } from "../../../Models/Image";
import { verifyPayload, sendRespnonseJson404, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../utils/utils";
import { isValidObjectId } from "mongoose";

export default function handler(req, res) {
    if (req.method !== "GET")
        return sendRespnonseJson400(res, "Not Authorized");
    if (req.query['id'])
        return getImage(req, res);
    else {
        return getImages(req, res)
    };
}

async function getImages(req, res) {
    let imgs = await Image.find(),
        ids = [];
    for (let i = 0; i < imgs.length; i++) {
        let e = imgs[i];
        ids[ids.length] = e.route;
    }
    return sendRespnonseJsonSucess(res, ids);
}

async function getImage(req, res) {
    let id = req.query["id"];
    let img = await Image.findOne({ route: id });
    if (!img)
        return sendRespnonseJson404(res, "Not found");
    let stream = require("stream"),
        pipeline = stream.Readable.from(img.data);
    pipeline.pipe(res);
}