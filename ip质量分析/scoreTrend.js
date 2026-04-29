const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('使用方法: node scoreTrend.js <数据文件目录> <临界分>');
    console.log('示例: node scoreTrend.js /path/to/data 80');
    console.log('说明: 小于或等于临界分的IP为优质IP,高于临界分的IP为劣质IP');
    process.exit(1);
}

const dataDir = args[0];
const thresholdScore = parseInt(args[1]);
const outputDir = path.join(dataDir, 'output');

if (!fs.existsSync(dataDir)) {
    console.error(`错误: 数据目录不存在 - ${dataDir}`);
    process.exit(1);
}

if (isNaN(thresholdScore)) {
    console.error(`错误: 临界分必须是数字 - ${args[1]}`);
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function processFiles() {
    const files = fs.readdirSync(dataDir).filter(file => {
        return file.match(/^\d{8}\.json$/);
    }).sort();

    console.log(`找到 ${files.length} 个数据文件`);
    console.log(`临界分: ${thresholdScore}`);
    console.log(`优质IP: ipScore <= ${thresholdScore}`);
    console.log(`劣质IP: ipScore > ${thresholdScore}`);

    const dailyStats = [];

    files.forEach(file => {
        const date = parseInt(file.replace('.json', ''));
        const filePath = path.join(dataDir, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            if (Array.isArray(data)) {
                const dayStats = processDailyData(data, date);
                dailyStats.push(dayStats);
            }
        } catch (error) {
            console.error(`处理文件 ${file} 时出错:`, error.message);
        }
    });

    generateStatistics(dailyStats);
}

function processDailyData(dailyData, date) {
    let totalIps = 0;
    let highQualityIps = 0;
    let lowQualityIps = 0;
    let totalScore = 0;
    const ipScores = [];
    let minScore = Infinity;
    let maxScore = -Infinity;

    dailyData.forEach(record => {
        const { ip, taskNum, ipVpn, ipBot, ipScore } = record;
        
        if (!ip || ipScore === undefined) {
            return;
        }

        totalIps++;
        totalScore += ipScore;
        ipScores.push(ipScore);
        
        if (ipScore < minScore) minScore = ipScore;
        if (ipScore > maxScore) maxScore = ipScore;

        if (ipScore <= thresholdScore) {
            highQualityIps++;
        } else {
            lowQualityIps++;
        }
    });

    const lowQualityRatio = totalIps > 0 ? (lowQualityIps / totalIps * 100) : 0;
    const highQualityRatio = totalIps > 0 ? (highQualityIps / totalIps * 100) : 0;
    const avgScore = totalIps > 0 ? totalScore / totalIps : 0;

    ipScores.sort((a, b) => a - b);
    const medianScore = totalIps > 0 ? 
        (totalIps % 2 === 0 ? (ipScores[totalIps/2 - 1] + ipScores[totalIps/2]) / 2 : ipScores[Math.floor(totalIps/2)]) : 0;

    return {
        date: date,
        dateStr: formatDate(date),
        totalIps: totalIps,
        highQualityIps: highQualityIps,
        lowQualityIps: lowQualityIps,
        highQualityRatio: highQualityRatio,
        lowQualityRatio: lowQualityRatio,
        avgScore: avgScore,
        medianScore: medianScore,
        minScore: minScore,
        maxScore: maxScore
    };
}

function formatDate(dateNum) {
    const dateStr = dateNum.toString();
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
}

function generateStatistics(dailyStats) {
    const outputFilePath = path.join(outputDir, `score_trend_${thresholdScore}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(dailyStats, null, 2));

    console.log('\n=== 每日IP质量趋势统计 ===');
    console.log('日期\t\t总IP数\t优质IP数\t劣质IP数\t优质比例\t劣质比例\t平均分\t中位数\t最小分\t最大分');
    console.log('---\t\t---\t---\t---\t---\t---\t---\t---\t---\t---');
    
    dailyStats.forEach(stat => {
        console.log(`${stat.dateStr}\t${stat.totalIps}\t${stat.highQualityIps}\t${stat.lowQualityIps}\t${stat.highQualityRatio.toFixed(2)}%\t${stat.lowQualityRatio.toFixed(2)}%\t${stat.avgScore.toFixed(2)}\t${stat.medianScore.toFixed(2)}\t${stat.minScore}\t${stat.maxScore}`);
    });

    const totalDays = dailyStats.length;
    const avgLowQualityRatio = dailyStats.reduce((sum, stat) => sum + stat.lowQualityRatio, 0) / totalDays;
    const avgHighQualityRatio = dailyStats.reduce((sum, stat) => sum + stat.highQualityRatio, 0) / totalDays;
    const avgScore = dailyStats.reduce((sum, stat) => sum + stat.avgScore, 0) / totalDays;

    console.log('\n=== 总体统计 ===');
    console.log(`统计天数: ${totalDays}`);
    console.log(`平均劣质IP比例: ${avgLowQualityRatio.toFixed(2)}%`);
    console.log(`平均优质IP比例: ${avgHighQualityRatio.toFixed(2)}%`);
    console.log(`平均ipScore: ${avgScore.toFixed(2)}`);

    const trendAnalysis = analyzeTrend(dailyStats);
    console.log('\n=== 趋势分析 ===');
    console.log(`劣质IP比例趋势: ${trendAnalysis.lowQualityTrend}`);
    console.log(`劣质IP比例变化: ${trendAnalysis.lowQualityChange.toFixed(2)}%`);
    console.log(`优质IP比例趋势: ${trendAnalysis.highQualityTrend}`);
    console.log(`优质IP比例变化: ${trendAnalysis.highQualityChange.toFixed(2)}%`);

    const summaryFilePath = path.join(outputDir, `score_trend_summary_${thresholdScore}.json`);
    const summary = {
        thresholdScore: thresholdScore,
        totalDays: totalDays,
        avgLowQualityRatio: avgLowQualityRatio,
        avgHighQualityRatio: avgHighQualityRatio,
        avgScore: avgScore,
        trendAnalysis: trendAnalysis,
        dailyStats: dailyStats
    };
    fs.writeFileSync(summaryFilePath, JSON.stringify(summary, null, 2));

    console.log(`\n=== 输出文件 ===`);
    console.log(`详细数据: ${outputFilePath}`);
    console.log(`汇总数据: ${summaryFilePath}`);
}

function analyzeTrend(dailyStats) {
    if (dailyStats.length < 2) {
        return {
            lowQualityTrend: '数据不足',
            lowQualityChange: 0,
            highQualityTrend: '数据不足',
            highQualityChange: 0
        };
    }

    const firstDay = dailyStats[0];
    const lastDay = dailyStats[dailyStats.length - 1];

    const lowQualityChange = lastDay.lowQualityRatio - firstDay.lowQualityRatio;
    const highQualityChange = lastDay.highQualityRatio - firstDay.highQualityRatio;

    let lowQualityTrend = '稳定';
    if (lowQualityChange > 5) {
        lowQualityTrend = '上升';
    } else if (lowQualityChange < -5) {
        lowQualityTrend = '下降';
    }

    let highQualityTrend = '稳定';
    if (highQualityChange > 5) {
        highQualityTrend = '上升';
    } else if (highQualityChange < -5) {
        highQualityTrend = '下降';
    }

    return {
        lowQualityTrend: lowQualityTrend,
        lowQualityChange: lowQualityChange,
        highQualityTrend: highQualityTrend,
        highQualityChange: highQualityChange
    };
}

console.log(`开始处理数据目录: ${dataDir}`);
console.log(`输出目录: ${outputDir}`);
processFiles();