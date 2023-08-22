let { Concern } = require("../Models/Concern"),
    { Key } = require("../Models/Key"),
    { getAdmin } = require("../Middles/getAdmin"),
    { isValidObjectId } = require("mongoose"),
    { Category } = require("../Models/Category"),
    { createRouter, getCities: getCitiesJson, getValiadator, sendRespnonseJsonSucess, sendRespnonseJson400, processImage, encodeUtf8, getFileUpload, generateCategory, verifyPayload, sendRespnonseJson404, sendResponseRawSuccess, decodeUtf8, generatePostDate } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true }),
    { body, validationResult } = getValiadator();

module.exports.Data = router;


router.use(getFileUpload());

function getCities(req_, res) {
    return sendRespnonseJsonSucess(res, getCitiesJson());
}

function filterCities(req, res) {
    let cities = getCitiesJson(),
        c_ret = [];
    for (let i = 0; i < cities.length; i++) {
        let c = cities[i];
        if (c.toLowerCase().includes(req.params.key.toLowerCase()))
            c_ret.push(c);
    }
    return sendRespnonseJsonSucess(res, c_ret.length === 0 ? "No results" : c_ret);
}

async function createCategory(req, res) {
    // console.log(req.files)
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    let pic = req.files ? req.files["pic"] : null;
    // console.log(pic)
    if (!pic)
        return sendRespnonseJson400(res, "Please Select a Category Image");
    if (await Category.findOne({ Name: encodeUtf8(req.body.Name) }))
        return sendRespnonseJson400(res, "This category is already in our System");
    try {
        let p = processImage(pic.data),
            data = await p.metadata();
        if ((data.height || data.width) < 300)
            return sendRespnonseJson400(res, "The Provided Picture is too small, Please upload an hd quality Image with dimensions of 300x300 or higher");
        pic = await p.toBuffer();
    } catch (error) {
        return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Image file or the file is currupted");
    }

    let cObj = { ...req.body, Pic: pic },
        cOjbKeys = Object.keys(cObj);
    // console.log(cObj)
    for (let i = 0; i < cOjbKeys.length; i++) {
        let key = cOjbKeys[i];
        if (typeof (cObj[key]) === "string")
            cObj[key] = encodeUtf8(cObj[key]);
        // console.log(cObj[key])
    }

    let cat = await (new Category(cObj)).save().then(res => true).catch(_er => false);
    if (!cat)
        return sendRespnonseJson400(res, "Sorry, but we are failed to create a new Category, Please try again later");
    return sendRespnonseJsonSucess(res, "Successful, Category created");
}

async function updateCategory(req, res) {
    let errors = validationResult(req);
    res.removeHeader("x-powered-by");
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    let id = verifyPayload(req.body.id);
    id = id.cat ? id.cat : null;
    // console.log(id)
    if (!isValidObjectId(id))
        return sendRespnonseJson400(res, "Sorry, Someting went wrong");

    let pic = req.files ? req.files["pic"] : null,
        cat = await Category.findById(id);
    if (!cat)
        return sendRespnonseJson400(res, "Sorry, we can't find any category");

    if (pic)
        try {
            let p = processImage(pic.data),
                data = await p.metadata();
            if ((data.height || data.width) < 300)
                return sendRespnonseJson400(res, "The Provided Picture is too small, Please upload an hd quality Image with dimensions of 300x300 or higher");
            pic = await p.toBuffer();
        } catch (error) {
            return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Image file or the file is currupted");
        }

    let cObj = { ...generateCategory(cat, false), Pic: pic ? pic : cat.Pic },
        cOjbKeys = Object.keys(req.body);
    // console.log(cObj)
    for (let i = 0; i < cOjbKeys.length; i++) {
        let key = cOjbKeys[i];
        if (typeof (req.body[key]) === "string")
            cObj[key] = encodeUtf8(req.body[key]);
    }

    cat = await (await Category.findByIdAndUpdate(cat.id, { $set: cObj })).save().then(res => true).catch(_er => false);
    if (!cat)
        return sendRespnonseJson400(res, "Sorry, but we are failed to update the Category, Please try again later");
    return sendRespnonseJsonSucess(res, "Successful, Category updated");
}


async function getCategoriesJson() {
    return generateCategory(await Category.find(), true, true);
}

async function filterCategories(req, res) {
    let cats = await getCategoriesJson(),
        c_ret = [],
        key = req.params.key.toLowerCase();
    for (let i = 0; i < cats.length; i++) {
        let c = cats[i];
        if (c.Name.toLowerCase().includes(key) || c.Type.toLowerCase().includes(key))
            c_ret.push(generateCategory(c));
    }
    return sendRespnonseJsonSucess(res, c_ret.length === 0 ? "No results" : c_ret);
}

