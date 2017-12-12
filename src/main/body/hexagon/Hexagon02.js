import React, {Component} from "react";
import less from './Hexagon02.less';
import Hexagon from './component/Hexagon.js';

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={less.mainPage}>
                <div className={less.hex+' '+ less.hex1}>
                    <div className={less.corner1}></div>
                    <div className={less.corner2}></div>
                </div>

                <div className={less.hex +' '+less.hex2}>
                    <a href="#"></a>
                    <div className={less.corner1}></div>
                    <div className={less.corner2}></div>
                </div>


                <div className={less.hex+' ' +less.hex3}>
                    <a href="#"></a>
                    <div className={less.corner1}></div>
                    <div className={less.corner2}></div>
                </div>


                <div className={less.another}>
                    <Hexagon
                        borderLength={'135px'}
                        borderStyle={'1px solid #ff00ff'}
                        borderRadius={'0%'}
                        imageUrl={'/images/search_empty.png'}
                        imageSize={'90%'}
                    />
                </div>
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;