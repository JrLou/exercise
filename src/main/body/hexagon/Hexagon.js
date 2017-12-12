import React, {Component} from "react";
import less from './Hexagon.less';

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={less.mainPage}>
                <div className={less.box}>
                    <div className={less.lineF}>
                        <div className={less.boxF}>
                            <div className={less.boxS}>
                                <div
                                    className={less.boxT}
                                    style={{backgroundImage:`url('images/fanli.jpg')`}}
                                >
                                    <div className={less.overlay}>
                                        <a href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={less.boxF}>
                            <div className={less.boxS}>
                                <div
                                    className={less.boxT}
                                    style={{backgroundImage:`url('images/fanli.jpg')`}}
                                    >
                                    <div className={less.overlay}>
                                        <a href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={less.boxF}>
                            <div className={less.boxS}>
                                <div
                                    className={less.boxT}
                                    style={{backgroundImage:`url('images/fanli.jpg')`}}
                                >
                                    <div className={less.overlay}>
                                        <a href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={less.lineS}>
                        <div className={less.boxF}>
                            <div className={less.boxS}>
                                <div
                                    className={less.boxT}
                                    style={{backgroundImage:`url('images/fanli.jpg')`}}
                                >
                                    <div className={less.overlay}>
                                        <a href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={less.boxF}>
                            <div className={less.boxS}>
                                <div
                                    className={less.boxT}
                                    style={{backgroundImage:`url('images/fanli.jpg')`}}
                                >
                                    <div className={less.overlay}>
                                        <a href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;