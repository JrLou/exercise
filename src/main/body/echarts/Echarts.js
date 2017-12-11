import React, {Component} from "react";
import Echarts from "echarts";

import less from "./Echarts.less";

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
            <div className={less.mainPage}>
                <div className={less.wall}>
                    Echarts练习
                </div>
            </div>
        );
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




