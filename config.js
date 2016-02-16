var convict = require('convict');

var conf = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 3000,
        env: "PORT"
    },
    tfl: {
        appId: {
            doc: "TFL Application ID.",
            format: String,
            default: null,
            env: "TFLAPPID"
        },
        appKey: {
            doc: "TFL Application Key",
            format: String,
            default: null,
            env: "TFLAPPKEY"
        }
    }
});

conf.loadFile('./config/secrets.json');

conf.validate({strict: true});

module.exports = conf;
