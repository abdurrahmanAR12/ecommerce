import { Product } from "../../../Models/Product";
import { Image } from "../../../Models/Image";
import { bus } from "../../../Middles/bus";
import { z } from "zod";
import { sendRespnonseJson400, processImage, encodeUtf8, sendRespnonseJsonSucess, verifyPayload } from "../../../utils/utils";
import { isValidObjectId } from "mongoose";
import { getAdmin } from "../../../Middles/getAdmin"

export default function exporter(req, res) {
    getAdmin(req).then(_ => {
        return editProduct(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function editProduct(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    return bus(req).then(async __ => {
        let schema = z.object({
            Name: z.string().trim().nonempty(),
            Category: z.string().trim().nonempty(),
            Description: z.string().trim().nonempty(),
            Price: z.string().trim().nonempty(),
            OverView: z.string().trim().nonempty(),
            Stock: z.string().trim().nonempty()
        });

        let response = schema.safeParse(fs);

        if (!response.success) {
            let { errors } = response.error;
            return sendRespnonseJson400(res, errors[0]);
        }

        let productId = verifyPayload(req.body.id);
        productId = (productId) ? productId.cat ? productId.cat : null : null;
        if (!productId)
            return sendRespnonseJson400(res, "Sorry, Something went wrong");

        let vProduct = await Product.findById(productId)
        if (!vProduct)
            return sendRespnonseJson400(res, "Sorry, This Product not Exists");

        let OverView;
        try {
            OverView = JSON.parse(req.body.OverView);
        } catch (error) {
            return sendRespnonseJson400(res, "Something went wrong");
        }
        let pics = vProduct.Pic;

        if (req.files) {
            pics = [];
            let PicKeys = Object.keys(req.files)
            for (let i = 0; i < PicKeys.length; i++) {
                let key = PicKeys[i],
                    pic = req.files[key];
                try {
                    let p = processImage(pic.data),
                        data = await p.metadata();
                    if ((data.height || data.width) < 300)
                        return sendRespnonseJson400(res, "The Provided Picture is too small, Please upload an hd quality Image with dimensions of 300x300 or higher");
                    let img = await (new Image({ data: await p.toBuffer() })).save().then(result => result).catch(_ => false);
                    if (!img)
                        return sendRespnonseJson400(res, "Something went wrong, please try later");
                    pics.push((img.id));
                } catch (error) {
                    return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Image file in your files or the file is currupted");
                }
            }
        }
        let catId = verifyPayload(req.body.Category)
        catId = catId ? catId.cat : null;
        if (!isValidObjectId(catId))
            return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");
        req.body.Category = catId;

        let catInTheList = await Category.findById(catId);
        if (!catInTheList)
            return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");

        req.body.OverView = OverView;
        let cObj = { ...req.body, Pic: pics },
            keys = Object.keys(cObj);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (typeof (cObj[key]) === "string")
                cObj[key] = encodeUtf8(cObj[key]);
        }

        let newP = await (await Product.findByIdAndUpdate(vProduct.id, { $set: { ...cObj, Category: catInTheList.id } })).save().then(res_ => true).catch(_e => {
            console.log(_e)
            return false;
        });
        if (!newP)
            return sendRespnonseJson400(res, "Sorry, Failed to save all of your Information");
        return sendRespnonseJsonSucess(res, "All set, We have saved all the information successfully");
    });
}

export let config = {
    api: {
        bodyParser: false
    }
};