import React, {Component} from 'react';
import less from './Rank.less';

class page extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }


    render(){
        const rankData = this.props.rankData?this.props.rankData:[];
        return(
            <div className={less.container}>
                <div className={less.topThree}>
                    第一第二第三
                </div>
                <div className={less.otherCity}>

                </div>
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;