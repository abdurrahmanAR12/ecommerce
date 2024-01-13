import { Product } from "../../../Models/Product";
import { Image } from "../../../Models/Image";
import busboy from "busboy";
import { z } from "zod";
import { sendRespnonseJson400, processImage, encodeUtf8, sendRespnonseJsonSucess, verifyPayload } from "../../../utils/utils";
import { isValidObjectId } from "mongoose";
import { Category } from "../../../Models/Category";
import { getAdmin } from "../../../Middles/getAdmin"

export default async function handler(req, res) {
    return createProduct(req, res);
    // return getAdmin(req).then(_ => {
    // }).catch(e => {
    //     return sendRespnonseJson400(res, e);
    // });
}

async function createProduct(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);

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
        // console.log(fs)
        let schema = z.object({
            Name: z.string().trim().nonempty(),
            Category: z.string().trim().nonempty(),
            Description: z.string().trim().nonempty(),
            Price: z.string().trim().nonempty(),
            OverView: z.string().trim().nonempty(),
            Stock: z.string().trim().nonempty()
        });

        let response = schema.safeParse(req.body);

        if (!response.success) {
            let { errors } = response.error;
            return sendRespnonseJson400(res, errors[0]);
        }

        let al = await Product.findOne({ Name: encodeUtf8(req.body.Name) })
        if (al)
            return sendRespnonseJson400(res, "Sorry, Another Product with this name or title already submitted, Please Give it another title or create a category and create Products in the Category");

        let OverView;
        try {
            OverView = JSON.parse(req.body.OverView);
        } catch (error) {
            return sendRespnonseJson400(res, "Something went wrong");
        }
        req.body.OverView = OverView;
        if (!req.files)
            return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Photo of your Product or the it is currupted");

        let pics = [];
        let PicKeys = Object.keys(req.files)
        if (req.files) {
            pics = [];
            for (let i = 0; i < PicKeys.length; i++) {
                let key = PicKeys[i],
                    pic = req.files[key];
                try {
                    let p = processImage(pic.data);
                    data = await p.metadata();
                    if ((data.height || data.width) < 300)
                        return sendRespnonseJson400(res, "The Provided Picture is too small, Please upload an hd quality Image with dimensions of 300x300 or higher");
                    p.webp({ effort: 6 }).resize({ width: 1280, height: 720, fit: "contain" });
                    let img = await (new Image({ data: await p.toBuffer() })).save().then(result => result).catch(_ => false);
                    if (!img)
                        return sendRespnonseJson400(res, "Something went wrong, please try later");
                    pics[pics.length] = ((img.id));
                } catch (error) {
                    return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Image file in your files or the file is currupted");
                }
            }
        }
        let catId = verifyPayload(req.body.Category)
        catId = catId ? catId.cat : null;
        if (!isValidObjectId(catId))
            return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");

        let catInTheList = await Category.findById(catId);
        if (!catInTheList)
            return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");

        let cObj = { ...req.body, Pic: pics },
            keys = Object.keys(cObj);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (typeof (cObj[key]) === "string")
                cObj[key] = encodeUtf8(cObj[key]);
        }

        let newP = await (new Product({ ...cObj, Category: catInTheList.id })).save().then(res_ => true).catch(_e => false);
        if (!newP)
            return sendRespnonseJson400(res, "Sorry, Failed to save all of your Information");
        return sendRespnonseJsonSucess(res, "All set, We have saved all the information successfully");
    });
}




export let config = {
    api: {
        bodyParser: false
    }
}