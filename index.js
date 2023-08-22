const { api } = require("./api");
const { Frontend } = require("./api/Routes/Frontend");
const { createApp, getEnvironmentVariables } = require("./utils/utils"),
    path = require("path");

let express = require("express"),
    app = createApp();

app.use("/api", api);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(Frontend)
app.use(express.static("public"));


app.use((req, res) => {
    return res.render("404", { title: "Page not found" });
});

app.listen(getEnvironmentVariables().port || 5000, () => console.log("listening at ", getEnvironmentVariables().port || 5000));