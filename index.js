const express = require("express");
const app = express();
// const file_upload = require("express-fileupload");
/** 
 * @const port Listen to port 5000 for serving Endpoints 
 * */

const port = 5000;
// const { auth } = require("./Auth/Main");
// const { connect } = require("mongoose");
const utf8 = require("utf8");
// const cors = require("cors");
// const { Icons } = require("./Routes/Icons");
// const { Admin } = require("./Routes/Admin");
// const { Nofications } = require("./Routes/Notifications");

// railway uri string
// const uri_string = "mongodb://mongo:GCzao4XZ9BnNeAFJfbQA@containers-us-west-149.railway.app:5500";

// local uri string
// const uri_string = "mongodb://127.0.0.1:27017";
// connect(uri_string, { dbName: "Refs", autoCreate: true }, err => {
//     if (err)
//         console.log(err.message), process.exit(-1);
//     console.log("Connected to Mongo Successfully");
// });

// app.use(cors());
// app.use(file_upload({ safeFileNames: true }));
// app.use(express.json({ strict: true }));

app.get("/", (req, res) => res.contentType("text/html").send(utf8.decode(utf8.encode("<head><style>*{font-family:inter}</style><title>hello</title></head>hello عبدالرحمان"))))
// app.use("/api/auth", auth);
// app.use("/api/notifications", Nofications);
// app.use("/api/icons", Icons);
// app.use("/api/admins", Admin);

app.listen(port, () => console.log("Listening on the port ", port));