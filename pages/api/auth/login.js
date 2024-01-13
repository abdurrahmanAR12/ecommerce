import { z } from "zod";
import { User } from "../../../Models/User";
import { comparePassword, encodeUtf8, sendRespnonseJson400, sendRespnonseJsonSucess, signJwt } from "../../../utils/utils";
import busboy from "busboy";

export default function handler(req, res) {
    try {
        let { method } = req;
        if (method !== "POST")
            return res.status(405).json("Not Authorized");

        let fP = busboy({ headers: req.headers });
        let fs = {}, files = {};

        fP.on("field", (n, v, info) => {
            fs[n] = v;
        });
        fP.on("file", (name, s, info) => {
            let d = Buffer.alloc(0)
            s.on("data", ch => d = Buffer.concat([d, ch])).on("end", () => {
                files[name] = d;
            });
        });

        req.pipe(fP);

        return fP.on("finish", async () => {
            if (Object.keys(files).length)
                req.files = files;

            let schema = z.object({
                Password: z.string(),
                Email: z.string().email()
            });

            let response = schema.safeParse(fs);
            if (!response.success) {
                let { errors } = response.error;
                return res.status(400).json(errors);
            }

            req.body = response.data;
            let al = await User.findOne({ Email: encodeUtf8(req.body.Email) });
            if (!al)
                return sendRespnonseJson400(res, "Sorry, The Email or password is not valid");
            if ((((((al.super))))))
                return sendRespnonseJson400(res, "Something went wrong");
            let comparison = comparePassword(req.body.Password, al.Password);
            if (!comparison)
                return sendRespnonseJson400(res, "Sorry, The Email or password is not valid");
            let token = signJwt({ user: { id: al.id, Password: al.Password } })
            return sendRespnonseJsonSucess(res, { token, msg: "Success, Logged in" });

        });
    } catch (error) {
        return sendRespnonseJson400(res, "Something went wrong")
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}