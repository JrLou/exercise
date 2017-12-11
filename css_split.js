'use strict';

const fs = require('fs');
const path = require('path');
const co = require('co');
const chalk = require('chalk');
const split = require('css-split');

// prepare data
const SPLIT_SIZE = 2500;
const filePath = path.join(__dirname, 'public/project/apin.css');
const fileName = (function(targetFile){
    var tmp = targetFile.split(process.platform=='win32'?'\\':'/');
    var tmpName = tmp[tmp.length-1];
    return tmpName.split('.')[0];
})(filePath);
const content = fs.readFileSync(filePath, 'utf8');

co(function * () {
    let outputDir = path.join(__dirname, 'public/project/output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // run postcss css split
    // console.log('******************* START POSTCSS CSS SPLIT *******************')
    // const label1 = chalk.cyan('postcss-split')
    // console.time(label1)
    // ;(yield postcssSplit(content, SPLIT_SIZE)).forEach((part, i) => {
    //     let file = path.join(outputDir, `part${i}-postcss-split.css`)
    //     let data = part.css.trim()
    //     fs.writeFileSync(file, data)
    //
    //     console.log('> write %s: %s Byte (%s)', file, data.length, part.count)
    // })
    // console.log()
    // console.timeEnd(label1)
    // console.log()

    // run css split
    console.log('******************* START FAST CSS SPLIT *******************')
    const label2 = chalk.cyan('fast-css-split');
    console.time(label2);
    split(content, SPLIT_SIZE).forEach((part, i) => {
        let file = path.join(outputDir, `${fileName}_${i}.css`);
        let data = part.content.trim();
        fs.writeFileSync(file, data);

        console.log('> write %s: %s Byte (%s)', file, data.length, part.count);
    });
    console.log();
    console.timeEnd(label2);
    console.log();
}).catch(err => {
    console.error(err);
});