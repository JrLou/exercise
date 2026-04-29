const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('使用方法: node deviceIp.js <数据文件目录> [间隔小时数]');
    console.log('示例: node deviceIp.js /path/to/data 6');
    console.log('说明: 数据文件命名格式为 YYYYMMDDHH.json');
    console.log('      间隔小时数用于分类IP切换间隔，默认为6小时');
    process.exit(1);
}

const dataDir = args[0];
const intervalHours = args.length > 1 ? parseInt(args[1]) : 6;

if (isNaN(intervalHours) || intervalHours <= 0) {
    console.error(`错误: 间隔小时数必须是正整数 - ${args[1]}`);
    process.exit(1);
}
const outputDir = path.join(dataDir, 'output');

if (!fs.existsSync(dataDir)) {
    console.error(`错误: 数据目录不存在 - ${dataDir}`);
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const deviceIpMap = new Map();
const ipSet = new Set();

function processFiles() {
    const files = fs.readdirSync(dataDir).filter(file => {
        return file.match(/^\d{10}\.json$/);
    }).sort();

    console.log(`找到 ${files.length} 个数据文件`);

    if (files.length === 0) {
        console.log('警告: 未找到符合命名格式 YYYYMMDDHH.json 的数据文件');
        return;
    }

    files.forEach(file => {
        const dateTime = parseDateTime(file.replace('.json', ''));
        const filePath = path.join(dataDir, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            if (Array.isArray(data)) {
                processHourlyData(data, dateTime);
            }
        } catch (error) {
            console.error(`处理文件 ${file} 时出错:`, error.message);
        }
    });

    generateStatistics();
}

function processHourlyData(hourlyData, dateTime) {
    hourlyData.forEach(record => {
        const { deviceId, ips } = record;
        
        if (!deviceId || !ips || !Array.isArray(ips) || ips.length === 0) {
            return;
        }

        ips.forEach(ipRecord => {
            const { ip } = ipRecord;
            if (!ip) {
                return;
            }
            ipSet.add(ip);
        });

        if (!deviceIpMap.has(deviceId)) {
            deviceIpMap.set(deviceId, {
                ipsWithTime: new Map(),
                totalTask: 0
            });
        }

        const deviceData = deviceIpMap.get(deviceId);
        deviceData.totalTask += record.totalTask || 0;

        ips.forEach(ipRecord => {
            const { ip } = ipRecord;
            if (!deviceData.ipsWithTime.has(ip)) {
                deviceData.ipsWithTime.set(ip, dateTime);
            }
        });
    });
}

function generateStatistics() {
    const totalDevices = deviceIpMap.size;
    const totalIps = ipSet.size;

    const deviceIpCountMap = new Map();
    const deviceSwitchIntervalMap = new Map();

    deviceIpMap.forEach((deviceData, deviceId) => {
        const ipCount = deviceData.ipsWithTime.size;
        deviceIpCountMap.set(deviceId, ipCount);

        if (ipCount > 1) {
            const ipsWithTime = Array.from(deviceData.ipsWithTime.entries()).sort((a, b) => a[1] - b[1]);
            const firstIpTime = ipsWithTime[0][1];
            const lastIpTime = ipsWithTime[ipsWithTime.length - 1][1];
            const timeDiffHours = (lastIpTime - firstIpTime) / (1000 * 60 * 60);
            const switchInterval = timeDiffHours / (ipCount - 1);
            deviceSwitchIntervalMap.set(deviceId, switchInterval);
        }
    });

    const ipCountDistribution = {};
    deviceIpCountMap.forEach((ipCount, deviceId) => {
        ipCountDistribution[ipCount] = (ipCountDistribution[ipCount] || 0) + 1;
    });

    const switchIntervalDistribution = {};

    deviceSwitchIntervalMap.forEach((interval, deviceId) => {
        const intervalKey = getIntervalKey(interval);
        switchIntervalDistribution[intervalKey] = (switchIntervalDistribution[intervalKey] || 0) + 1;
    });

    const deviceDetails = [];
    deviceIpMap.forEach((deviceData, deviceId) => {
        const ipsWithTime = Array.from(deviceData.ipsWithTime.entries()).sort((a, b) => a[1] - b[1]);
        const ipCount = ipsWithTime.length;
        let switchInterval = 0;
        
        if (ipCount > 1) {
            const firstIpTime = ipsWithTime[0][1];
            const lastIpTime = ipsWithTime[ipsWithTime.length - 1][1];
            const timeDiffHours = (lastIpTime - firstIpTime) / (1000 * 60 * 60);
            switchInterval = timeDiffHours / (ipCount - 1);
        }

        deviceDetails.push({
            deviceId: deviceId,
            ipCount: ipCount,
            totalTask: deviceData.totalTask,
            switchInterval: ipCount > 1 ? parseFloat(switchInterval.toFixed(2)) : 0,
            ipsWithTime: ipsWithTime.map(([ip, time]) => ({
                ip: ip,
                firstSeen: formatDateTime(time)
            }))
        });
    });

    const statistics = {
        intervalHours: intervalHours,
        totalDevices: totalDevices,
        totalIps: totalIps,
        ipCountDistribution: ipCountDistribution,
        switchIntervalDistribution: switchIntervalDistribution,
        devicesWithMultipleIps: deviceSwitchIntervalMap.size,
        devicesWithSingleIp: totalDevices - deviceSwitchIntervalMap.size
    };

    const outputFilePath = path.join(outputDir, 'device_ip_statistics.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(statistics, null, 2));

    const detailsFilePath = path.join(outputDir, 'device_ip_details.json');
    fs.writeFileSync(detailsFilePath, JSON.stringify(deviceDetails, null, 2));

    console.log('\n=== 基础统计 ===');
    console.log(`总设备数: ${totalDevices}`);
    console.log(`总IP数: ${totalIps}`);
    console.log(`只有1个IP的设备数: ${statistics.devicesWithSingleIp}`);
    console.log(`有多个IP的设备数: ${statistics.devicesWithMultipleIps}`);

    console.log('\n=== 设备IP数量分布 ===');
    const sortedIpCounts = Object.keys(ipCountDistribution).sort((a, b) => parseInt(a) - parseInt(b));
    sortedIpCounts.forEach(ipCount => {
        console.log(`有 ${ipCount} 个IP的设备数: ${ipCountDistribution[ipCount]}`);
    });

    console.log(`\n=== 设备IP切换间隔分布 (仅统计有多个IP的设备) - 间隔${intervalHours}小时 ===`);
    const sortedIntervals = Object.keys(switchIntervalDistribution).sort((a, b) => {
        const aEnd = getIntervalEnd(a);
        const bEnd = getIntervalEnd(b);
        return aEnd - bEnd;
    });
    sortedIntervals.forEach(intervalKey => {
        console.log(`${intervalKey}小时切换: ${switchIntervalDistribution[intervalKey]} 台设备`);
    });

    console.log(`\n=== 输出文件 ===`);
    console.log(`统计数据: ${outputFilePath}`);
    console.log(`设备详情: ${detailsFilePath}`);
}

function parseDateTime(dateTimeStr) {
    const year = parseInt(dateTimeStr.substring(0, 4));
    const month = parseInt(dateTimeStr.substring(4, 6)) - 1;
    const day = parseInt(dateTimeStr.substring(6, 8));
    const hour = parseInt(dateTimeStr.substring(8, 10));
    return new Date(year, month, day, hour).getTime();
}

function getIntervalKey(interval) {
    const intervalFloor = Math.floor(interval / intervalHours) * intervalHours;
    const intervalCeil = intervalFloor + intervalHours;
    return `${intervalFloor}-${intervalCeil}`;
}

function getIntervalEnd(intervalKey) {
    const parts = intervalKey.split('-');
    return parseInt(parts[1]);
}

function formatDateTime(dateTimeNum) {
    const dateTimeStr = dateTimeNum.toString();
    if (dateTimeStr.length !== 10) {
        return dateTimeStr;
    }
    const year = dateTimeStr.substring(0, 4);
    const month = dateTimeStr.substring(4, 6);
    const day = dateTimeStr.substring(6, 8);
    const hour = dateTimeStr.substring(8, 10);
    return `${year}-${month}-${day} ${hour}:00`;
}

console.log(`开始处理数据目录: ${dataDir}`);
console.log(`输出目录: ${outputDir}`);
console.log(`切换间隔分类: 每${intervalHours}小时`);
processFiles();