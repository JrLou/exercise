import React, {Component} from 'react';
import CountView from '../../../component/countView/CountView.js';

class page extends Component{
    constructor(props){
        super(props);
        this.state = {};

        //模拟数据
        this.sourceData = {
            requiredNum:10172366,
            orderNum:4324,
            cancelNum:2356,
            failedNum:63156,
            data:[
                {
                    requiredNum:1017236,
                    orderNum:434,
                    cancelNum:236,
                    failedNum:6316,
                },
                {
                    requiredNum:101234,
                    orderNum:634,
                    cancelNum:336,
                    failedNum:316,
                },
                {
                    requiredNum:1012234,
                    orderNum:6324,
                    cancelNum:3236,
                    failedNum:3126,
                },
                {
                    requiredNum:712234,
                    orderNum:1324,
                    cancelNum:2236,
                    failedNum:7126,
                },
                {
                    requiredNum:212234,
                    orderNum:2324,
                    cancelNum:1236,
                    failedNum:2126,
                },
            ]
        };

        this.selectConfig = {
            '请求次数':false,
            '订单数':true,
            '取消订单数':true,
            '请求失败次数':true,
        };

        this.searchConfig = {
            date:['2018/06/11','2018/06/16'],
        };
    }

    render(){
        return(
            <div>
                <CountView
                    sourceData = {this.sourceData}
                    selectConfig = {this.selectConfig}
                    searchConfig = {this.searchConfig}
                />
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;