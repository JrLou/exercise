const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * 需要统计的布尔值字段列表
 */
const BOOLEAN_FIELDS = [
    'is_crawler',
    'mobile',
    'proxy',
    'vpn',
    'tor',
    'active_vpn',
    'active_tor',
    'recent_abuse',
    'bot_status',
    'shared_connection',
    'dynamic_connection',
    'frequent_abuser',
    'high_risk_attacks',
    'security_scanner',
    'trusted_network'
];

/**
 * 需要统计的字符串字段及其可能值
 */
const STRING_FIELDS = {
    'abuse_velocity': ['low', 'medium', 'high', 'none']
};

/**
 * 从记录中提取月份信息
 * @param {Object} record - 记录对象
 * @returns {String} - 月份字符串，格式为 "YYYY-MM"
 */
function extractMonth(record) {
    let timestamp;
    
    // 优先从ipInfo2中获取时间戳（因为以ipInfo2的数据为准）
    if (record.ipInfo2 && record.ipInfo2.timestamp) {
        timestamp = record.ipInfo2.timestamp;
    } else if (record.ipInfo2 && record.ipInfo2.addtime) {
        timestamp = record.ipInfo2.addtime;
    } else if (record.ipInfo2 && record.ipInfo2.date) {
        timestamp = record.ipInfo2.date;
    } else if (record.addtime) {
        timestamp = record.addtime;
    } else if (record.date) {
        timestamp = record.date;
    } else if (record.created_at) {
        timestamp = record.created_at;
    } else if (record.time) {
        timestamp = record.time;
    } else {
        console.warn('无法找到时间戳字段，记录:', Object.keys(record));
        return null;
    }
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        console.warn('无效的时间戳:', timestamp);
        return null;
    }
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * 分析IP质量历史数据，按月统计各字段占比
 * @param {String} filePath - 数据文件路径
 * @returns {Promise<Object>} - 统计结果对象的Promise
 */
