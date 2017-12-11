import React, {Component} from 'react';
import less from './UnionPay.less';
import {Button, Row, Input, Form, Icon, message} from 'antd';
import {HttpTool} from "../../lib/utils/index.js";
import Api from './Api.js';
import Item from './Item';
import UnionPayAdd from './UnionPayAdd.js';

class UnionPay extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: true,
         error: "",
         cardList: [],
         selectIndex: 0,
      };
   }

   show(loading, callBack) {
      this.setState({
         loading
      }, callBack);
   }

   setLoading(loading, cb) {
      this.setState({
         loading
      }, cb);
   }

   componentDidMount() {
      if (this.un) {
         return;
      }
      this.refreshList();
   }

   refreshList() {
      this.show(true, () => {
         this.loadUnionPayList({}, (code, msg, data) => {
            if (this.un) {
               return;
            }
            this.setState({
               loading: false,
               error: code > 0 ? "" : msg,
               cardList: data,
            });
         });
      });

   }

   componentWillUnmount() {
      this.un = true;
   }

   loadUnionPayList(param, cb) {
       HttpTool.request(HttpTool.typeEnum.POST, Api.cards, (code, msg, json, option) => {
           cb(code,msg,json);
       }, (code, msg, option) => {
           cb(code,msg, {});
       }, {});
      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 1;
      //    let data = [];
      //    code = 11;
      //    if (code > 0) {
      //       for (let i = 0; i < code; i++) {
      //          data.push({
      //             code: "622***" + i.toString().repeat(4),
      //             type: "信用卡",
      //             icon: "./images/xx.png"
      //          });
      //       }
      //    }
      //    cb(code, code > 0 ? "获取成功" : "暂无卡列表/获取失败", data);
      // }, Math.random() * 1000);


       // /v1.0/card/getInUsedCards
   }

   doUnionPay(param, cb) {
       HttpTool.request(HttpTool.typeEnum.POST, Api.unionPay, (code, msg, json, option) => {
           cb(code,msg,json);
       }, (code, msg, option) => {
           cb(code,msg, {});
       }, param);
      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 5;
      //    let data = {};
      //    // code = 10;
      //    cb(code, code > 0 ? "支付成功" : "支付状态未知", data);
      // }, Math.random() * 1000);
   }


   getLoadingView() {
      return (<div className={less.loading}>

         <div className={less.allCenter} style={{height:"80px"}}>
            <div style={{marginBottom:"20px"}}>
               <span className={less.animationGroup_circle}></span>
               <span className={less.animationGroup_circle}></span>
               <span className={less.animationGroup_circle}></span>
            </div>
            正在为您拉取卡列表,请稍候
         </div>
      </div>);
   }

   getCardList(data) {
      //添加
      data = data.concat([{}]);
      return (
         <div>
            <div>
               {data.map((obj, index) => {
                  let last = data.length === index + 1;

                    let select = this.state.selectIndex === index;
                  return (
                     <Item
                        key={index}
                        select={select}
                        onClick={() => {
                           //选择当前选项
                           if (last) {
                              this.openAddCard();
                              return;
                           }
                           this.setState({
                              selectIndex: index,
                           }, () => {
                           });
                           //清空其他选择
                        }
                        }
                     >
                        <div style={{textAlign: "center"}}>
                           {last ?
                              (
                                 <div className={less.addCardBtn}>
                                    <Icon type="plus"/>&nbsp;添加银行卡
                                 </div>
                              ) : (
                                 <div>
                                    <img className={less.bankLogoImg} src={obj.iconUrl} alt="bank_LOGO"/>
                                    <div>{obj.bankShortName}:&nbsp;&nbsp;{"*******"+obj.cardLastNo}</div>
                                 </div>
                              )
                           }
                        </div>

                     </Item>
                  );
               })}
            </div>
            <InputLayout
                data={this.getSelectData(data[this.state.selectIndex])}
                ref={(ref) => {
               this.inputLayout = ref;
            }}/>
         </div>
      );
   }
   getSelectData(data){
       data.orderId = this.props.orderId;
       data.amount = this.props.data.payPrice;
       data.payment = this.props.data.payment;
       return data;
   }

   openAddCard() {
      //第一步:输入卡号 获取到卡号
      this.unionPayAdd.show(true);
      //第二步:把卡号上传给服务器,获取到开通URL
      //第三步:等待用户开通
   }

   getDefaultView() {
      return (
         <div className={less.loading}>
            <img className={less.nocardImg} src={require("./images/pay_noCard.png")} alt="没有卡列表"/>
            {this.state.error ? <div> {this.state.error||"服务器繁忙^_^"}</div>
            : 
            <div>您尚未添加银行卡</div>
         }
            
            <div>
               <Button
                  style={{height: 60, width: 200, fontSize: 16, marginBottom: 12, marginTop: 15}}
                  type="primary"
                  onClick={() => {
                     this.openAddCard();
                     return;
                  }}
               >
                  <Icon type="plus" style={{fontWeight: "bolder"}}/>添加银行卡
               </Button>
            </div>
            <a
               className={less.backUp}
               onClick={(e) => {
                  e.preventDefault();
                  this.props.back();
               }}
            ><Icon type="left"/>返回上一级</a>
         </div>
      );

   }


   render() {
      let contentView = null;

      let hasCard = this.state.cardList && this.state.cardList.length > 0;
      if (this.state.loading) {
         contentView = this.getLoadingView();
      } else if (hasCard) {
         contentView = this.getCardList(this.state.cardList);
      } else {
         contentView = this.getDefaultView();
      }
      return (
         <div>
            <div className={less.unionPay}>

               <div className={less.unionPay_top}>选择银联卡</div>
               <div className={less.unionPay_middle}>
                  {contentView}
               </div>
            </div>
            <div>
               {
                  hasCard ?
                     <div style={{textAlign: "right"}}>
                        <a
                           onClick={(e) => {
                              e.preventDefault();
                              this.props.back();
                           }}
                        ><Icon type="left"/>返回上一级</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                         <div style={{display:"inline-block"}}>
                             <div>
                                 <span className={less.nextLayout_priceTitle}>需支付：</span>
                                 <span className={less.nextLayout_price}>
                        <span className={less.nextLayout_price_rmb}>¥</span>
                        <span >{this.props.data.payPrice}</span>
                        </span>
                             </div>


                             <p>订单含机票、民航发展基金、燃油费、税费</p>
                             <Button
                                 type="primary"
                                 className={less.payBtn}
                                 onClick={() => {
                                     //第一步:得到银行卡号
                                     if (this.state.selectIndex < 0) {
                                         message.error("请选择银行卡");
                                         return;
                                     }
                                     if (this.state.cardList && this.state.cardList.length > this.state.selectIndex) {
                                         let card = this.state.cardList[this.state.selectIndex];
                                         let data = this.inputLayout.getData();
                                         if (data.error) {
                                             message.error(data.error);
                                             return;
                                         }
                                         data.card = card.code;
                                         console.log(card);

                                         if (this.props.onAction) {
                                             this.props.onAction("unionpay", null, () => {

                                                     this.doUnionPay(data, (code, msg, data) => {
                                                     if (code > 0) {
                                                         //支付已经付,支验证是否支付成功
                                                         this.props.onAction("unionpayver",null,()=>{

                                                         });
                                                     } else {
                                                         this.props.onAction("unionpayerror", msg);

                                                     }
                                                 });

                                             });
                                         }
                                     } else {
                                         message.error("选择银行卡异常");
                                     }

                                     //第二步:得到手机号和验证码
                                     //第三步:调用支付
                                 }}
                             >付款</Button>
                         </div>
                     </div>
                     : null
               }
            </div>
            <UnionPayAdd
                wh={this.props.wh}
                orderId={this.props.orderId}
               onAction={(data) => {
                  //打开开通
                  if (this.props.onAction) {
                     this.props.onAction("unionopen", data,null);
                  }

               }}
               ref={(ref) => {
                  this.unionPayAdd = ref;
               }}/>
         </div>
      );
   }

   onAction(type) {
      if (type === "closeAdd") {
         //关闭当前的添加页面,并刷新列表页面
         this.unionPayAdd.show(false);
         this.refreshList();
      }
   }

}

