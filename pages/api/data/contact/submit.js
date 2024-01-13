import { Cart } from "../../../../Models/Cart";
import { encodeUtf8, sendRespnonseJson400, sendRespnonseJsonSucess } from "../../../../utils/utils";
import { Concern } from "../../../../Models/Concern";
import { bus } from "../../../../Middles/bus";
import { z } from "zod";

export default function submit(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    bus(req).then(async __ => {
        let schema = z.object({
            Email: z.string().email("Your Email Address is missing"),
            Name: z.string().trim().nonempty("Your Real name is missing"),
            concern: z.string().trim().nonempty("Provide your concern")
        });
        let response = schema.safeParse(req.body);
        if (!response.success) {
            let { errors } = response.error;
            return sendRespnonseJson400(res, errors[0].message);
        }
        req.body = response.data;
        for (const key in req.body)
            req.body[key] = encodeUtf8(req.body[key]);
        let f = await (new Concern(req.body)).save().then(_ => true).catch(_ => false);
        if (!f)
            return sendRespnonseJson400(res, "We can not save your information right now please try later");
        return sendRespnonseJsonSucess(res, "All set, You will be replied soon");
    }).catch(__ => {
        console.log(__)
        return res.status(405).json(`Something went wrong`);
    });
}

export let config = {
    api: {
        bodyParser: false
    }
}