import { z } from "zod";
import { createHashSalted, decodeUtf8, encodeUtf8, sendRespnonseJson400, sendRespnonseJson404, sendRespnonseJsonSucess } from "../../../utils/utils";
import { User } from "../../../Models/User";
import { bus } from "../../../Middles/bus"
import { sendMail } from "../orders/create";

export default async function handler(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    return bus(req).then(async __ => {
        return resetPasswordForStep(req, res);
    });
}

export let config = {
    api: {
        bodyParser: false,
    },
};

async function resetPasswordForStep(req, res) {
    let schema = z.object({
        Email: z.string().email(),
    });
    let response = schema.safeParse(req.body);
    if (!response.success) {
        let { errors } = response.error;
        return res.status(400).json(errors[0].message);
    }
    req.body = response.data;
    let user = await User.findOne({ Email: encodeUtf8(req.body.Email) });
    
    if (!user)
        return sendRespnonseJson404(res, "The user that you are going to find not exists");
    let pass = randomPassword(),
        sent = await sendMail(decodeUtf8(req.body.Email), "Password reset - Millionairo",
            `<h2>We have resetted your password and new Password is : ${pass}</h2>
        `).then(_resVal => true).catch(_e => {
                console.log(_e);
                return false;
            });
    if (!sent)
        return sendRespnonseJson400(res, "Failed to do the reset, try again later");
    let hash = createHashSalted(pass),
        up = await (await User.findByIdAndUpdate(user.id, { $set: { Password: hash } })).save().then(_ => true).catch(_ => false);
    if (!up)
        return sendRespnonseJson400(res, "Failed to reset the Password, unknown error");
    return sendRespnonseJsonSucess(res, "Successfully resetted the Password and sent to your Email Address");
}

function randomPassword() {
    let strings = "abcdefgh123jklmno+-*456pqrstuvwxyz7890",
        val = [];
    for (let i = 0; i < 8; i++) {
        let r = parseInt(Math.random() * strings.length);
        val.push(strings[r]);
    }
    return val.join("");
}

