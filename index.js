var config = require('./config'),
    express = require('express'),
    request = require('request'),
    app = express(),
    router = express.Router(),
    app_id = process.env.TFLAPPID || config.tflAPI.appId,
    app_key = process.env.TFLAPPKEY|| config.tflAPI.appKey,

    tfl_query = 'https://api.tfl.gov.uk/StopPoint/940GZZLUKSX/Arrivals?app_id=' + app_id + '&app_key=' + app_key;

if (app_id === "" || app_key === "") {
    console.error("AppId or AppKey not found!");
}

router.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

router.get('/kc', function (req, res) {
    request(tfl_query, function (error, response, body) {
        var ret_array = [];

        if (!error && response.statusCode == 200) {
            try {
                ret_obj = JSON.parse(body);
            } catch (e) {
                ret_obj = undefined;
            }

            if (ret_obj) {
                ret_obj.forEach(function (currentValue, index, array) {
                    obj = {};
                    obj.lineName = currentValue.lineName;
                    obj.timeToStation = currentValue.timeToStation;
                    obj.platformName = currentValue.platformName;
                    ret_array.push(obj);
                });
            } else {
                console.log("Couldn't decode the response: " + body);
            }
            ret_array.sort(function (a, b) {
                return a.timeToStation - b.timeToStation;
            });
        }
        res.send(JSON.stringify(ret_array));
    });
});

router.get('/lines/', function (req, res) {
    var lines_query = "https://api.tfl.gov.uk/Line/Mode/tube,dlr?app_id=" + app_id + "&app_key=" + app_key;

    request(lines_query, function (error, response, body) {
        var ret_array = [];

        if (!error && response.statusCode == 200) {
            try {
                ret_obj = JSON.parse(body);
            } catch (e) {
                ret_obj = undefined;
            }

            if (ret_obj) {
                ret_obj.forEach(function (currentValue, index, array) {
                    obj = {};

                    obj.name = currentValue.name;
                    obj.id = currentValue.id;
                    ret_array.push(obj);
                });
            } else {
                console.error("Couldn't decode response: " + body);
            }
            res.send(JSON.stringify(ret_array));
        }
    });
});

if (process.env.NODE_ENV === "development") {
    app.use('/', express.static('public'));
}
app.use('/api', router);

app.listen(3000);
