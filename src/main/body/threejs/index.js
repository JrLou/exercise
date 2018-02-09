import React, {Component} from 'react';
import less from './index.less';
class page extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }


    render(){
        return(
            <div>
                <div
                    className={less.itemStyle}
                    onClick={() => {
                        window.app_open(this, '/demo01');
                    }}
                >
                    <span>1.demo01</span>
                </div>
                <div
                    className={less.itemStyle}
                    onClick={() => {
                        window.app_open(this, '/demo02');
                    }}
                >
                    <span>2.demo02</span>
                </div>
                <div
                    className={less.itemStyle}
                    onClick={() => {
                        window.app_open(this, '/demo03');
                    }}
                >
                    <span>3.demo03</span>
                </div>
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;