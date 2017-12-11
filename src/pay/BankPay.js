import React, {Component} from 'react';
import less from './Pay.less';
import { Button} from 'antd';
class UnionPay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
        };
    }
    show(loading,callBack){
        this.setState({
            loading
        },callBack);
    }

    render(){
        return (
            <div className={less.nextLayout}>
                <div>
                   银行转账选择......
                </div>
                <Button type="primary"

                        onClick={() => {
                            this.props.back();
                        }}
                >返回</Button>
                <Button type="primary"

                        onClick={() => {

                        }}
                >下一步</Button>
            </div>
        );
    }
}
UnionPay.contextTypes = {
    router: React.PropTypes.object
};
module.exports = UnionPay;