class InputLayout extends Component {
   constructor(props) {
      super(props);
      this.defaultTime = 60;
      this.state = {
         moblie: "",
         code: "",
         time: 0,
         loading: false,
      };
   }
   // setShowData(data){
   //     this.data = data;
   //     this.setState({
   //         moblie:this.data.phoneNo
   //     });
   // }

   getData() {
       let error = "";
       if(!this.payId){
           error = "请发送验证码到预留手机号";
       }else {
           error = this.state.moblie.length !== 11 ? "请填写正确的手机号" : (this.state.code.length !== 6 ? "请填写正确的验证码" : null);
       }
      return Object.assign(this.getParamData(this.props.data),{
          checkMsg: this.state.code,
          payId:this.payId,
          error: error
      });

   }

   loadPhoneCode(param, cb) {
       HttpTool.request(HttpTool.typeEnum.POST,Api.sms, (code, msg, json, option) => {
           cb(code,msg,json);
       }, (code, msg, option) => {
           cb(code,msg, {});
       }, param);
      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 5;
      //
      //    let data = [];
      //    cb(code, code > 0 ? "获取成功" : "获取失败", data);
      // }, Math.random() * 1000);
   }
    componentWillUnmount() {
        this.un = true;
    }
   autoTime(time) {
      if (time > 0) {
         let diff = time - 1;
         this.setState({
            time: diff
         }, () => {
            setTimeout(() => {
               this.autoTime(diff);
            }, 1000);
         });
      } else {
         if(this.un){
            return;
         }
         this.setState({
            time: 0
         });
      }

   }


