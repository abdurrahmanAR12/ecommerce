let { isValidObjectId } = require("mongoose"),
    { getUser } = require("../Middles/getAdmin"),
    { encodeUtf8, sendRespnonseJson400, getValiadator,
        createHashSalted, isValidAge, isGender, processImage,
        signJwt, comparePassword, createRouter, isValidCity,
        getFileUpload, sendRespnonseJsonSucess, generateUser, verifyPayload, getEnvironmentVariables, sendRespnonseJson404, decodeUtf8 } = require("../../utils/utils"),
    { User } = require("../Models/User"),
    { validationResult, body } = getValiadator(),
    router = createRouter({ caseSensitive: true });

router.use(getFileUpload())

module.exports.Auth = router;

router.post("/new", [
    body("Name", "Provide a Username, This can 4 characters or less than 20 characters").isLength({ min: 4, max: 20 }),
    body("Email", "Provide your Email Address, This must be valid").isEmail(),
    body("Password", "Provide a strong, remembrable password, This is must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
    body("CPassword", "Provide your Email Address, This must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
    body("Age", "Provide your age").exists().isInt(),
    body("Gender", "Provide your Gender").exists().isString(),
    body("City", "Select your City").exists().isString()
], (req, res) => createAccount(req, res, false));

router.post("/new_admin", [
    body("Name", "Provide a Username, This can 4 characters or less than 20 characters").isLength({ min: 4, max: 20 }),
    body("Email", "Provide your Email Address, This must be valid").isEmail(),
    body("Password", "Provide a strong, remembrable password, This is must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
    body("CPassword", "Provide your Email Address, This must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
    body("Age", "Provide your age").exists().isInt(),
    body("Gender", "Provide your Gender").exists().isString(),
    body("City", "Select your City").exists().isString()
], (req, res) => createAccount(req, res, true));

router.post("/login", [
    body("Email", "Provide your Email Address, This must be valid").isEmail(),
    body("Password", "Provide a strong, remembrable password, This is must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
], async (req, res) => login(req, res, false));

router.post("/login_admin", [
    body("Email", "Provide your Email Address, This must be valid").isEmail(),
    body("Password", "Provide a strong, remembrable password, This is must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
], (req, res) => login(req, res, true));

router.get("/getUser", getUser, getUserReq);
router.get("/users/photos/:user_id", getUserPic);

router.post("/update", [
    body("Name", "Provide a Username, This can 4 characters or less than 20 characters").isLength({ min: 4, max: 20 }),
    body("Email", "Provide your Email Address, This must be valid").isEmail(),
    body("Password", "Provide a strong, remembrable password, This is must be valid").exists().isString().trim().notEmpty({ ignore_whitespace: false }),
], update);

async function createAccount(req, res, _super = false) {
    // console.log(req.body)
    res.removeHeader("x-powered-by");
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    if (!isValidCity(req.body.City))
        return sendRespnonseJson400(res, "The Provided City is not in the Cities of Pakistan, Please choose `Other` if you have issues");

    if (!isValidAge(req.body.Age))
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
            let image = processImage(ProfilePicture),
                imageData = await image.metadata();
            if ((imageData.width || imageData.height) < 120)
                return sendRespnonseJson400(res, "The Provided Profile Photo is too small, The Photo must be 120x120 or later, Please try again")
            ProfilePicture = ProfilePicture = await image.toBuffer();
        } catch (error) {
            return sendRespnonseJson400(res, "The Provided Profile Photo is not an Please try again")
        }
    }
    
    let hash = createHashSalted(req.body.Password),
        newUser = new User({ Name: encodeUtf8(req.body.Name), Gender: req.body.Gender, City: encodeUtf8(req.body.City), super: _super, Email: encodeUtf8(req.body.Email), Age: encodeUtf8(req.body.Age.toString()), Password: hash, ProfilePicture }),
        saved = await newUser.save().then(res => true).catch(_e => false);
    if (!saved)
        return sendRespnonseJson400(res, "We are sorry but we are failed to create your Account, Please try again later");
    let token = _super ? signJwt({ user: { id: newUser.id, super: _super, Password: newUser.Password } }) :
        signJwt({ user: { id: newUser.id, Password: newUser.Password } });
    return sendRespnonseJson400(res, { token, msg: _super ? "Success, A new admin account has been created" : "Success, Your Account has been created" });
}

async function login(req, res, _super = false) {
    res.removeHeader("x-powered-by");
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);

    let al = await User.findOne({ Email: encodeUtf8(req.body.Email) });
    if (!al)
        return sendRespnonseJson400(res, "Sorry, The Email or password is not valid");
    if (_super && (!al.super))
        return sendRespnonseJson400(res, "Something went wrong");
    let comparison = comparePassword(req.body.Password, al.Password);
    if (!comparison)
        return sendRespnonseJson400(res, "Sorry, The Email or password is not valid");

    let token = _super ? signJwt({ user: { id: al.id, super: _super, Password: al.Password } }) :
        signJwt({ user: { id: al.id, Password: al.Password } });
    return sendRespnonseJsonSucess(res, { token, msg: "Success, Logged in" });
}

async function update(req, res) {
    res.removeHeader("x-powered-by");
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
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
        return sendRespnonseJson400(res, "Sorry, The provided password is invalid, Please renter The Password"); s

    let updates = { ...req.body, ProfilePicture };

    for (const key in updates) {
        if (typeof (updates[key]) === "string")
            (updates[key]) = encodeUtf8((updates[key]));
    }

    let updated = await (await User.findByIdAndUpdate(al.id, { $set: updates })).save().then(_res => true).catch(_e => false);

    if (!updated)
        return sendRespnonseJson400(res, "Sorry, We can not update your information right now, Please try again");
    return sendRespnonseJsonSucess(res, { token, msg: "Success, Updated your information" });
}


async function resetPasswordForStep(req, res) {
    let user = await User.findOne({ Email: encodeUtf8(req.body.Email) });
    if (!user)
        return sendRespnonseJson404(res, "The user that you are going to find not exists");
    let pass = randomPassword(),
        sent = await sendMail(decodeUtf8(req.body.Email), "You are going to reset your Password for your Milinairo Account, are you?",
            `<h2>Are you really want to reset your Password if yes so the Password is : ${pass}</h2>
        <h2>If you are not doing this so you can safely rollback by <a href="">Clicking here</a> or confirm by <a href="">Clicking here</a></h2>
        `).then(_resVal => true).catch(_e => {
                console.log(_e);
                return false;
            });
    if (!sent)
        return sendRespnonseJson400(res, "Failed to do the reset, try again later");
    let up = await (await User.findByIdAndUpdate(user.id, { $set: { Password: pass } })).save().then(_ => true).catch(_ => false);
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



function sendMail(email, subject = "", html = "") {
    return new Promise((resolve, reject) => {
        let mailer = require("nodemailer"),
            env_s = getEnvironmentVariables(),
            port = mailer.createTransport({
                service: email.endsWith("gmail.com") ? "gmail" : "outlook",
                auth: {
                    user: env_s.EmailAdmin,
                    pass: env_s.PasswordAdmin
                }
            });
        port.sendMail({
            from: `Refs<${env_s.EmailAdmin}>`,
            to: email,
            subject,
            html
        }, (err, info) => {
            if (err) reject(err)
            else resolve(info)
        });
    });
}


async function getUserReq(req, res) {
    let user = await User.findById(req.user.id);
    if (!user)
        sendRespnonseJson400(res, "Not found");
    return sendRespnonseJsonSucess(res, generateUser(user));
}

async function getUserPic(req, res) {
    try {
        let userId = verifyPayload(req.params['user_id']);
        userId = userId ? userId.cat ? userId.cat : null : null;
        if (!isValidObjectId(userId))
            return sendRespnonseJson400(res, "Not found");
        let user = await User.findById(userId);
        if (!user)
            return sendRespnonseJson400(res, "Not found");

        if (user.ProfilePicture) {
            let stream = require("stream"),
                pipeline = stream.Readable.from(user.ProfilePicture)
            pipeline.pipe(res);
        }
        return res.redirect("/images/user.png")
    } catch (error) {
        return sendRespnonseJson400(res, "Not found");
    }
}