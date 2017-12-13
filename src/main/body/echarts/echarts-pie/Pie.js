import React, {Component} from 'react';
import Echarts from 'echarts';
import less from './Pie.less';

class page extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {
        //初始化echarts实例
        setTimeout(()=>{
            this.myChart = Echarts.init(this.wall);
            this.paintChart();
        },0);
    }


    render(){
        return(
            <div className={less.mainPage}>
                <div
                    ref={(wall)=>{this.wall = wall;}}
                    className={less.wall}
                >
                </div>
            </div>
        );
    }

    paintChart(){
        this.myChart.setOption({
            graphic:{
                elements:[
                    {
                        type:'image',
                        style:{
                            image:'/images/search_empty.png',
                            // cursor:'pointer',
                        },
                        left:'280px',
                        top:'295px',
                        cursor:'pointer',
                        z:9
                    }
                ]
            },
            tooltip:{
                show:true,
                trigger:'item',

            },
            legend:{
                tyle:'plain',
                width:500,
                orient:'horizontal',
                align:'auto',
                itemWidth:30,
                itemGap:20,
                left:200,
                bottom:50,
                formatter:'{a|{name}}',
                textStyle:{
                    backgroundColor:'#faff06',
                    width:60,
                    shadowColor:'#FF00ff',
                    rich:{
                        a:{
                            width:60,
                            color:'#ff00ff',
                            backgroundColor:'#31f02f',
                        }
                    },
                },
                data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他'],
            },
            series:[
                {
                    name:'外圈',
                    type:'pie',
                    selectedMode:'single',
                    radius:[130,180],

                    label:{
                        normal:{
                            formatter:[
                                '{a|{b}:}{d|{d} %}',
                            ].join('\n'),
                            show:true,
                            position:'outside',
                            // formatter:'{d} %',
                            fontSize:16,
                            fontWeight:'bold',
                            color:'#ff00ff',
                            rich:{
                                a:{
                                    color:'#0f58ff',
                                },
                                d:{
                                    color:'#f10200',
                                }
                            }
                        }
                    },
                    labelLine:{
                        normal:{
                            show:true,
                            length:30,
                            length2:40,
                            smooth:false,
                            lineStyle:{
                                width:1,
                                type:'solid',
                            }
                        },
                        emphasis:{
                            show:true,
                            length:40,
                            length2:40,
                            smooth:true,
                            lineStyle:{
                                width:2,
                                type:'solid',
                            }
                        },
                    },

                    data:[
                        {value:335, name:'直达'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1048, name:'百度'},
                        {value:251, name:'谷歌'},
                        {value:147, name:'必应'},
                        {value:102, name:'其他'}
                    ]
                }
            ]
        });
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;