async function getCategories(req, res) {
    res.removeHeader("x-powered-by");
    return sendRespnonseJsonSucess(res, (await getCategoriesJson()));
}

async function deleteCaterogry(req, res) {
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    id = verifyPayload(id);
    id = id ? id.cat : null;
    if ((!isValidObjectId(id)))
        return sendRespnonseJson400(res, "Something went wrong, Sorry");
    let cat = await Category.findById(id);
    if (!cat)
        return sendRespnonseJson400(res, "Something went wrong, Sorry");
    let d = await cat.delete().then(res_ => true).catch(_e => false);
    if (!d)
        return sendRespnonseJson400(res, "Sorry, Failed to delete the Category");
    return sendRespnonseJsonSucess(res, "Success, Category deleted successfully");
}
//Readolny routes of Pakistan cities
router.get("/cities", getCities);
router.get("/cities/:key", filterCities);


let catArr = [
    body("Name", "Provide the Name your new Category").exists().isString().trim().notEmpty(),
    body("Type", "Provide the type of the Category").exists().isString().trim().notEmpty()
];

router.post("/category", catArr, createCategory);
router.get("/category", getCategories);
router.delete("/category", [
    body("id", "Id field is missing").isJWT()
], getAdmin, deleteCaterogry);
router.get("/category/:key", filterCategories);
router.get("/colors/:key", filterColors);
router.get("/colors", getColorsReq);
router.put("/category", [...catArr, body("id", "Id of the category is missing").isJWT()], updateCategory);

function getColors() {
    return ["Black", "White", "Gold", "Silver", "Purple", "Gray", "Brown", "Palm", "Olive", "Light Green", "Green", "Lime", "Lime green"];
}

function filterColors(req, res) {
    let flex = require("flexsearch"),
        ind = new flex.Index({
            profile: "match",
            tokenize: "full",
            depth: true
        }),
        colors = getColors();
    ind.add(colors);
    let r_s = ind.search(req.params["key"]),
        p = [];
    for (let i = 0; i < r_s.length; i++)
        p.push(colors[r_s[i]]);
    return sendResponseRawSuccess(res, p);
}

function getColorsReq(req, res) {
    let colors = getColors();
    return sendRespnonseJsonSucess(res, colors);
}

router.get("/keys", async (req, res) => {
    try {
        let keys = (await Key.find())[0];
        if (!keys) {
            keys = (await ((((new Key({ keys: [] }))))).save());
            keys = await Key.findById(keys.id);
        }
        return sendRespnonseJsonSucess(res, decodeUtf8(keys.keys.join(",")));
    } catch (error) {
        return sendRespnonseJsonSucess(res, 'n');
    }
});

router.post("/keys", body("keys", "keys is missing").isString().trim().notEmpty(), createKeys);

async function createKeys(req, res) {
    try {
        let keys = (await Key.find())[0];
        if (!keys) {
            keys = (await ((((new Key({ keys: [] }))))).save());
            keys = await Key.findById(keys.id);
        }
        let flex = require("flexsearch"),
            ind = flex.Index({
                profile: "match",
                tokenize: "full",
                depth: true
            })
        ind.add(keys.keys);
        let s = ind.search(encodeUtf8(req.body.key));
        if (s.length)
            return sendRespnonseJsonSucess(res, "All set");
        let k_s = keys.keys;
        k_s.push(encodeUtf8(req.body.key));
        await (await Key.findByIdAndUpdate(keys.id, { $set: { keys: k_s } })).save();
        return sendRespnonseJsonSucess(res, "All set");
    } catch (error) {
        return sendRespnonseJson404(res, "Failed to set, Unknown error");
    }
}


router.post("/contact/submit", [
    body("Name", "Please Provide your real username").isString().trim().notEmpty(),
    body("concern", "Please Provide your concern").isString().trim().notEmpty(),
    body("Email", "Please Provide your Email Address where we can reply you").isString().trim().notEmpty()
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    for (const key in req.body)
        req.body[key] = encodeUtf8(req.body[key]);
    let f = await (new Concern(req.body)).save().then(_ => true).catch(_ => false);
    if (!f)
        return sendRespnonseJson400(res, "We can not save your information right now please try later");
    return sendRespnonseJsonSucess(res, "All set, You will be replied soon");
});

router.get("/contact", getAdmin, async (req, res) => {
    let c_s = await Concern.find(),
        c_res = [];
    for (let i = 0; i < c_s.length; i++) {
        let c = c_s[i];
        c_res.push({
            Name: decodeUtf8(c.userName),
            Email: decodeUtf8(c.Email),
            concern: decodeUtf8(c.concern),
            postDate: generatePostDate(c)
        });
    }
    return sendRespnonseJsonSucess(res, c_res);
});