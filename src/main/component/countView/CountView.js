import React, {Component} from 'react';
import ReactDom from 'react-dom';
import less from './CountView.less';
import TimeHelp from '../../../tool/TimeHelp.js';

//按需加载 Echarts的组件
//引入 Echarts 主模块
let echarts = require('echarts/lib/echarts');
//线型图
require('echarts/lib/chart/line');
//提示框
require('echarts/lib/component/tooltip');
//图例
require('echarts/lib/component/legend');

class CountView extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        //基础配置
        this.option = {
            tooltip: {
                trigger: 'axis',

            },
            legend: {
                data: ['请求次数', '订单数', '取消订单数', '请求失败次数'],
                selected: this.props.selectConfig,
            },
            calculable: true,
            yAxis:
                {
                    type: 'value'
                },
            xAxis:
                {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
            series: [
                {
                    name: '请求次数',
                    type: 'line',
                    data: []
                },
                {
                    name: '订单数',
                    type: 'line',
                    data: []
                },
                {
                    name: '取消订单数',
                    type: 'line',
                    data: []
                },
                {
                    name: '请求失败次数',
                    type: 'line',
                    data: []
                },
            ]
        };
    }

    componentDidMount() {
        //初始化 echarts 实例
        setTimeout(() => {
            let chartDom = ReactDom.findDOMNode(this.chart);
            this.myChart = echarts.init(chartDom);

            //绑定 点击图例 事件
            this.myChart.on('legendselectchanged', function (params) {
                console.log(params);
            });

            //绘制
            this.paintChart();
        }, 0);
    }

    render() {
        const sourceData = this.props.sourceData;

        return (
            <div className={less.mainBox}>
                <div className={less.saleInfo}>
                    <div className={less.infoItem}>
                        <div className={less.itemTitle}>
                            请求次数
                        </div>
                        <div className={less.itemDetail}>
                            {this.formateNumber(sourceData.requiredNum)}
                        </div>
                    </div>
                    <div className={less.infoItem}>
                        <div className={less.itemTitle}>
                            订单数
                        </div>
                        <div className={less.itemDetail}>
                            {this.formateNumber(sourceData.orderNum)}
                        </div>
                    </div>
                    <div className={less.infoItem}>
                        <div className={less.itemTitle}>
                            转化率
                        </div>
                        <div className={less.itemDetail}>
                            {this.getTransformData(sourceData.orderNum, sourceData.requiredNum)}
                        </div>
                    </div>
                    <div className={less.infoItem}>
                        <div className={less.itemTitle}>
                            取消订单数
                        </div>
                        <div className={less.itemDetail}>
                            {this.formateNumber(sourceData.cancelNum)}
                        </div>
                    </div>
                    <div className={less.infoItem}>
                        <div className={less.itemTitle}>
                            请求失败次数
                        </div>
                        <div className={less.itemDetail}>
                            {this.formateNumber(sourceData.failedNum)}
                        </div>
                    </div>
                </div>
                <div
                    ref={(ref) => {
                        this.chart = ref;
                    }}
                    className={less.countBox}
                >
                    绘制中...
                </div>
            </div>
        );
    }

    //配置数据
    setOption() {
        let option = this.option;
        let newData = this.props.sourceData && this.props.sourceData.data || [];

        //配置图例
        option.legend.selected = this.props.selectConfig;

        //配置线数据
        if (newData && newData.length > 0) {
            //配置X轴
            option.xAxis.data = this.getXAxisConfig(newData.length);

            for (let key in newData) {
                option.series[0].data.push(newData[key].requiredNum);   //请求次数
                option.series[1].data.push(newData[key].orderNum);      //订单数
                option.series[2].data.push(newData[key].cancelNum);     //取消订单数
                option.series[3].data.push(newData[key].failedNum);     //请求失败次数
            }
        }
    }

    //配置X轴
    getXAxisConfig(num){
        let time = this.props.searchConfig.date && this.props.searchConfig.date || [];

        if(!time || time.length<=1){
            return [];
        }

        let startDate = new Date(time[0]);
        let endDate = new Date(time[1]);
        let result = [];

        let section = endDate - startDate;
        if(section<86400000){
            //小于1天，配成小时
            for(let i = 1;i<=num;i++){
                result.push(i);
            }
        }else if(section < 4320000000){
            //小于50天，配成天
            let preDayTemp = startDate.valueOf();
            for(let i = 0;i<num;i++){
                let nextDayTemp = preDayTemp + 86400000;
                result.push(TimeHelp.getLineYMD(nextDayTemp));
            }
        }else{
            //配成月
        }

    }


    //绘制方法
    paintChart() {
        this.option = this.setOption();

        this.myChart.setOption({
            tooltip: {   //提示框
                trigger: 'axis',

            },
            legend: {
                data: ['请求次数', '订单数', '取消订单数', '请求失败次数'],
                selected: this.props.selectConfig,
            },
            calculable: true,
            yAxis:
                {
                    type: 'value'
                }
            ,
            xAxis:
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['2018/05/02', '2018/05/03', '2018/05/04', '2018/05/05', '2018/05/06', '2018/05/07', '2018/05/08']
                }
            ,
            series: [
                {
                    name: '请求次数',
                    type: 'line',
                    stack: '总量1',
                    data: [120, 1320, 10, 1340, 900, 2300, 2100]
                },
                {
                    name: '订单数',
                    type: 'line',
                    stack: '总量2',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '取消订单数',
                    type: 'line',
                    stack: '总量3',
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '请求失败次数',
                    type: 'line',
                    stack: '总量4',
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
            ]
        });
    }

    //数字中插入逗号
    formateNumber(data) {
        if (data === undefined || data === null) {
            return '';
        }

        return data.toLocaleString('en-US');
    }

    //计算两数相除，余6位小数字，取百分比
    getTransformData(value, total) {
        if (value === 0) {
            return '0%';
        }
        if (!value || !total) {
            return '';
        }

        let result = ((value / total) * 100).toFixed(6) + ' %';
        return result;
    }
}

CountView.defaultProps = {
    sourceData: {},
    selectConfig: {},
    searchConfig: {},
};

module.exports = CountView;