/**
 * 对ip维度的数据进行处理，数据原文件应该符合如下格式：文件名 YYYYMMDD.json，文件内容：
[{"ip":"119.28.52.73","taskNum":1079,"ipVpn":1,"ipBot":1,"ipScore":100},
{"ip":"38.190.1.36","taskNum":960,"ipVpn":1,"ipBot":1,"ipScore":100},
{"ip":"103.22.138.58","taskNum":793,"ipVpn":0,"ipBot":0,"ipScore":0}]
**/

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('使用方法: node dealData.js <数据文件目录>');
    console.log('示例: node dealData.js /path/to/data');
    process.exit(1);
}

const dataDir = args[0];
const outputDir = path.join(dataDir, 'output');

if (!fs.existsSync(dataDir)) {
    console.error(`错误: 数据目录不存在 - ${dataDir}`);
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const ipDataMap = new Map();
const ipOccurrenceCount = new Map();
const ipChanges = [];
const ipDailyTasks = new Map();
const ipChangeCategories = {
    ipVpn_0_to_1: new Set(),
    ipVpn_1_to_0: new Set(),
    ipBot_0_to_1: new Set(),
    ipBot_1_to_0: new Set(),
    ipScore_increase: new Set(),
    ipScore_decrease: new Set()
};

function processFiles() {
    const files = fs.readdirSync(dataDir).filter(file => {
        return file.match(/^\d{8}\.json$/) && file !== 'dealData.js';
    }).sort();

    console.log(`找到 ${files.length} 个数据文件`);

    files.forEach(file => {
        const date = parseInt(file.replace('.json', ''));
        const filePath = path.join(dataDir, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            if (Array.isArray(data)) {
                processDailyData(data, date);
            }
        } catch (error) {
            console.error(`处理文件 ${file} 时出错:`, error.message);
        }
    });

    generateStatistics();
}

function processDailyData(dailyData, date) {
    dailyData.forEach(record => {
        const { ip, taskNum, ipVpn, ipBot, ipScore } = record;
        
        if (!ip || taskNum === undefined || ipVpn === undefined || ipBot === undefined || ipScore === undefined) {
            return;
        }

        const currentData = { taskNum, ipVpn, ipBot, ipScore };

        if (ipDataMap.has(ip)) {
            const previousData = ipDataMap.get(ip);
            
            checkAndRecordChange(ip, date, 'ipVpn', previousData.ipVpn, currentData.ipVpn);
            checkAndRecordChange(ip, date, 'ipBot', previousData.ipBot, currentData.ipBot);
            checkAndRecordChange(ip, date, 'ipScore', previousData.ipScore, currentData.ipScore);
            
            ipDataMap.set(ip, currentData);
        } else {
            ipDataMap.set(ip, currentData);
        }

        ipOccurrenceCount.set(ip, (ipOccurrenceCount.get(ip) || 0) + 1);
        
        if (!ipDailyTasks.has(ip)) {
            ipDailyTasks.set(ip, []);
        }
        ipDailyTasks.get(ip).push(taskNum);
    });
}

function checkAndRecordChange(ip, date, field, oldValue, newValue) {
    if (oldValue !== newValue) {
        ipChanges.push({
            ip: ip,
            date: date,
            field: field,
            old: oldValue,
            new: newValue
        });
        
        if (field === 'ipVpn') {
            if (oldValue === 0 && newValue === 1) {
                ipChangeCategories.ipVpn_0_to_1.add(ip);
            } else if (oldValue === 1 && newValue === 0) {
                ipChangeCategories.ipVpn_1_to_0.add(ip);
            }
        } else if (field === 'ipBot') {
            if (oldValue === 0 && newValue === 1) {
                ipChangeCategories.ipBot_0_to_1.add(ip);
            } else if (oldValue === 1 && newValue === 0) {
                ipChangeCategories.ipBot_1_to_0.add(ip);
            }
        } else if (field === 'ipScore') {
            if (newValue > oldValue) {
                ipChangeCategories.ipScore_increase.add(ip);
            } else if (newValue < oldValue) {
                ipChangeCategories.ipScore_decrease.add(ip);
            }
        }
    }
}

function generateStatistics() {
    const ipOccurrenceStats = {};
    const ipChangeCountMap = new Map();
    const changedIps = new Set();

    ipOccurrenceCount.forEach((count, ip) => {
        ipOccurrenceStats[count] = (ipOccurrenceStats[count] || 0) + 1;
    });

    ipChanges.forEach(change => {
        changedIps.add(change.ip);
        ipChangeCountMap.set(change.ip, (ipChangeCountMap.get(change.ip) || 0) + 1);
    });

    const ipChangeFrequencyStats = {};
    ipChangeCountMap.forEach((changeCount, ip) => {
        ipChangeFrequencyStats[changeCount] = (ipChangeFrequencyStats[changeCount] || 0) + 1;
    });

    const transitionStats = {
        ipVpn_0_to_1: 0,
        ipVpn_1_to_0: 0,
        ipBot_0_to_1: 0,
        ipBot_1_to_0: 0,
        ipScore_increase: 0,
        ipScore_decrease: 0
    };

    ipChanges.forEach(change => {
        if (change.field === 'ipVpn') {
            if (change.old === 0 && change.new === 1) {
                transitionStats.ipVpn_0_to_1++;
            } else if (change.old === 1 && change.new === 0) {
                transitionStats.ipVpn_1_to_0++;
            }
        } else if (change.field === 'ipBot') {
            if (change.old === 0 && change.new === 1) {
                transitionStats.ipBot_0_to_1++;
            } else if (change.old === 1 && change.new === 0) {
                transitionStats.ipBot_1_to_0++;
            }
        } else if (change.field === 'ipScore') {
            if (change.new > change.old) {
                transitionStats.ipScore_increase++;
            } else if (change.new < change.old) {
                transitionStats.ipScore_decrease++;
            }
        }
    });

    const totalIps = ipOccurrenceCount.size;
    const unchangedIps = totalIps - changedIps.size;

    const changesFilePath = path.join(outputDir, 'ip_changes.json');
    fs.writeFileSync(changesFilePath, JSON.stringify(ipChanges, null, 2));

    const statsFilePath = path.join(outputDir, 'statistics.json');
    const statistics = {
        totalIps: totalIps,
        totalChangedIps: changedIps.size,
        unchangedIps: unchangedIps,
        ipOccurrenceStats: ipOccurrenceStats,
        ipChangeFrequencyStats: ipChangeFrequencyStats,
        transitionStats: transitionStats
    };
    fs.writeFileSync(statsFilePath, JSON.stringify(statistics, null, 2));

    console.log('\n=== IP总数统计 ===');
    console.log(`总IP数量: ${totalIps}`);
    console.log(`发生变化的IP数量: ${changedIps.size}`);
    console.log(`未发生变化的IP数量: ${unchangedIps}`);

    console.log('\n=== IP出现次数统计 ===');
    const occurrenceAvgTasks = {};
    Object.keys(ipOccurrenceStats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(count => {
        const avgTasks = calculateAverageTasksForOccurrence(parseInt(count));
        occurrenceAvgTasks[count] = avgTasks;
        console.log(`出现 ${count} 次的IP数量: ${ipOccurrenceStats[count]}, ${count}次平均任务数: ${avgTasks.perOccurrence.toFixed(2)}, 60天平均任务数: ${avgTasks.per60Days.toFixed(2)}`);
    });

    console.log(`\n=== IP变化统计 ===`);
    console.log(`总共发生变化的IP数量: ${changedIps.size}`);
    console.log('\n按变化次数分类:');
    Object.keys(ipChangeFrequencyStats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(changeCount => {
        console.log(`变化 ${changeCount} 次的IP数量: ${ipChangeFrequencyStats[changeCount]}`);
    });

    console.log(`\n=== 属性变化统计 ===`);
    console.log(`ipVpn从0到1: ${transitionStats.ipVpn_0_to_1}`);
    console.log(`ipVpn从1到0: ${transitionStats.ipVpn_1_to_0}`);
    console.log(`ipBot从0到1: ${transitionStats.ipBot_0_to_1}`);
    console.log(`ipBot从1到0: ${transitionStats.ipBot_1_to_0}`);
    console.log(`ipScore提升: ${transitionStats.ipScore_increase}`);
    console.log(`ipScore降低: ${transitionStats.ipScore_decrease}`);

    console.log(`\n=== 属性变化按IP出现次数分布 ===`);
    const changeDistribution = calculateChangeDistribution();
    
    const categories = [
        { name: 'ipVpn从0到1', key: 'ipVpn_0_to_1' },
        { name: 'ipVpn从1到0', key: 'ipVpn_1_to_0' },
        { name: 'ipBot从0到1', key: 'ipBot_0_to_1' },
        { name: 'ipBot从1到0', key: 'ipBot_1_to_0' },
        { name: 'ipScore提升', key: 'ipScore_increase' },
        { name: 'ipScore降低', key: 'ipScore_decrease' }
    ];

    categories.forEach(category => {
        console.log(`\n${category.name}:`);
        const distribution = changeDistribution[category.key];
        if (distribution) {
            Object.keys(distribution).sort((a, b) => parseInt(a) - parseInt(b)).forEach(count => {
                console.log(`  出现${count}次的IP: ${distribution[count]}个`);
            });
        }
    });

    console.log(`\n=== 平均每天任务数统计 ===`);
    const overallAvgTasks = calculateOverallAverageDailyTasks();
    console.log(`整体数据中1个IP平均每天参与的任务数: ${overallAvgTasks.toFixed(2)}`);

    console.log(`\n=== 变化IP平均每天任务数统计 ===`);
    const categoryAvgTasks = {
        'ipVpn从0到1': calculateAverageDailyTasks(ipChangeCategories.ipVpn_0_to_1),
        'ipVpn从1到0': calculateAverageDailyTasks(ipChangeCategories.ipVpn_1_to_0),
        'ipBot从0到1': calculateAverageDailyTasks(ipChangeCategories.ipBot_0_to_1),
        'ipBot从1到0': calculateAverageDailyTasks(ipChangeCategories.ipBot_1_to_0),
        'ipScore提升': calculateAverageDailyTasks(ipChangeCategories.ipScore_increase),
        'ipScore降低': calculateAverageDailyTasks(ipChangeCategories.ipScore_decrease)
    };

    Object.keys(categoryAvgTasks).forEach(category => {
        console.log(`${category}的IP平均每天任务数: ${categoryAvgTasks[category].toFixed(2)}`);
    });

    const extendedStatistics = {
        ...statistics,
        overallAverageDailyTasks: overallAvgTasks,
        categoryAverageDailyTasks: categoryAvgTasks,
        occurrenceAverageTasks: occurrenceAvgTasks,
        changeDistribution: changeDistribution
    };
    fs.writeFileSync(statsFilePath, JSON.stringify(extendedStatistics, null, 2));

    console.log(`\n=== 输出文件 ===`);
    console.log(`IP变化记录: ${changesFilePath}`);
    console.log(`统计数据: ${statsFilePath}`);
}

function calculateOverallAverageDailyTasks() {
    if (ipDailyTasks.size === 0) {
        return 0;
    }

    let totalTasks = 0;
    let totalDays = 0;

    ipDailyTasks.forEach((tasks) => {
        totalTasks += tasks.reduce((sum, taskNum) => sum + taskNum, 0);
        totalDays += tasks.length;
    });

    return totalDays > 0 ? totalTasks / totalDays : 0;
}

function calculateChangeDistribution() {
    const distribution = {
        ipVpn_0_to_1: {},
        ipVpn_1_to_0: {},
        ipBot_0_to_1: {},
        ipBot_1_to_0: {},
        ipScore_increase: {},
        ipScore_decrease: {}
    };

    const categoryMapping = {
        'ipVpn_0_to_1': ipChangeCategories.ipVpn_0_to_1,
        'ipVpn_1_to_0': ipChangeCategories.ipVpn_1_to_0,
        'ipBot_0_to_1': ipChangeCategories.ipBot_0_to_1,
        'ipBot_1_to_0': ipChangeCategories.ipBot_1_to_0,
        'ipScore_increase': ipChangeCategories.ipScore_increase,
        'ipScore_decrease': ipChangeCategories.ipScore_decrease
    };

    Object.keys(categoryMapping).forEach(category => {
        const ipSet = categoryMapping[category];
        ipSet.forEach(ip => {
            const occurrenceCount = ipOccurrenceCount.get(ip);
            if (occurrenceCount) {
                distribution[category][occurrenceCount] = (distribution[category][occurrenceCount] || 0) + 1;
            }
        });
    });

    return distribution;
}

function calculateAverageTasksForOccurrence(occurrenceCount) {
    let totalTasks = 0;
    let ipCount = 0;

    ipOccurrenceCount.forEach((count, ip) => {
        if (count === occurrenceCount) {
            if (ipDailyTasks.has(ip)) {
                const tasks = ipDailyTasks.get(ip);
                totalTasks += tasks.reduce((sum, taskNum) => sum + taskNum, 0);
                ipCount++;
            }
        }
    });

    const avgTotalTasksPerIp = ipCount > 0 ? totalTasks / ipCount : 0;
    const perOccurrence = avgTotalTasksPerIp / occurrenceCount;
    const per60Days = avgTotalTasksPerIp / 60;

    return {
        perOccurrence: perOccurrence,
        per60Days: per60Days
    };
}

function calculateAverageDailyTasks(ipSet) {
    if (ipSet.size === 0) {
        return 0;
    }

    let totalTasks = 0;
    let totalDays = 0;

    ipSet.forEach(ip => {
        if (ipDailyTasks.has(ip)) {
            const tasks = ipDailyTasks.get(ip);
            totalTasks += tasks.reduce((sum, taskNum) => sum + taskNum, 0);
            totalDays += tasks.length;
        }
    });

    return totalDays > 0 ? totalTasks / totalDays : 0;
}

console.log(`开始处理数据目录: ${dataDir}`);
console.log(`输出目录: ${outputDir}`);
processFiles();