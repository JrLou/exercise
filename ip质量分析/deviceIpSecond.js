const fs = require('fs');
const path = require('path');

/**
 * 将日期字符串转换为时间戳（毫秒）
 * @param {string} dateStr - 日期字符串，格式为 "YYYY-MM-DD HH:mm"
 * @returns {number} - 时间戳（毫秒）
 */
function parseDateToTimestamp(dateStr) {
  return new Date(dateStr).getTime();
}

/**
 * 计算两个时间戳之间的小时差
 * @param {number} startTimestamp - 开始时间戳（毫秒）
 * @param {number} endTimestamp - 结束时间戳（毫秒）
 * @returns {number} - 小时差
 */
function calculateHoursDifference(startTimestamp, endTimestamp) {
  const diffMs = endTimestamp - startTimestamp;
  return diffMs / (1000 * 60 * 60);
}

/**
 * 统计不同ipCount的设备数量
 * @param {Array} devices - 设备数据数组
 * @returns {Object} - 以ipCount为键，设备数量为值的对象
 */
function countDevicesByIpCount(devices) {
  const ipCountMap = {};
  
  for (const device of devices) {
    const ipCount = device.ipCount;
    if (!ipCountMap[ipCount]) {
      ipCountMap[ipCount] = 0;
    }
    ipCountMap[ipCount]++;
  }
  
  return ipCountMap;
}

/**
 * 重新计算ipCount大于1的设备的switchInterval
 * 计算逻辑：(最大的firstSeen时间戳 - 最小的firstSeen时间戳) / (ip个数-1)，结果转换为小时
 * @param {Array} devices - 设备数据数组
 * @returns {Array} - 包含deviceId和重新计算的switchInterval的数组
 */
function recalculateSwitchInterval(devices) {
  const results = [];
  
  for (const device of devices) {
    if (device.ipCount > 1 && device.ipsWithTime && device.ipsWithTime.length > 0) {
      const ipsWithTime = device.ipsWithTime;
      
      let minTimestamp = Infinity;
      let maxTimestamp = -Infinity;
      
      for (const ipInfo of ipsWithTime) {
        const timestamp = parseDateToTimestamp(ipInfo.firstSeen);
        if (timestamp < minTimestamp) {
          minTimestamp = timestamp;
        }
        if (timestamp > maxTimestamp) {
          maxTimestamp = timestamp;
        }
      }
      
      const timeDiffMs = maxTimestamp - minTimestamp;
      const switchInterval = (timeDiffMs / (device.ipCount - 1)) / (1000 * 60 * 60);
      
      results.push({
        deviceId: device.deviceId,
        ipCount: device.ipCount,
        switchInterval: parseFloat(switchInterval.toFixed(2))
      });
    }
  }
  
  return results;
}

/**
 * 将switchInterval按照指定的时间间隔分类统计
 * @param {Array} recalculatedData - 重新计算后的设备数据
 * @param {number} intervalStep - 时间间隔（小时），默认为1
 * @returns {Object} - 以小时区间为键，设备数量为值的对象
 */
function classifySwitchIntervalByHour(recalculatedData, intervalStep = 1) {
  const hourDistribution = {};
  
  for (const item of recalculatedData) {
    const interval = item.switchInterval;
    const lowerBound = Math.floor(interval / intervalStep) * intervalStep;
    const upperBound = lowerBound + intervalStep;
    const rangeKey = `${lowerBound}~${upperBound}`;
    
    if (!hourDistribution[rangeKey]) {
      hourDistribution[rangeKey] = 0;
    }
    hourDistribution[rangeKey]++;
  }
  
  return hourDistribution;
}

/**
 * 主函数：读取数据文件并执行分析
 * @param {string} filePath - 数据文件路径
 * @param {number} intervalStep - 时间间隔（小时），默认为1
 */
function analyzeDeviceIpData(filePath, intervalStep = 1) {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const devices = JSON.parse(fileContent);
    
    console.log('===== IP质量分析报告 =====\n');
    
    console.log('1. 不同ipCount的设备数量统计：');
    const ipCountStats = countDevicesByIpCount(devices);
    const sortedIpCounts = Object.keys(ipCountStats).map(Number).sort((a, b) => a - b);
    for (const ipCount of sortedIpCounts) {
      console.log(`   ipCount = ${ipCount}: ${ipCountStats[ipCount]} 个设备`);
    }
    
    console.log('\n2. 重新计算switchInterval（ipCount > 1的设备）：');
    const recalculatedData = recalculateSwitchInterval(devices);
    if (recalculatedData.length === 0) {
      console.log('   没有ipCount大于1的设备');
    }
    
    console.log(`\n3. switchInterval按${intervalStep}小时间隔分类统计：`);
    const hourDistribution = classifySwitchIntervalByHour(recalculatedData, intervalStep);
    const sortedRanges = Object.keys(hourDistribution).sort((a, b) => {
      const aLower = parseInt(a.split('~')[0]);
      const bLower = parseInt(b.split('~')[0]);
      return aLower - bLower;
    });
    if (sortedRanges.length === 0) {
      console.log('   没有可分类的数据');
    } else {
      for (const range of sortedRanges) {
        console.log(`   ${range} 小时: ${hourDistribution[range]} 个设备`);
      }
    }
    
    console.log('\n===== 分析完成 =====');
    
  } catch (error) {
    console.error('错误:', error.message);
    if (error.code === 'ENOENT') {
      console.error(`文件不存在: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.error('JSON解析错误，请检查文件格式');
    }
    process.exit(1);
  }
}

const filePath = process.argv[2];
const intervalStep = process.argv[3] ? parseFloat(process.argv[3]) : 1;

if (!filePath) {
  console.error('请提供数据文件路径作为参数');
  console.error('用法: node deviceIpSecond.js <数据文件路径> [时间间隔]');
  console.error('  数据文件路径: JSON数据文件的路径');
  console.error('  时间间隔: 可选参数，默认为1小时，例如: 1、2、6、12、24等');
  process.exit(1);
}

if (isNaN(intervalStep) || intervalStep <= 0) {
  console.error('错误: 时间间隔必须是大于0的数字');
  process.exit(1);
}

analyzeDeviceIpData(filePath, intervalStep);