let { getMongooseSchemaTypes } = require("../../utils/utils"),
    SchemaTypes = getMongooseSchemaTypes();

let User = ({
    Name: SchemaTypes.String,
    Email: SchemaTypes.String,
    Password: SchemaTypes.String,
    ProfilePicture: SchemaTypes.Buffer,
    Age: SchemaTypes.String,
    Gender: SchemaTypes.String,
    City: SchemaTypes.String,
    super: { type: SchemaTypes.Boolean, default: false }
});

module.exports.User = User;