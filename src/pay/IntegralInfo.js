import React, {Component} from 'react';
import {Input} from 'antd';
import less from './IntegralInfo.less';

class IntegralInfo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         upData: 0,
      };
   }

   componentDidMount() {
      if (this.props.onPriceChange) {
         this.props.onPriceChange(this.getData().integral.use);
      }
   }

   getData() {
      return this.props.data || {};
   }

   render() {
      let {integral,order} = this.getData();

      if(order.payment===1){
          return null;
      }

      let maxValue =Math.min( Math.floor(integral.point/1000),Math.floor(order.price));
      return (
         <div
            {...this.props}
         >
            <div className={less.integralInfo}>
               <div className={less.integralInfo_right}>
                  <div className={less.integralInfo_top}>积分抵扣</div>
                  <div className={less.integralInfo_middle}>
                     <div className={less.integralInfo_middle_line1}>
                        <span className={less.integralInfo_middle_line1_light}>您目前有{integral.point}积分:</span>
                        <span className={less.integralInfo_middle_line1_heavy}>最低1000积分开始抵扣 </span>
                     </div>
                     <div className={less.integralInfo_middle_line2}>
                        <span className={less.integralInfo_middle_line2_light}>请输入您要抵用的积分:</span>
                        <Input
                           disabled={integral.point == 0 ? true : false}
                           value={integral.use}
                           size="large"
                           onChange={(e) => {
                              let value = +e.target.value;
                              if (Number.isInteger(value)) {
                                 if(value > maxValue){
                                    value = maxValue;
                                 }
                                 integral.use = value;
                                 this.setState({upData: this.state.upData + 1});
                              }
                              if (this.props.onPriceChange) {
                                 this.props.onPriceChange(integral.use);
                              }
                           }}
                           style={{width: "60"}}
                        />

                        <span className={less.integralInfo_middle_line2_msg}>
                           &nbsp;&nbsp;(积分单位: 千 )&nbsp;&nbsp;&nbsp;&nbsp;可抵用<span className={less.integralInfo_middle_line2_msg_price}>{integral.use}</span>元
                        </span>
                     </div>

                  </div>
               </div>

            </div>
         </div>
      );
   }
}

IntegralInfo.contextTypes = {
   router: React.PropTypes.object
};
module.exports = IntegralInfo;