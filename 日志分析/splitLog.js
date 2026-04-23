const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

const logLevels = ['V', 'D', 'I', 'W', 'E', 'F', 'A'];
const writeStreams = {};

function splitLogByLevel(inputFilePath) {
    const inputDir = path.dirname(inputFilePath);
    const inputFileName = path.basename(inputFilePath);
    const baseName = path.parse(inputFileName).name;
    const extension = path.parse(inputFileName).ext;

    const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const logLevel = extractLogLevel(line);
        if (logLevel) {
            if (!writeStreams[logLevel]) {
                const outputFileName = `${logLevel}_${baseName}${extension}`;
                const outputFilePath = path.join(inputDir, outputFileName);
                writeStreams[logLevel] = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });
            }
            writeStreams[logLevel].write(line + '\n');
        }
    });

    rl.on('close', () => {
        console.log('日志切割完成！');
        closeAllStreams();
    });

    rl.on('error', (error) => {
        console.error('处理日志时出错:', error);
        closeAllStreams();
    });
}

function extractLogLevel(line) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 5) {
        const logLevel = parts[4];
        if (logLevels.includes(logLevel)) {
            return logLevel;
        }
    }
    return null;
}

function closeAllStreams() {
    for (const level in writeStreams) {
        if (writeStreams[level]) {
            writeStreams[level].end();
            console.log(`已关闭 ${level} 级别日志文件`);
        }
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('使用方法: node splitLog.js <日志文件路径>');
    console.log('示例: node splitLog.js ./android.log');
    process.exit(1);
}

const inputFilePath = args[0];
if (!fs.existsSync(inputFilePath)) {
    console.error(`错误: 文件不存在 - ${inputFilePath}`);
    process.exit(1);
}

console.log(`开始处理日志文件: ${inputFilePath}`);
splitLogByLevel(inputFilePath);