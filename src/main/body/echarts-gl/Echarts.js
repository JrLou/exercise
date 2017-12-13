import React, {Component} from "react";
import Echarts from "echarts";
import Echarts_gl from "echarts-gl";

import less from "./Echarts.less";

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        //初始化echarts实例
        setTimeout(()=>{
           this.myChart = Echarts.init(this.wall);
           this.outerWall = this.getOuterWall();
           this.paintChart();
        },0);
    }

    componentWillUnmount() {

    }


    render() {

        return (
            <div className={less.mainPage}>
                <div
                    ref={(wall)=>{this.wall = wall;}}
                    className={less.wall}
                >
                </div>
            </div>
        );
    }


    //绘制球体
    paintChart(){
        this.myChart.setOption(
            {
                globe:{
                    //是否显示地球模型
                    show:true,
                    //半径
                    globeRadius:30,
                    //地球外半径
                    globeOuterRadius:100,
                    //背景
                    environment: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0, color: '#feff18'
                            }, {
                                offset: 0.2, color: '#17ff12'
                            }, {
                                offset: 0.4, color: '#24fff0'
                            }, {
                                offset: 0.6, color: '#ffae0c'
                            }, {
                                offset: 0.8, color: '#ff1cb6'
                            }, {
                                 offset: 1, color: '#ff190a'
                            }
                        ], false),
                    //地球纹理
                    baseTexture:this.outerWall,
                    //着色效果
                    shading:'realistic',
                    //真实感材质配置
                    realisticMaterial:{

                    },
                    //光照
                    light:{
                        main:{
                            color:'#aa00ff',
                            intensity:5,
                            shadow:true,
                            shadowQuality:'ultra',
                            alpha:'-90',
                            beta:'-90',
                        },
                        ambient:{
                            color:"#00ff00",
                            intensity:0.5
                        }

                    },
                    //分帧超采样
                    emporalSuperSampling:{
                       enable:'true',
                    },
                    //视角控制
                    viewControl:{
                        projection:'perspective',
                        autoRotate:'true',
                        autoRotateDirection:'ccw',
                        autoRotateSpeed:30,
                        autoRotateAfterStill:2,
                        damping:1,
                        distance:250,
                        minDistance:150,
                        maxDistance:250,
                        center:[0,0,0],
                        animation:true,
                        animationDurationUpdate:500,
                        animationEasingUpdate:'cubicInOut',
                        targetCoord:[116.46,39.92],
                    },
                    //表面层配置
                    layers:[{
                        show:true,
                        type:'overlay',
                        name:'second',
                        texture:'/images/search_empty.png',
                        shading:'realistic',
                        distance:30,
                    }],
                },
                series:[
                    {
                        type:'lines3D',
                        name:'planeA',
                        coordinateSystem:'globe',
                        ployline:'true',
                        effect:{
                            show:true,
                            period:3,
                            constantSpeed:null,
                            trailWidth:1,
                            trailLength:0.8,
                            trailColor:'#00ffff',
                            trailOpacity:'0.5',
                        },
                        lineStyle:{
                            color:'#00ff17',
                            opacity:'0.7',
                            width:'1',
                        },
                        data:[
                            [
                                [-90,30,10],[120,45,10],
                            ],
                            [
                                [-80,40,10],[165,45,10],
                            ],
                            [
                                [-60,40,10],[135,69,10],
                            ],
                        ],
                        blendMode:'lighter',
                    }
                ]
            }
        );
    }

    //获取表面纹理
    getOuterWall(){
        let canvas = document.createElement('canvas');
        let mapChart = Echarts.init(canvas,null,{
            width:3000,height:2048
        });
        mapChart.setOption({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["a","b","c","d","e","f",'g','h','i']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [50, 50, 50, 50, 50, 50,50,50,50],
            }]
        });

        return mapChart;
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




