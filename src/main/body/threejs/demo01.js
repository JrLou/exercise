import React, {Component} from 'react';
import less from './demo.less';

class page extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }


    render(){
        return(
            <div className={less.mainPage}>
             123
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;