let { Images } = require("./Routes/Image"),
    { Orders } = require("./Routes/Orders"),
    { Search } = require("./Routes/Search"),
    { Carts } = require("./Routes/Cart"),
    { Products } = require("./Routes/Products"),
    { Auth } = require("./Auth/Auth"),
    { Data } = require("./Routes/Data"),
    { createRouter } = require("../utils/utils"),
    { MongoConnect } = require("./Db/connect"),
    router = createRouter({ caseSensitive: true });

MongoConnect();

// router.use(getFileUpload());

router.use("/auth", Auth)
router.use("/data", Data)
router.use("/products", Products)
router.use("/images", Images)
router.use("/cart", Carts)
router.use("/search", Search)
router.use("/orders", Orders)


module.exports.api = router;