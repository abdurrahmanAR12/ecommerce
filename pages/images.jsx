export async function getServerSideProps(ctx) {
    let { Image } = require("../Models/Image"),
        { sendRespnonseJson404 } = require('../utils/utils');
    return getImage(ctx, ctx.res);
    async function getImage(req, res) {
        let id = req.query["id"];
        let img = await Image.findOne({ route: id });
        if (!img)
            return sendRespnonseJson404(res, "Not found");
        let stream = require("stream"),
            pipeline = stream.Readable.from(img.data);
        pipeline.pipe(res);
        return { props: {} }
    }
}

export default () => {

}