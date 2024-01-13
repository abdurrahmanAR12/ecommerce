import { Image } from "../../../Models/Image";
import busboy from "busboy";
import { sendRespnonseJson400, processImage, sendRespnonseJsonSucess } from "../../../utils/utils";
import { getAdmin } from "../../../Middles/getAdmin";

export default async function handler(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    return createImage(req, res);
    // return getAdmin(req).then(_ => {
    // }).catch(e => {
    //     return sendRespnonseJson400(res, e);
    // });
}


async function createImage(req, res) {
    let fP = busboy({ headers: req.headers });
    let fs = {}, files = {};

    fP.on("field", (n, v, info) => {
        fs[n] = v;
    });

    fP.on("file", (name, s, info) => {
        let d = Buffer.alloc(0)
        s.on("data", ch => d = Buffer.concat([d, ch])).on("end", () => {
            files[name] = { data: d };
        });
    });

    req.pipe(fP);

    return fP.on("finish", async () => {
        // console.log(fs, files)
        if (Object.keys(files).length)
            req.files = files;
        req.body = fs;

        let { files } = req,
            index = 0;
        if (!files)
            return sendRespnonseJson400(res, "You don't have uploaded any of files");
        for (const key in files) {
            let file = files[key];
            try {
                let imgProcess = processImage(file.data).png({ progressive: true, adaptiveFiltering: true, compressionLevel: 9, effort: 10, palette: true }),
                    mData = await imgProcess.metadata();
                if ((mData.width || mData.height) < 300)
                    return sendRespnonseJson400(res, "Please upload HD Dimensioned Images larger than 300x300")
                file = (await imgProcess.toBuffer());
            } catch (error) {
                return sendRespnonseJson400(res, "It seen's like you don't have uploaded the Photo or something is wrong in your photo, Please check and try again");
            }

            let newImage = (new Image({ data: file })).save().then(res_ => true).catch(_e => false);
            if (!newImage)
                return sendRespnonseJson400(res, `Sorry, can not save all of your data right now, from ${Object.keys(files).length} Images uploaded ${index}, Please try later`);
            index++;
        }
        return sendRespnonseJsonSucess(res, "All set, Everything is saved successfully");
    })
}