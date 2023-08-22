let { connect } = require("mongoose"),
    { getEnvironmentVariables } = require("../../utils/utils");


function MongoConnect() {
    return new Promise((resolve, reject) => {
        let variables = getEnvironmentVariables()
        connect(variables.connectionString, { dbName: variables.dbName }).then(res => {
            console.log("Connected to Mongo");
            resolve(res);
        }).catch(rejection => {
            console.log(rejection)
            reject(rejection);
            process.exit(0);
        });
    });
}

module.exports.MongoConnect = MongoConnect;