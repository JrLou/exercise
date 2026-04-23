const crypto = require('crypto');

// const

function aesDecrypt(string) {
    let aesSecret = "s83v7r1d";
    let decipher = crypto.createDecipher('aes192', aesSecret);
    let dec = decipher.update(string, 'hex', 'utf8');
    dec += decipher.final('utf8');

    console.log(dec);
}

aesDecrypt("6d8e6f2e19a30002d55c06559a54050b");