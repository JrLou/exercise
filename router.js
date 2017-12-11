var express = require("express");
var router = express.Router();

function setDomain(domain) {
    this.domain = domain;
}
router.get("/apin/*", function (req, res, next) {
    console.log("serviceDomain:"+this.domain);
    var url = this.domain+""+req.originalUrl.slice("/apin".length);
    console.log("url:"+url);
    res.redirect(url);
});


module.exports = {router,setDomain};
