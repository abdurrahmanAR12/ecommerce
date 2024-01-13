import { z } from "zod";
import {
    comparePassword, encodeUtf8, isGender, isValidAge, isValidCity,
    processImage, sendRespnonseJson400, sendRespnonseJsonSucess
} from "../../../../utils/utils";
import busboy from "busboy";
import { User } from "../../../../Models/User";
import { getUser } from "../../../../Middles/getAdmin";

export default async function handler(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);

    return getUser(req).then(_ => {
        return update(req, res);
    }).catch(e => {
        return sendRespnonseJson400(res, e);
    });
}

async function update(req, res) {
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
            Name: z.string().trim().nonempty(),
            Email: z.string().email(),
            Password: z.string().trim().nonempty(),
            City: z.string().trim().nonempty(),
            Age: z.string("Age must be a number").trim().nonempty(),
            Gender: z.string("Age must be a number").trim().nonempty(),
        });

        let response = schema.safeParse(fs);

        if (!response.success) {
            let { errors } = response.error;
            return res.status(400).json(errors[0]);
        }

        req.body = response.data;

        let { City, Age, Gender, Password } = req.body,
            ProfilePicture = req.files ? req.files["profile_photo"] : null;
        if (ProfilePicture) {
            try {
                let image = processImage(ProfilePicture),
                    imageData = await image.metadata();
                if ((imageData.width || imageData.height) < 120)
                    return sendRespnonseJson400(res, "The Provided Profile Photo is too small, The Photo must be 120x120 or later, Please try again")
                ProfilePicture = ProfilePicture = await image.toBuffer();
            } catch (error) {
                return sendRespnonseJson400(res, "The Provided Profile Photo is not an Please try again")
            }
        }

        if (City && (!isValidCity(City)))
            return sendRespnonseJson400(res, "The Provided City is not in the Cities of Pakistan, Please choose `Other` if you have issues");

        if (Age && (!isValidAge(Age)))
            return sendRespnonseJson400(res, "The Provided age is not valid, Please try again");

        if (Gender && (!isGender(Gender)))
            return sendRespnonseJson400(res, "The Provided Gender is not valid, Please try again");

        let al = await User.findById(req.user.id);
        if ((!al))
            return sendRespnonseJson400(res, "Sorry, Something went wrong");

        let comparison = comparePassword(Password, al.Password);
        if (!comparison)
            return sendRespnonseJson400(res, "Sorry, The provided password is invalid, Please renter The Password");
        req.body.Password = al.Password;
        let updates = { ...req.body, ProfilePicture };

        for (const key in updates) {
            if (typeof (updates[key]) === "string" && key !== "Password")
                (updates[key]) = encodeUtf8((updates[key]));
        }

        let updated = await (await User.findByIdAndUpdate(al.id, { $set: updates })).save().then(_res => true).catch(_e => false);
        if (!updated)
            return sendRespnonseJson400(res, "Sorry, We can not update your information right now, Please try again");
        return sendRespnonseJsonSucess(res, { msg: "Success, Updated your information" });
    });
}


export const config = {
    api: {
        bodyParser: false
    }
}