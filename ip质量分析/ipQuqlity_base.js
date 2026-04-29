const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * 比较两个对象，找出发生变化的字段
 * @param {Object} obj1 - 第一个对象
 * @param {Object} obj2 - 第二个对象
 * @returns {Array} - 变化的字段名数组
 */
function findChangedFields(obj1, obj2) {
    const changedFields = [];
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    for (const key of allKeys) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        
        // 跳过request_id字段，因为每次请求都会变化
        if (key === 'request_id') {
            continue;
        }
        
        // 处理数组类型的字段（如abuse_events）
        if (Array.isArray(val1) || Array.isArray(val2)) {
            if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                changedFields.push(key);
            }
            continue;
        }
        
        // 处理对象类型的字段
        if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
            const nestedChanges = findChangedFields(val1, val2);
            if (nestedChanges.length > 0) {
                changedFields.push(key);
            }
            continue;
        }
        
        // 处理基本类型的字段
        if (val1 !== val2) {
            changedFields.push(key);
        }
    }
    
    return changedFields;
}

/**
 * 分析IP质量历史数据，统计分数变化的原因分类
 * @param {String} filePath - 数据文件路径
 * @returns {Promise<Array>} - 统计结果数组的Promise
 */
async function analyzeIpQualityChanges(filePath) {
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
        
        // 统计结果存储：Map结构，key为 "type|changeFiled字符串"，value为数量
        const statsMap = new Map();
        
        // 逐行处理
        for await (const line of rl) {
            if (line.trim()) {
                recordCount++;
                
                try {
                    const record = JSON.parse(line);
                    const { score1, score2, ipInfo1, ipInfo2 } = record;
                    
                    // 判断分数变化类型
                    const type = score2 > score1 ? 'add' : (score2 < score1 ? 'less' : 'same');
                    
                    // 如果分数没有变化，跳过
                    if (type === 'same') {
                        continue;
                    }
                    
                    // 找出变化的字段
                    const changedFields = findChangedFields(ipInfo1, ipInfo2);
                    
                    // 对字段名进行排序，确保相同的字段组合生成相同的key
                    changedFields.sort();
                    
                    // 生成统计key
                    const key = `${type}|${JSON.stringify(changedFields)}`;
                    
                    // 更新统计
                    statsMap.set(key, (statsMap.get(key) || 0) + 1);
                    
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
        console.log(`其中 ${processedCount} 条记录有分数变化`);
        
        // 转换为输出格式
        const result = [];
        for (const [key, total] of statsMap.entries()) {
            const [type, changeFiledStr] = key.split('|');
            const changeFiled = JSON.parse(changeFiledStr);
            
            result.push({
                type: type,
                changeFiled: changeFiled,
                total: total
            });
        }
        
        // 按total降序排序
        result.sort((a, b) => b.total - a.total);
        
        // 过滤掉total小于5的数据（特殊情况，不需要关注）
        const filteredResult = result.filter(item => item.total >= 5);
        console.log(`过滤前有 ${result.length} 个变化原因分类`);
        console.log(`过滤后有 ${filteredResult.length} 个变化原因分类（过滤掉 total < 5 的数据）`);
        
        return filteredResult;
        
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
        console.log('使用方法: node ipQuqlity.js <输入文件路径> [输出文件路径]');
        console.log('示例: node ipQuqlity.js ./ipQualityHistory.txt ./ipQualityChangeStats.json');
        process.exit(1);
    }
    
    // 输入文件路径
    const dataFilePath = args[0];
    
    // 输出文件路径（可选，默认使用原路径）
    const finalOutputPath = args[1] || path.join(__dirname, 'ipQualityChangeStats.json');
    
    // 执行分析
    const result = await analyzeIpQualityChanges(dataFilePath);
    
    // 输出结果
    console.log('\n=== IP质量变化统计结果 ===\n');
    console.log(JSON.stringify(result, null, 2));
    
    // 保存结果到文件
    fs.writeFileSync(finalOutputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\n统计结果已保存到: ${finalOutputPath}`);
    
    // 输出汇总信息
    console.log('\n=== 汇总信息 ===');
    const addTotal = result.filter(r => r.type === 'add').reduce((sum, r) => sum + r.total, 0);
    const lessTotal = result.filter(r => r.type === 'less').reduce((sum, r) => sum + r.total, 0);
    console.log(`分数增加的记录总数: ${addTotal}`);
    console.log(`分数减少的记录总数: ${lessTotal}`);
    console.log(`变化原因分类数: ${result.length}`);
}

// 执行主函数
if (require.main === module) {
    main();
}

// 导出函数供其他模块使用
module.exports = {
    findChangedFields,
    analyzeIpQualityChanges
};