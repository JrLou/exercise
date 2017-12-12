import React, {Component} from "react";

import less from "./Index.less";

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
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
                    onClick={()=>{
                        window.app_open(this,'/Echarts');
                    }}
                >
                    <span>Echarts 练习</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={()=>{
                        window.app_open(this,'/Hexagon');
                    }}
                >
                    <span>DIV模拟六边形</span>
                </div>
                <div
                    className={less.listItem}
                    onClick={()=>{
                        window.app_open(this,'/Hexagon02');
                    }}
                >
                    <span>六边形 自定义组件</span>
                </div>
            </div>
        );
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




