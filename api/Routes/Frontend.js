let { isValidObjectId } = require("mongoose"),
    { Category } = require("../Models/Category"),
    { Product } = require("../Models/Product"),
    { GenerateProduct } = require("./Products"),
    { getUserOptional } = require("../Middles/getAdmin"),
    { createRouter, getCities, generateCategory, verifyPayload } = require("../../utils/utils"),
    router = createRouter({ caseSensitive: true });

module.exports.Frontend = router;
module.exports.render404 = render404;


router.get("/", Slash);
router.get("/contact_us", async (req, res) => {
    return renderEjs(res, "contact", {
        categories: await Category.find()
    })
});

router.get("/admins/createProduct", async (req, res) => {
    return renderEjs(res, "Admin/newProduct", {
        categories: generateCategory(await Category.find(), true, true)
    });
});

router.get("/admins/products", async (req, res) => {
    return renderEjs(res, "Admin/products", {
        products: await GenerateProduct(await Product.find(), true, true)
    });
});

router.get("/checkout/:product_id", async (req, res) => {
    try {
        let p_id = verifyPayload(req.params.product_id);
        p_id = p_id ? p_id.cat ? p_id.cat : null : null;
        if (!isValidObjectId(p_id))
            return render404(res, "Something went wrong");
        let product = await Product.findById(p_id);
        if (!product)
            return render404(res, "Something went wrong");
        return renderEjs(res, "ProductOverview", {
            product: await GenerateProduct(product, true, true),
            categories: generateCategory(await Category.find(), true, true)
        });
    } catch (error) {
        return render404(res, "Something went wrong");
    }
});


function render404(res, title = null) {
    return renderEjs(res, "404", { title });
}

router.get("/forgot_password", getUserOptional, async (req, res) => {
    return renderEjs(res, "forgotPassword");
})

router.get("/cart", async (req, res) => {
    return renderEjs(res, "cart", {
        categories: await Category.find(),
    });
})

router.get("/settings", async (req, res) => {
    return renderEjs(res, "Settings", {
        categories: await Category.find(),
    });
})

router.get("/settings/update_me", async (req, res) => {
    return renderEjs(res, "updateInfo", {
        categories: await Category.find(),
    });
})

router.get("/login", (req, res) => {
    return renderEjs(res, "auth", {
        type: "login",
        cities: getCities()
    })
})

router.get("/signup", (req, res) => {
    return renderEjs(res, "auth", {
        type: "",
        cities: getCities(),
    })
});

async function Slash(req, res) {
    return renderEjs(res, "main", {
        products: (await GenerateProduct((await Product.find()).slice(0, 8))),
        categories: generateCategory(await Category.find())
    });
}


function renderEjs(res, component, options) {
    return res.render(component, options);
}