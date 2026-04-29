
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * 统计指定评分范围内的IP按国家分类的数量，以及每个国家的总IP数量
 * @param {String} filePath - 数据文件路径
 * @param {Number} minScore - 最小评分（包含）
 * @param {Number} maxScore - 最大评分（包含）
 * @returns {Promise<Object>} - 统计结果对象，key为国家名，value为对象{total: 总IP数量, matched: 评分范围内的IP数量}
 */
async function countIpsByCountryInRange(filePath, minScore, maxScore) {
    try {
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            throw new Error(`文件不存在: ${filePath}`);
        }

        // 创建可读流
        const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
        
        // 创建readline接口逐行读取
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        
        let recordCount = 0;
        let matchedCount = 0;
        
        // 统计结果存储：Map结构，key为国家名，value为对象{total: 总IP数量, matched: 评分范围内的IP数量}
        const countryStats = new Map();
        
        // 逐行处理
        for await (const line of rl) {
            if (line.trim()) {
                recordCount++;
                
                try {
                    const record = JSON.parse(line);
                    const { score, location } = record;
                    
                    // 获取国家名称
                    const countryName = location?.countryName || '未知国家';
                    
                    // 获取或初始化该国家的统计数据
                    const stats = countryStats.get(countryName) || { total: 0, matched: 0 };
                    
                    // 更新总IP数量
                    stats.total++;
                    
                    // 检查评分是否在指定范围内
                    if (score >= minScore && score <= maxScore) {
                        matchedCount++;
                        // 更新匹配数量
                        stats.matched++;
                    }
                    
                    // 保存更新后的统计数据
                    countryStats.set(countryName, stats);
                    
                    // 每处理10000条记录输出一次进度
                    if (recordCount % 10000 === 0) {
                        console.log(`已处理 ${recordCount} 条记录，匹配 ${matchedCount} 条...`);
                    }
                } catch (e) {
                    console.warn('解析行失败:', line.substring(0, 100));
                }
            }
        }
        
        console.log(`总共读取了 ${recordCount} 条记录`);
        console.log(`其中 ${matchedCount} 条记录的评分在 ${minScore}-${maxScore} 范围内`);
        
        // 转换为输出格式
        const result = {};
        countryStats.forEach((stats, countryName) => {
            result[countryName] = stats;
        });
        
        return result;
        
    } catch (error) {
        console.error('分析文件时出错:', error);
        throw error;
    }
}

/**
 * 主函数：执行统计并输出结果
 * @param {String} filePath - 输入文件路径
 * @param {Number} minScore - 最小评分
 * @param {Number} maxScore - 最大评分
 * @param {String} outputPath - 输出文件路径（可选）
 */
async function main(filePath, minScore, maxScore, outputPath) {
    // 获取命令行参数
    const args = process.argv.slice(2);
    
    // 检查参数数量
    if (args.length < 3) {
        console.error('错误：参数不足');
        console.log('使用方法: node ip_country.js <文件路径> <最小评分> <最大评分> [输出文件路径]');
        console.log('示例: node ip_country.js ./data.txt 80 100 ./country_stats.json');
        process.exit(1);
    }
    
    // 解析参数
    const dataFilePath = args[0];
    const minScoreParam = parseInt(args[1]);
    const maxScoreParam = parseInt(args[2]);
    const finalOutputPath = args[3] || path.join(__dirname, 'country_stats.json');
    
    // 验证评分参数
    if (isNaN(minScoreParam) || isNaN(maxScoreParam)) {
        console.error('错误：评分参数必须是数字');
        process.exit(1);
    }
    
    if (minScoreParam > maxScoreParam) {
        console.error('错误：最小评分不能大于最大评分');
        process.exit(1);
    }
    
    console.log(`开始处理文件: ${dataFilePath}`);
    console.log(`评分范围: ${minScoreParam} - ${maxScoreParam}`);
    
    // 执行统计
    const result = await countIpsByCountryInRange(dataFilePath, minScoreParam, maxScoreParam);
    
    // 输出结果
    console.log('\n=== IP按国家分类统计结果 ===\n');
    console.log(JSON.stringify(result, null, 2));
    
    // 保存结果到文件
    fs.writeFileSync(finalOutputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\n统计结果已保存到: ${finalOutputPath}`);
    
    // 输出汇总信息
    console.log('\n=== 汇总信息 ===');
    const countryCount = Object.keys(result).length;
    const totalIps = Object.values(result).reduce((sum, stats) => sum + stats.matched, 0);
    console.log(`评分为80-99的IP总数: ${totalIps}`);
    
    // 按数量降序排序显示前20个国家
    console.log('\n=== IP数量最多的前20个国家 ===');
    const sortedCountries = Object.entries(result)
        .sort((a, b) => b[1].matched - a[1].matched)
        .slice(0, 20);
    
    sortedCountries.forEach(([country, stats], index) => {
        const { matched, total } = stats;
        const globalPercentage = ((matched / totalIps) * 100).toFixed(2);
        const countryPercentage = ((matched / total) * 100).toFixed(2);
        console.log(`${index + 1}. ${country}: ${matched} (${globalPercentage}%) [占该国总IP: ${countryPercentage}%]`);
    });
}

// 执行主函数
if (require.main === module) {
    main();
}

// 导出函数供其他模块使用
module.exports = {
    countIpsByCountryInRange
};