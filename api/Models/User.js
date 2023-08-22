let { Schema, model } = require("mongoose"),
    { User } = require("../Schemas/User");

module.exports.User = model("user", new Schema(User, { timestamps: true }));