import { z } from "zod";
import { createHashSalted, encodeUtf8, isGender, isValidAge, isValidCity, processImage, sendRespnonseJson400, sendRespnonseJsonSucess, signJwt } from "../../../utils/utils";
import { User } from "../../../Models/User";
import { bus } from "../../../Middles/bus"

export default async function handler(req, res) {
    let { method } = req;
    if (method !== "POST")
        return res.status(405).json(`Not Authorized`);
    return bus(req).then(async __ => {
        let schema = z.object({
            Name: z.string().trim().nonempty("Name is missing"),
            Email: z.string().email("Please Provide your Email Address"),
            Password: z.string().trim().nonempty("Create a your Password for your Account"),
            CPassword: z.string().trim().nonempty("Confirm your Password for your Account"),
            City: z.string().trim().nonempty("Choose your City"),
            Age: z.string("Age must be a number").trim().nonempty("Provide you valid Age"),
            Gender: z.string().trim().nonempty("Provide your Gender"),
        });

        let response = schema.safeParse(req.body);

        if (!response.success) {
            let { errors } = response.error;
            return res.status(400).json(errors[0].message);
        }

        req.body = response.data;
        if (!isValidCity(req.body.City))
            return sendRespnonseJson400(res, "The Provided City is not in the Cities of Pakistan, Please choose `Other` if you have issues");

        if (!isValidAge(parseInt(req.body.Age)))
            return sendRespnonseJson400(res, "The Provided age is not valid, Please try again");

        if (!isGender(req.body.Gender))
            return sendRespnonseJson400(res, "The Provided Gender is not valid, Please try again");

        if (req.body.Password !== req.body.CPassword)
            return sendRespnonseJson400(res, "Passwords must match, Please try again");

        let al = await User.findOne({ Email: encodeUtf8(req.body.Email) });
        if (al)
            return sendRespnonseJson400(res, "Sorry, The user is taken");
        let ProfilePicture = req.files ? req.files["profile_photo"] : null;
        if (ProfilePicture) {
            try {
                let image = processImage(ProfilePicture.data),
                    imageData = await image.metadata();
                if ((imageData.width || imageData.height) < 120)
                    return sendRespnonseJson400(res, "The Provided Profile Photo is too small, The Photo must be 120x120 or later, Please try again")
                ProfilePicture = await image.toBuffer();
            } catch (error) {
                return sendRespnonseJson400(res, "The Provided Profile Photo is not an Please try again")
            }
        }

        let hash = createHashSalted(req.body.Password),
            newUser = new User({ Name: encodeUtf8(req.body.Name), Gender: encodeUtf8(req.body.Gender), City: encodeUtf8(req.body.City), super: false, Email: encodeUtf8(req.body.Email), Age: encodeUtf8(req.body.Age.toString()), Password: hash, ProfilePicture }),
            saved = await newUser.save().then(res => true).catch(_e => false);
        if (!saved)
            return sendRespnonseJson400(res, "We are sorry but we are failed to create your Account, Please try again later");
        let token = signJwt({ user: { id: newUser.id, Password: newUser.Password } })
        return sendRespnonseJsonSucess(res, { token, msg: "Success, Your Account has been created" });
    });
}

export let config = {
    api: {
        bodyParser: false,
    },
};