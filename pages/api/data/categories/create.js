import { z } from "zod";
import { Category } from "../../../../Models/Category";
import { getAdmin } from "../../../../Middles/getAdmin";
import { encodeUtf8, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../../utils/utils";
import busboy from "busboy";

export default async function handler(req, res) {
    return create(req, res);
    return getAdmin(req).then(_ => {
    }).catch(_err => {
        return sendRespnonseJson400(res, _err);
    });
}

async function create(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);

    let fP = busboy({ headers: req.headers });
    let fs = {}, files = {};

    fP.on("field", (n, v, _info) => {
        fs[n] = v;
    });
    fP.on("file", (name, s, _info) => {
        let d = Buffer.alloc(0)
        s.on("data", ch => d = Buffer.concat([d, ch])).on("end", () => {
            files[name] = { data: d };
        });
    });

    req.pipe(fP);

    return fP.on("finish", async () => {
        if (Object.keys(files).length)
            req.files = files;
        req.body = fs;
        let schema = z.object({
            Name: z.string().trim().nonempty(),
            Type: z.string().trim().nonempty()
        });

        let response = schema.safeParse(fs);

        if (!response.success) {
            let { errors } = response.error;
            return sendRespnonseJson400(res, errors[0]);
        }

        if (await Category.findOne({ Name: encodeUtf8(req.body.Name) }))
            return sendRespnonseJson400(res, "This category is already in our System");
        let cObj = { ...req.body },
            cOjbKeys = Object.keys(cObj);
        for (let i = 0; i < cOjbKeys.length; i++) {
            let key = cOjbKeys[i];
            if (typeof (cObj[key]) === "string")
                cObj[key] = encodeUtf8(cObj[key]);
        }

        let cat = await (new Category(cObj)).save().then(res => true).catch(_er => false);
        if (!cat)
            return sendRespnonseJson400(res, "Sorry, but we are failed to create a new Category, Please try again later");
        return sendRespnonseJsonSucess(res, "Successful, Category created");
    });
}

export let config = {
    api: {
        bodyParser: false
    }
}