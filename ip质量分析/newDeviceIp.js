const fs = require('fs');
const path = require('path');

/**
 * 合并数量小于阈值的分类
 * @param {Object} stats - 统计对象
 * @param {string} otherLabel - 其它分类的标签
 * @param {number} threshold - 阈值
 * @returns {Object} 合并后的统计对象
 */
function mergeSmallCategories(stats, otherLabel, threshold) {
  const merged = {};
  let otherCount = 0;

  for (const [key, count] of Object.entries(stats)) {
    if (count >= threshold) {
      merged[key] = count;
    } else {
      otherCount += count;
    }
  }

  if (otherCount > 0) {
    merged[otherLabel] = otherCount;
  }

  return merged;
}

/**
 * 主处理函数
 * @param {string} filePath - 输入文件路径
 */
function analyzeDeviceData(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.error(`错误：文件不存在 - ${absolutePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      console.error('错误：文件内容应为JSON数组格式');
      process.exit(1);
    }

    const romIdStats = {};
    const countryStats = {};
    const scoreStats = {};

    data.forEach(item => {
      const { romId, countryName, score } = item;

      if (romId) {
        romIdStats[romId] = (romIdStats[romId] || 0) + 1;
      }

      if (countryName) {
        countryStats[countryName] = (countryStats[countryName] || 0) + 1;
      }

      if (score !== undefined && score !== null) {
        const scoreNum = parseInt(score, 10);
        if (!isNaN(scoreNum)) {
          if (scoreNum === 100) {
            scoreStats['100'] = (scoreStats['100'] || 0) + 1;
          } else {
            const bucket = Math.floor(scoreNum / 10) * 10;
            const bucketKey = `${bucket}-${bucket + 9}`;
            scoreStats[bucketKey] = (scoreStats[bucketKey] || 0) + 1;
          }
        }
      }
    });

    const mergedRomIdStats = mergeSmallCategories(romIdStats, '其它型号', 100);
    const mergedCountryStats = mergeSmallCategories(countryStats, '其他国家', 100);

    console.log('========== 设备型号数量分布 ==========');
    console.log(JSON.stringify(mergedRomIdStats, null, 2));
    console.log('');

    console.log('========== 设备IP所在地数量分布 ==========');
    console.log(JSON.stringify(mergedCountryStats, null, 2));
    console.log('');

    console.log('========== 设备评分数量分布 ==========');
    console.log(JSON.stringify(scoreStats, null, 2));
    console.log('');

    console.log('========== 统计汇总 ==========');
    console.log(`总设备数: ${data.length}`);
    console.log(`设备型号种类: ${Object.keys(romIdStats).length} (合并后: ${Object.keys(mergedRomIdStats).length})`);
    console.log(`IP所在地种类: ${Object.keys(countryStats).length} (合并后: ${Object.keys(mergedCountryStats).length})`);
    console.log(`评分档位数: ${Object.keys(scoreStats).length}`);

  } catch (error) {
    console.error('处理文件时出错:', error.message);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('使用方法: node newDeviceIp.js <文件路径>');
  console.error('示例: node newDeviceIp.js ./data.json');
  process.exit(1);
}

analyzeDeviceData(args[0]);