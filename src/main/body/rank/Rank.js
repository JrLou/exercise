import React, {Component} from 'react';
import less from './Rank.less';
import CityRank from './component/Rank.js';

class page extends Component{
    constructor(props){
        super(props);
        this.state = {};

        this.rankData = [
            {
                index:1,
                cityName:'上海',
                hot:99,
            },
            {
                index:2,
                cityName:'北京',
                hot:96,
            },
            {
                index:3,
                cityName:'广州',
                hot:92,
            },
            {
                index:4,
                cityName:'成都',
                hot:90,
            },
            {
                index:5,
                cityName:'深圳',
                hot:85,
            },
            {
                index:6,
                cityName:'杭州',
                hot:81,
            },
        ];
    }

    componentDidMount() {

    }


    render(){
        return(
            <div className={less.mainPage}>
                <CityRank
                    data={this.rankData}
                />
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;