import React, {Component} from 'react';
import less from './PayInfo.less';
import {TimeHelp} from "../../lib/utils/index.js";

class PayInfo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         use: 0,
      };
   }

    /**
     *
     * @param use 单位 / 分
     */
   upDatePrice(use) {
      this.setState({
         use: use*100
      });
   }

   getData() {
      return this.props.data || {};
   }

   render() {
      let data = this.getData();

      let passengersInfo = "";
      if(data.adultCount){
          passengersInfo +=(data.adultCount+"成人");
      }
       if(data.childCount){
           passengersInfo +=("/"+data.childCount+"儿童");
       }

       let showTime = null;
       let preState = "";
       if(data.payment===1){
           preState = "押金";
       }else if(data.payment===0){
           preState ="全款";
       }else if(data.payment===2){
           preState ="尾款";
       }else {
           preState ="押单金额";
       }
       if(data.time){
           showTime = <Time
               onAction={()=>{
                   if(this.props.onAction){
                       this.props.onAction("end");
                   }
               }}
               time={Math.floor(data.time/1000)}/>;
       }else {
           let date = new Date();
           date.setTime(data.expiredTime);
           showTime = TimeHelp.format(date,"yyyy年M月d日");
       }

      return (
         <div
            {...this.props}
         >
            <div className={less.payInfo}>
               <div className={less.payInfo_top}>订单信息</div>
               <div className={less.payInfo_middle}>
                  <div className={less.fr + " " + less.payInfo_middle_priceBox}>
                      {preState}：<span className={less.payInfo_middle_priceBox_rmb}>￥</span>
                     <span className={less.payInfo_middle_priceBox_price}>{data.price}</span>
                     <br/>
                     （请在 <span className={less.payInfo_middle_priceBox_rmb}>{showTime}</span> {data.payment===1?"内":"前"}支付）
                  </div>
                  <div>
                     <p>
                        订单编号：
                        <span className={less.payInfo_middle_msg}>{data.orderNo}</span>
                     </p>
                     <p>
                        订单金额：
                        <span className={less.payInfo_middle_msg}>￥{data.priceAll}</span>
                     </p>
                     <p>
                        乘机人数：
                        <span className={less.payInfo_middle_msg}>{passengersInfo}</span>
                     </p>
                  </div>

               </div>
               <div className={less.payInfo_bottom}>
                  <p>航班价格变动频繁，请尽快完成支付以免耽误出行</p>
               </div>
            </div>
         </div>
      );
   }
}
class Time extends Component{
   constructor(props){
      super(props);
      this.state = {
         time:this.props.time
      };
   }
    componentWillUnmount() {
        this.un = true;
    }
   autoTime(){
      setTimeout(()=>{
          let time = this.state.time -1;
          if(this.un){
             return;
          }
         this.setState({time},()=>{
            if(time<1){
               //通知时间到,不再显示
                if(this.props.onAction){
                   this.props.onAction();
                }
               return;
            }
            this.autoTime();
         });
      },1000);
   }

    componentDidMount() {
        this.autoTime();
    }
   render(){
      let v = this.state.time;
      let hh = Math.floor(v/3600);
      let mm = Math.floor(v%3600/60);
      let ss = v%60;
      let mmm = mm<10?("0"+mm):mm;
      let sss = ss<10?("0"+ss):ss;
      let show =(hh?(hh+":"):"") + mmm+":" +sss;
      return (
          <span>{show}</span>
      );
   }
}

PayInfo.contextTypes = {
   router: React.PropTypes.object
};
module.exports = PayInfo;