import React, {Component} from "react";

import less from "./Echarts.less";

class Echarts extends Component {
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
                Echarts练习
            </div>
        );
    }

}


Echarts.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Echarts;




