import { z } from "zod";
import { Category } from "../../../../Models/Category";
import { getAdmin } from "../../../../Middles/getAdmin";
import { encodeUtf8, generateCategory, processImage, sendRespnonseJson400, sendRespnonseJsonSucess, verifyPayload } from "../../../../utils/utils";
import { isValidObjectId } from "mongoose";
import { bus } from "../../../../Middles/bus";


export default async function exporter(req, res) {
    return getAdmin(req).then(_ => {
        return edit(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function edit(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    bus(req).then(async __ => {
        let schema = z.object({
            id: z.string().trim().nonempty(),
            Name: z.string().trim().nonempty("Category Name is missing"),
            Type: z.string().trim().nonempty("Please Provide the Type of Category")
        });

        let response = schema.safeParse(req.body);

        if (!response.success) {
            let { errors } = response.error;
            return sendRespnonseJson400(res, errors[0].message);
        }

        let id = verifyPayload(req.body.id);
        id = id.cat ? id.cat : null;
        // console.log(id)
        if (!isValidObjectId(id))
            return sendRespnonseJson400(res, "Sorry, Someting went wrong");

        let cat = await Category.findById(id);
        if (!cat)
            return sendRespnonseJson400(res, "Sorry, we can't find any category");
        let cObj = { ...generateCategory(cat, false, false, true) },
            cOjbKeys = Object.keys(req.body);

        for (let i = 0; i < cOjbKeys.length; i++) {
            let key = cOjbKeys[i];
            if (typeof (req.body[key]) === "string")
                cObj[key] = encodeUtf8(req.body[key]);
        }

        cat = await (await Category.findByIdAndUpdate(cat.id, { $set: cObj })).save().then(res => true).catch(_er => false);
        if (!cat)
            return sendRespnonseJson400(res, "Sorry, but we are failed to update the Category, Please try again later");
        return sendRespnonseJsonSucess(res, "Successful, Category updated");
    });
}

export let config = {
    api: {
        bodyParser: false
    }
}