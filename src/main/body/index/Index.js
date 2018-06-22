import React, {Component} from "react";

import less from "./Index.less";

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {

        return (
            <div className={less.main}>
                <div className={less.listTitle}>
                    <span>目录：</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/Echarts-gl');
                    }}
                >
                    <span>1.Echarts-gl 练习</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/Hexagon');
                    }}
                >
                    <span>2.DIV模拟六边形</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/Hexagon02');
                    }}
                >
                    <span>3.六边形 自定义组件</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/Echarts-pie');
                    }}
                >
                    <span>4.Echarts-pie 练习</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/Rank');
                    }}
                >
                    <span>5.城市排名 Demo</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/ThreeJS');
                    }}
                >
                    <span>6.ThreeJS练习</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/AntdMobile');
                    }}
                >
                    <span>7.Antd-Mobile练习</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={() => {
                        window.app_open(this, '/Echarts-line');
                    }}
                >
                    <span>7.Echarts-line练习</span>
                </div>
            </div>
        );
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