async function analyzeMonthlyTrends(filePath) {
    try {
        // 创建可读流
        const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
        
        // 创建readline接口逐行读取
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        
        let recordCount = 0;
        let processedCount = 0;
        
        // 按月份统计的数据结构：Map<月份, Map<字段名, Map<值, 数量>>>
        const monthlyStats = new Map();
        
        // 逐行处理
        for await (const line of rl) {
            if (line.trim()) {
                recordCount++;
                
                try {
                    const record = JSON.parse(line);
                    
                    // 提取月份
                    const month = extractMonth(record);
                    if (!month) {
                        continue;
                    }
                    
                    // 初始化该月份的统计结构
                    if (!monthlyStats.has(month)) {
                        monthlyStats.set(month, new Map());
                    }
                    const monthData = monthlyStats.get(month);
                    
                    // 以ipInfo2的数据为准
                    const ipInfo = record.ipInfo2;
                    if (!ipInfo) {
                        continue;
                    }
                    
                    // 统计布尔值字段
                    for (const field of BOOLEAN_FIELDS) {
                        if (ipInfo[field] !== undefined) {
                            const value = ipInfo[field];
                            const key = `boolean_${field}`;
                            
                            if (!monthData.has(key)) {
                                monthData.set(key, { true: 0, false: 0 });
                            }
                            
                            if (value === true || value === 'true') {
                                monthData.get(key).true++;
                            } else if (value === false || value === 'false') {
                                monthData.get(key).false++;
                            }
                        }
                    }
                    
                    // 统计字符串字段
                    for (const [field, possibleValues] of Object.entries(STRING_FIELDS)) {
                        if (ipInfo[field] !== undefined) {
                            const value = ipInfo[field];
                            const key = `string_${field}`;
                            
                            if (!monthData.has(key)) {
                                monthData.set(key, {});
                                possibleValues.forEach(v => monthData.get(key)[v] = 0);
                            }
                            
                            if (monthData.get(key)[value] !== undefined) {
                                monthData.get(key)[value]++;
                            }
                        }
                    }
                    
                    processedCount++;
                    
                    // 每处理10000条记录输出一次进度
                    if (processedCount % 10000 === 0) {
                        console.log(`已处理 ${processedCount} 条记录...`);
                    }
                } catch (e) {
                    console.warn('解析行失败:', line.substring(0, 100));
                }
            }
        }
        
        console.log(`总共读取了 ${recordCount} 条记录`);
        console.log(`其中 ${processedCount} 条记录成功处理`);
        console.log(`共统计了 ${monthlyStats.size} 个月的数据`);
        
        // 转换为输出格式，计算占比
        const result = {};
        const sortedMonths = Array.from(monthlyStats.keys()).sort();
        
        // 统计所有月份的数据（从开始日期到本月）
        console.log(`统计月份范围: ${sortedMonths[0]} 至 ${sortedMonths[sortedMonths.length - 1]}`);
        
        for (const month of sortedMonths) {
            const monthData = monthlyStats.get(month);
            result[month] = {};
            
            // 处理布尔值字段
            for (const field of BOOLEAN_FIELDS) {
                const key = `boolean_${field}`;
                if (monthData.has(key)) {
                    const stats = monthData.get(key);
                    const total = stats.true + stats.false;
                    
                    if (total > 0) {
                        result[month][field] = {
                            true: {
                                count: stats.true,
                                percentage: ((stats.true / total) * 100).toFixed(2)
                            },
                            false: {
                                count: stats.false,
                                percentage: ((stats.false / total) * 100).toFixed(2)
                            },
                            total: total
                        };
                    }
                }
            }
            
            // 处理字符串字段
            for (const [field, possibleValues] of Object.entries(STRING_FIELDS)) {
                const key = `string_${field}`;
                if (monthData.has(key)) {
                    const stats = monthData.get(key);
                    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
                    
                    if (total > 0) {
                        result[month][field] = {};
                        for (const value of possibleValues) {
                            result[month][field][value] = {
                                count: stats[value],
                                percentage: ((stats[value] / total) * 100).toFixed(2)
                            };
                        }
                        result[month][field].total = total;
                    }
                }
            }
        }
        
        return result;
        
    } catch (error) {
        console.error('分析文件时出错:', error);
        throw error;
    }
}

/**
 * 主函数：执行分析并输出结果
 * @param {String} inputPath - 输入文件路径
 * @param {String} outputPath - 输出文件路径（可选）
 */
async function main(inputPath, outputPath) {
    // 获取命令行参数
    const args = process.argv.slice(2);
    
    // 检查参数
    if (args.length === 0) {
        console.error('错误：请提供输入文件路径');
        console.log('使用方法: node ipQuqlity_trend.js <输入文件路径> [输出文件路径]');
        console.log('示例: node ipQuqlity_trend.js ./ipQualityHistory.txt ./ipQualityTrendStats.json');
        process.exit(1);
    }
    
    // 输入文件路径
    const dataFilePath = args[0];
    
    // 输出文件路径（可选，默认使用原路径）
    const finalOutputPath = args[1] || path.join(__dirname, 'ipQualityTrendStats.json');
    
    // 执行分析
    const result = await analyzeMonthlyTrends(dataFilePath);
    
    // 输出结果
    console.log('\n=== IP质量月度趋势统计结果 ===\n');
    console.log(JSON.stringify(result, null, 2));
    
    // 保存结果到文件
    fs.writeFileSync(finalOutputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\n统计结果已保存到: ${finalOutputPath}`);
    
    // 输出汇总信息
    console.log('\n=== 汇总信息 ===');
    const months = Object.keys(result);
    console.log(`统计月份总数: ${months.length}`);
    console.log(`统计字段总数: ${BOOLEAN_FIELDS.length + Object.keys(STRING_FIELDS).length}`);
}

// 执行主函数
if (require.main === module) {
    main();
}

// 导出函数供其他模块使用
module.exports = {
    analyzeMonthlyTrends
};