let { connect, connections } = require("mongoose")
let { readFileSync } = require("fs")


function getEnvironmentVariables() {
    let dotEnv = require("dotenv"),
        env = dotEnv.parse(readFileSync("./.env").toString());
    return env;
}



function MongoConnect() {
    return new Promise((resolve, reject) => {
        let variables = getEnvironmentVariables()
        return connect(variables.connectionString, { dbName: variables.dbName }).then(res => {
            console.log("Connected to Mongo");
            resolve(res);
        }).catch(rejection => {
            console.log(rejection)
            reject(rejection);
            process.exit(0);
        });
    });
}

if (!connections[0].readyState)
    MongoConnect();

module.exports = connections;