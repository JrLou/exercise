/* eslint-disable no-console */
var express = require("express");
var router = express.Router();
var request = require("request");
var myconfig = require("../config/setting.js");
/* GET home page. */
/*
 162
 103胡
 94志
 * */
router.post("/api/common/getAPPHotPatch", function (req, res, next) {
    var a = {
        code:1,
        data:{
            updates: true,
            pname: "1.0.3-rc",
            phash: "6f65b7bd4ee3f18e559d89db6eb27c28",
            // phash: '6f65b7bd4ee3f18e559d89db6eb27c21',
            descs: "添加聊天功能\n修复商城页面BUG1312312",
            isup: 1,
            url: "http://10.0.0.110:3000/ppk/android.1501328837240.ppk",
            pdiffUrl: "http://update-packages.reactnative.cn/hash", // un-defined
            diffUrl: "http://update-packages.reactnative.cn/hash" // un-defined
        }
    };

    res.send(JSON.stringify(a));
});

//拦截所有 /api 请求进行转发
router.post("/api/*", function (req, res, next) {

    var url = "http://" + "10.0.0.94:7095" + req.originalUrl;

    console.log("\n");
    console.log("==== url    : " + url);
    console.log("==== form   : " + JSON.stringify(req.body));

    var heads = {};
    for (var v in req.headers) {
        if (v === "content-length" ||
            v === "host" ||
            v === "referer" ||
            v === "origin"
        ) {
            continue;
        }
        heads[v] = req.header(v);
    }
    //为了兼容开发环境
    request.post(
        {
            url: url,
            headers: heads,
            form: req.body
        },
        function (err, httpResponse, body) {
            if (err) {
                res.statusCode = 505;
                res.send("net error");
            } else {
                res.statusCode = httpResponse.statusCode;
                res.send(body);
                console.log("==== result : " + body);
            }
        });
});

router.get("/app/v2/pc", function (req, res, next) {
    res.render("pc");
});
router.get("/app/v2/index/App", function (req, res, next) {
    res.render("index");
});
router.get("/app/down/download.html", function (req, res, next) {
    res.redirect("/app/v2/index");
});

router.get("/app/v2/*", function (req, res, next) {
    //如果是微信浏览器返回true 否则返回false

    var a = req.get("user-agent");
    var b = req.get("x-ucbrowser-ua");

    var userAgentInfo = a?a.toLowerCase():""+b?b.toLowerCase():"";
    console.log("=====ver=======");
    console.log(userAgentInfo);
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod","UCBrowser"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v].toLowerCase()) > 0) {
            flag = false;
            break;
        }
    }
    console.log(req.cookies);
    console.log("no Apin------------------");
    //判断,如果是PC
    if (flag) {
        res.render("pc");
    } else {
        res.render("index");
    }

});
router.get("/app", function (req, res, next) {
    res.redirect("/app/v2/index");
});
router.get("/app/", function (req, res, next) {
    res.redirect("/app/v2/index");
});
router.get("/app/v2", function (req, res, next) {
    res.redirect("/app/v2/index");
});
router.get("/", function (req, res, next) {
    res.redirect("/app/v2/index");
});






module.exports = router;
