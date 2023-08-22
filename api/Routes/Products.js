let { Image } = require("../Models/Image"),
    { Product } = require("../Models/Product"),
    { isValidObjectId } = require("mongoose"),
    { getAdmin } = require("../Middles/getAdmin"),
    { Category } = require("../Models/Category"),
    { createRouter, getValiadator,
        sendRespnonseJsonSucess, sendRespnonseJson400,
        processImage, encodeUtf8, getFileUpload,
        verifyPayload, sendRespnonseJson404, decodeUtf8,
        signJwt } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true }),
    { body, validationResult, param } = getValiadator();

module.exports = { Products: router, GenerateProduct };

router.use(getFileUpload());

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function createProduct(req, res) {
    res.removeHeader('x-powered-by');
    // console.log(req.body, req.files)
    let errors = validationResult(req);
    res.removeHeader("x-powered-by");
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    let al = await Product.findOne({ Name: encodeUtf8(req.body.Name) })
    if (al)
        return sendRespnonseJson400(res, "Sorry, Another Product with this name or title already submitted, Please Give it another title or create a category and create Products in the Category");

    let OverView;
    try {
        OverView = JSON.parse(req.body.OverView);
    } catch (error) {
        return sendRespnonseJson400(res, "Something went wrong");
    }
    req.body.OverView = OverView;
    if (!req.files)
        return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Photo of your Product or the it is currupted");

    let pics = [];
    let PicKeys = Object.keys(req.files)
    if (req.files) {
        pics = [];
        for (let i = 0; i < PicKeys.length; i++) {
            let key = PicKeys[i],
                pic = req.files[key];
            try {
                let p = processImage(pic.data),
                    data = await p.metadata();
                if ((data.height || data.width) < 300)
                    return sendRespnonseJson400(res, "The Provided Picture is too small, Please upload an hd quality Image with dimensions of 300x300 or higher");
                let img = await (new Image({ data: await p.toBuffer() })).save().then(result => result).catch(_ => false);
                if (!img)
                    return sendRespnonseJson400(res, "Something went wrong, please try later");
                pics.push((img.id));
            } catch (error) {
                return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Image file in your files or the file is currupted");
            }
        }
    }
    let catId = verifyPayload(req.body.Category)
    catId = catId ? catId.cat : null;
    if (!isValidObjectId(catId))
        return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");

    let catInTheList = await Category.findById(catId);
    if (!catInTheList)
        return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");

    let cObj = { ...req.body, Pic: pics },
        keys = Object.keys(cObj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (typeof (cObj[key]) === "string")
            cObj[key] = encodeUtf8(cObj[key]);
    }

    let newP = await (new Product({ ...cObj, Category: catInTheList.id })).save().then(res_ => true).catch(_e => false);
    if (!newP)
        return sendRespnonseJson400(res, "Sorry, Failed to save all of your Information");
    return sendRespnonseJsonSucess(res, "All set, We have saved all the information successfully");
}

async function editProduct(req, res) {
    res.removeHeader('x-powered-by');
    try {
        let errors = validationResult(req);
        res.removeHeader("x-powered-by");
        if (!errors.isEmpty())
            return sendRespnonseJson400(res, errors.array()[0].msg);
        let productId = verifyPayload(req.body.id);
        productId = (productId) ? productId.cat ? productId.cat : null : null;
        if (!productId)
            return sendRespnonseJson400(res, "Sorry, Something went wrong");

        let vProduct = await Product.findById(productId)
        if (!vProduct)
            return sendRespnonseJson400(res, "Sorry, This Product not Exists");

        let OverView;
        try {
            OverView = JSON.parse(req.body.OverView);
        } catch (error) {
            return sendRespnonseJson400(res, "Something went wrong");
        }
        let pics = vProduct.Pic;

        // console.log(pics)
        // return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Photo of your Product or the it is currupted");
        if (req.files) {
            pics = [];
            let PicKeys = Object.keys(req.files)
            for (let i = 0; i < PicKeys.length; i++) {
                let key = PicKeys[i],
                    pic = req.files[key];
                try {
                    let p = processImage(pic.data),
                        data = await p.metadata();
                    if ((data.height || data.width) < 300)
                        return sendRespnonseJson400(res, "The Provided Picture is too small, Please upload an hd quality Image with dimensions of 300x300 or higher");
                    let img = await (new Image({ data: await p.toBuffer() })).save().then(result => result).catch(_ => false);
                    if (!img)
                        return sendRespnonseJson400(res, "Something went wrong, please try later");
                    pics.push((img.id));
                } catch (error) {
                    return sendRespnonseJson400(res, "It seen's that you don't have uploaded the Image file in your files or the file is currupted");
                }
            }
        }
        let catId = verifyPayload(req.body.Category)
        catId = catId ? catId.cat : null;
        if (!isValidObjectId(catId))
            return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");
        req.body.Category = catId;

        let catInTheList = await Category.findById(catId);
        if (!catInTheList)
            return sendRespnonseJson400(res, "Sorry, The category that have selected is not valid, Please try again");

        req.body.OverView = OverView;

        let cObj = { ...req.body, Pic: pics },
            keys = Object.keys(cObj);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (typeof (cObj[key]) === "string")
                cObj[key] = encodeUtf8(cObj[key]);
        }

        // console.log(cObj)

        let newP = await (await Product.findByIdAndUpdate(vProduct.id, { $set: { ...cObj, Category: catInTheList.id } })).save().then(res_ => true).catch(_e => {
            console.log(_e)
            return false;
        });
        if (!newP)
            return sendRespnonseJson400(res, "Sorry, Failed to save all of your Information");
        return sendRespnonseJsonSucess(res, "All set, We have saved all the information successfully");
    } catch (error) {
        return sendRespnonseJson404(res, "Sorry, Something went wrong");
    }
}