   getParamData(data){
       return {
           amount:data.amount,
           cardNo:data.cardNo,
           orderId:data.orderId,
           payment:data.payment,
           phone:data.phoneNo
       };
   }

   render() {

       let data = this.props.data ||{};
       this.state.moblie = data.phoneNo;
      return (
         <div>
            <div style={{lineHeight: "40px"}}>
               <label htmlFor="mobileIpt" className={less.label}>银行卡预留手机号：</label>
               <Input
                  prefixCls="my-ant-input"
                  disabled={true}
                  id="mobileIpt"
                  size="large"
                  defaultValue={this.state.moblie.substring(0,3) + "****" + this.state.moblie.substring(7)}
                  onChange={(e) => {
                     let v = e.target.value;
                     this.setState({
                         moblie:v
                     }, () => {

                     });

                  }}
                  style={{width: 130}}
                  prefix={<Icon type="mobile" style={{fontSize: 13}}/>} placeholder={"请输入银行卡预留手机号"}
               />
            </div>
            <div style={{lineHeight: "40px"}}>
               <label htmlFor="codeIpt" className={less.label}>短信验证码：</label>
               <Input
                  prefixCls="my-ant-input"
                  id="codeIpt"
                  size="large"
                  onChange={(e) => {
                     let v = e.target.value;
                     this.setState({
                        code: v
                     });
                  }}
                  style={{width: 130, marginRight:"15px"}}
                  prefix={<Icon type="key" style={{fontSize: 13}}/>}
                  placeholder={"请输入短信验证码"}
               />
               <Button
                  size={"large"}
                  loading={this.state.loading}
                  type="primary"
                  disabled={this.state.time > 0 || this.state.moblie.length !== 11}
                  onClick={() => {
                     if (this.state.loading || this.state.time > 0) {
                        return;
                     }
                     this.setState({
                        loading: true
                     });
                     //
                     this.loadPhoneCode(this.getParamData(data), (code, msg, data) => {
                        this.setState({
                           loading: false
                        }, () => {
                            if(code>0){
                                this.payId = data.payId;
                                this.autoTime(this.defaultTime);
                                this.setState({getCodeTips: "succ"});
                            }else{
                                this.setState({getCodeTips: msg});
                            }
                        });

                     });
                  }}
               >
                  {(this.state.time > 0 ? ("(" + this.state.time + "s)") : "") + "发送验证码"}

               </Button>
            </div>
            <div className={less.helpBlock + " " + (this.state.getCodeTips === "succ" ?
               less.codeSucc
               :
               (this.state.getCodeTips == undefined || this.state.loading ? less.codeUndefined : less.codeErr))}>
               {this.state.getCodeTips === "succ" ?
                  <span><Icon type="check-circle-o" />&nbsp;验证码发送成功，请注意查收</span>
                  :
                  <span><Icon type="close-circle-o" />&nbsp;验证码发送失败，{this.state.getCodeTips}</span>
               }
            </div>
         </div>
      );
   }
}


UnionPay.contextTypes = {
   router: React.PropTypes.object
};
module.exports = UnionPay;