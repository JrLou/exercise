function loadFunDebugScript(url, apikey,callback) {
    var d = document, script = d.createElement("script");
    script.type = "application/javascript";
    if (typeof (callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
    }
    script.src = url;
    script.setAttribute("apikey", apikey);
    d.body.appendChild(script);
}

loadFunDebugScript("https://og6593g2z.qnssl.com/fundebug.0.3.3.min.js", "9118aceecbca5f72a7d6d801ab1196a34f59af72067ef4fa6161d05ce3006cc7",function () {
    fundebug.appversion = "1.8.0";
    //
    if(window.location.hostname.indexOf("apin.com")>=0){
        fundebug.releasestage = "production";
    }else{
        fundebug.releasestage = "development";
    }
});