async function deleteProduct(req, res) {
    res.removeHeader('x-powered-by');
    let errors = validationResult(req);
    res.removeHeader("x-powered-by");
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    let productId = verifyPayload(req.params.id);
    productId = (productId) ? productId.cat ? productId.cat : null : null;
    if (!productId)
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    if (!isValidObjectId(productId))
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    let vProduct = await Product.findById(productId);
    if (!vProduct)
        return sendRespnonseJson404(res, "The Product that you are going to not exists");
    return Product.findByIdAndDelete(vProduct.id).then(res_ => {
        return sendRespnonseJsonSucess(res, "Successful, The Product is deleted");
    }).catch(_e => {
        return sendRespnonseJson400(res, "Failed, Sorry, we can not delete this Product right now, Please try again later");
    });
}

let catValidateArr = [
    body("Name", "Please Provide the Name or title of the Product").exists().isString().trim().notEmpty(),
    body("Category", "Please select the Category of the Product").isJWT(),
    body("Price", "Provide the Price of Product").isInt(),
    body("Description", "Provide the Description and some additional Details of the Product").exists().isString().trim().notEmpty(),
    body("OverView", "Provide the OverView and some additional Details of the Product").exists().isString().trim().notEmpty(),
    body("Stock", "Describe the Number of Stock in the Store").exists().isInt()
];

async function GenerateProduct(cat, decode = true, id = true) {
    // console.log(cat)
    if (Array.isArray(cat)) {
        let pusher = [];
        for (let i = 0; i < cat.length; i++) {
            let c = cat[i],
                Pic = [];
            for (let i = 0; i < c.Pic.length; i++) {
                let p = await Image.findById(c.Pic[i]);
                Pic.push(`/api/images/${signJwt({ cat: p.id })}`)
            }

            pusher.push(new Object({
                id: id ? signJwt({ cat: c.id }) : cat.id,
                Name: decode ? decodeUtf8(c.Name) : c.Name,
                Category: (await Category.findById(c.Category)).Name,
                Pic,
                Price: c.Price,
                route: c.Name.replace(/[ ]/g, "-").replace(/\\/g).replace(/[/]/g, ""),
                Description: decode ? decodeUtf8(c.Description) : c.Description,
                Stock: c.Stock,
                OverView: (c.OverView)
            }));
        }
        return pusher;
    }
    if (typeof (cat) === "object") {
        let c = cat,
            Pic = [];
        for (let i = 0; i < c.Pic.length; i++) {
            let p = await Image.findById(c.Pic[i]);
            Pic.push(`/api/images/${signJwt({ cat: p.id })}`)
        }
        return new Object({
            id: id ? signJwt({ cat: c.id }) : cat.id,
            Name: decode ? decodeUtf8(c.Name) : c.Name,
            Category: (await Category.findById(c.Category)).Name,
            Pic,
            Price: c.Price,
            route: c.Name.replace(/[ ]/g, "-").replace(/\\/g).replace(/[/]/g, ""),
            Description: decode ? decodeUtf8(c.Description) : c.Description,
            Stock: c.Stock,
            OverView: (c.OverView)
        });
    }
    console.log("Invalid argument ", cat);
    return new Object({});
}

async function getProducts(req, res) {
    res.removeHeader('x-powered-by');
    let errors = validationResult(req);
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, "Something is wrong");
    let page = parseInt(req.params.page),
        prods = await Product.find().skip(page * 8).limit(8);
    return sendRespnonseJsonSucess(res, await GenerateProduct(prods));
}

router.post("/create", catValidateArr, createProduct);
router.post("/edit", [body("id", "id is missing").isJWT(), ...catValidateArr], editProduct);
router.delete("/:id", [param("id", "id is missing").isJWT()], deleteProduct);

/* Todo: Recommender system will be embeded Inshallah */
router.get("/:page", param("page", "page param must be valid").isInt(), getProducts);

router.get("/get/:id", param("id", "id field must be a valid").isJWT(), async (req, res) => {
    res.removeHeader('x-powered-by');
    let errors = validationResult(req);
    res.removeHeader("x-powered-by");
    if (!errors.isEmpty())
        return sendRespnonseJson400(res, errors.array()[0].msg);
    let productId = verifyPayload(req.params.id);
    productId = (productId) ? productId.cat ? productId.cat : null : null;
    if (!productId)
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    if (!isValidObjectId(productId))
        return sendRespnonseJson400(res, "Sorry, Something went wrong");
    let vProduct = await Product.findById(productId);
    if (!vProduct)
        return sendRespnonseJson404(res, "The Product that you are going to not exists");
    return sendRespnonseJsonSucess(res, await GenerateProduct(vProduct));
})