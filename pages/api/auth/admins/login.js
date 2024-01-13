import { z } from "zod";
import { User } from "../../../../Models/User";
import { comparePassword, encodeUtf8, sendRespnonseJson400, sendRespnonseJsonSucess, signJwt } from "../../../../utils/utils";
import { bus } from "../../../../Middles/bus";

export default function handler(req, res) {
    bus(req).then(async __ => {
        let schema = z.object({
            Email: z.string().email("Email Address is required"),
            Password: z.string("Password must be provided")
        });

        let response = schema.safeParse(req.body);
        if (!response.success) {
            let { errors } = response.error;
            return res.status(400).json(errors[0].message);
        }

        req.body = response.data;
        let al = await User.findOne({ Email: encodeUtf8(req.body.Email) });
        if (!al)
            return sendRespnonseJson400(res, "Sorry, The Email or password is not valid");
        if ((((((!al.super))))))
            return sendRespnonseJson400(res, "Something went wrong");
        let comparison = comparePassword(req.body.Password, al.Password);
        if (!comparison)
            return sendRespnonseJson400(res, "Sorry, The Email or password is not valid");
        let token = signJwt({ user: { id: al.id, Password: al.Password } })
        return sendRespnonseJsonSucess(res, { token, msg: "Success, Logged in" });

    });
}

export let config = {
    api: {
        bodyParser: false
    }
};