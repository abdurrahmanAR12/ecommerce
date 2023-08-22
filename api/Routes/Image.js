let { Image } = require("../Models/Image"),
    { getAdmin } = require("../Middles/getAdmin"),
    { isValidObjectId } = require("mongoose"),
    { Category } = require("../Models/Category"),
    { createRouter, getCities: getCitiesJson, getValiadator, sendRespnonseJsonSucess, sendRespnonseJson400, processImage, encodeUtf8, getFileUpload, generateCategory, verifyPayload, sendRespnonseJson404, signJwt } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true }),
    { body, validationResult } = getValiadator();

router.use(getFileUpload());


module.exports.Images = router;

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function uploadNew(req, res) {
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
}


async function getImages(req, res) {
    let imgs = await Image.find().select("_id"),
        ids = [];
    for (let i = 0; i < imgs.length; i++) {
        let e = imgs[i];
        ids.push(signJwt({ cat: e.id }));
    }
    return sendRespnonseJsonSucess(res, ids);
}

async function getImage(req, res) {
    let id = verifyPayload(req.params.id);
    id = id ? id.cat : null;
    if (!isValidObjectId(id))
        return sendRespnonseJson404(res, "Not found");
    let img = await Image.findById(id);
    if (!img)
        return sendRespnonseJson404(res, "Not found");
    let stream = require("stream"),
        pipeline = stream.Readable.from(img.data);
    pipeline.pipe(res);
}

router.post("/", uploadNew);
router.get("/:id", getImage);
router.get("/all", getAdmin, getImages);

