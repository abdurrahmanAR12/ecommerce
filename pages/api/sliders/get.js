import { Slider as Image } from "../../../Models/Slider";
import {
    sendRespnonseJson404, sendRespnonseJson400, sendRespnonseJsonSucess, decodeUtf8
} from "../../../utils/utils";
import sharp from "sharp";

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
        ids.push({ id: e.route, description: decodeUtf8(e.description) });
    }
    return sendRespnonseJsonSucess(res, ids);
}

async function getImage(req, res) {
    let id = req.query["id"];
    let img = await Image.findOne({ route: id });
    if (!img)
        return sendRespnonseJson404(res, "Not found");
    let stream = require("stream"),
        // data = Buffer.from(await imagemin.buffer(img.data, {
        //     plugins: [
        //         imageminPngquant({
        //             quality: [0.6, .8],
        //             verbose: true
        //         }),
        //         imageminWebp({
        //             quality: 100,
        //             method: 6,
        //             size: 12000,
        //             autoFilter: true,
        //             resize: {
        //                 width: req.query['width'] || 1920,
        //                 height: req.query['height'] || 1080
        //             }
        //         })
        //     ]
        // }));
        data = await sharp(img.data).webp({
            quality: 80,
            effort: 6,
            size: 12000
        }).resize({
            width: parseInt(req.query['width']) || 1920,
            height: parseInt(req.query['height']) || 1080,
            fit: "contain"
        }).toBuffer()
    let pipeline = stream.Readable.from(data);
    console.log(data.byteLength)
    pipeline.pipe(res);
}