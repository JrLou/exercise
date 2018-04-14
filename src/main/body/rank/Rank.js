import React, {Component} from 'react';
import less from './Rank.less';

import SearchBox from '../../component/treeTable/TreeTable.js';


class AdvancedSearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {

        };

    }

    componentDidMount() {

    }


    render(){
        return(
            <div className={less.mainPage}>
                <div className={less.container}>
                    <SearchBox/>
                </div>
            </div>

        );
    }
}

module.exports = AdvancedSearchForm;