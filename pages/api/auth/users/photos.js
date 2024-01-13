import { isValidObjectId } from "mongoose";
import { getUser } from "../../../../Middles/getAdmin";
import { User } from "../../../../Models/User";
import { sendRespnonseJson400, sendRespnonseJson404, verifyPayload } from "../../../../utils/utils";

export default async function handler(req, res) {
    if (req.method === "GET") {
        return getUserPic(req, res);
    }
}


async function getUserPic(req, res) {
    // try {
        let userId = req.query['user'];
        userId = verifyPayload(req.query['user']);
        userId = userId ? userId.cat ? userId.cat : null : null;
        if (!isValidObjectId(userId))
            return sendRespnonseJson400(res, "Not found");
        let user = await User.findById(userId);
        if (!user)
            return sendRespnonseJson404(res, "Not found");
        if (user.ProfilePicture) {
            let stream = require("stream"),
                pipeline = stream.Readable.from(user.ProfilePicture)
           return pipeline.pipe(res);
        }
        return res.redirect("/images/user.png")
    // } catch (error) {
    //     return sendRespnonseJson400(res, "Not found");
    // }
}