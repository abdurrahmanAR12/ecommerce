import { Slider as Image } from "../../../Models/Slider";
import { bus } from "../../../Middles/bus";
import { sendRespnonseJson400, processImage, sendRespnonseJsonSucess, encodeUtf8 } from "../../../utils/utils";
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
    return bus(req).then(async __ => {
        let { files } = req,
            index = 0;
        if (!files)
            return sendRespnonseJson400(res, "You don't have uploaded any of files");
        let file = files["Image"];
        if (!file)
            return sendRespnonseJson400(res, "It seens like you don't uploaded anything");
        try {
            let imgProcess = processImage(file.data).png({ progressive: true, adaptiveFiltering: true, compressionLevel: 9, effort: 10, palette: true }),
                mData = await imgProcess.metadata();
            if ((mData.width || mData.height) < 300)
                return sendRespnonseJson400(res, "Please upload HD Dimensioned Images larger than 300x300")
            file = (await imgProcess.toBuffer());
        } catch (error) {
            return sendRespnonseJson400(res, "It seen's like you don't have uploaded the Photo or something is wrong in your photo, Please check and try again");
        }
        let newImage = (new Image({ data: file, description: encodeUtf8(req.body.description) })).save().then(res_ => true).catch(_e => false);
        if (!newImage)
            return sendRespnonseJson400(res, `Sorry, can not save all of your data right now, from ${Object.keys(files).length} Images uploaded ${index}, Please try later`);
        return sendRespnonseJsonSucess(res, "All set, Everything is saved successfully");
    }).catch(e => {
        console.log(e)
        return sendRespnonseJson400(res, e);
    });
}

export let config = {
    api: {
        bodyParser: false
    }
}
