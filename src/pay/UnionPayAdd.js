import React, {Component} from 'react';
import less from './UnionPayAdd.less';
import {HttpTool} from "../../lib/utils/index.js";
import Api from  './Api.js';
import {Button, Form, Input, Icon, Spin, Modal, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UnionPayAdd extends Component {
   constructor(props) {
      super(props);
      this.defaultState = {
         loading: false,
         upLoad: false,
         value: 0,
         inputValue: "",
      };
       this.wh = this.props.wh;
      this.state = this.defaultState;
      this.showError();
   }


   show(loading, callBack) {
      this.showError();
      let s = Object.assign(this.defaultState);
      s.loading = loading;
      this.setState(s, callBack);
   }

   showError(msg) {
      if (msg) {
         this.validateStatus = "error";
         this.help = msg;
      } else {
         this.validateStatus = "";
         this.help = "";
      }

   }

   render() {
      if (!this.state.loading) {
         return null;
      }
      const formItemLayout = {
         labelCol: {
            xs: {span: 24},
            sm: {span: 5},
         },
         wrapperCol: {
            xs: {span: 24},
            sm: {span: 12},
         },
      };

      let rg = ["储蓄卡", "信用卡"];


      return (
         <Modal
            visible={true}
            title={"添加银联卡"}
            style={{
               position: "absolute",
               margin: "auto",
               top: 0,
               bottom: 0,
               right: 0,
               left: 0,
               height: 220
            }}
            width={400}
            confirmLoading={false}
            footer={null}
            onCancel={() => {
               this.show(false);
            }}
         >
            <Spin spinning={this.state.upLoad}>
               <div className={less.modalContent}>
                  <RadioGroup onChange={(e) => {
                     console.log(e.target.value);
                     this.setState({
                        value: e.target.value,
                     });
                  }} value={this.state.value}>
                     {
                        rg.map((v, i) => {
                           return <Radio className={less.radioItem} key={i} value={i}>{v}</Radio>;
                        })
                     }
                  </RadioGroup>
                  <FormItem
                     className={less.cardNumForm}
                     {...formItemLayout}
                     label={rg[this.state.value] + "号"}
                     validateStatus={this.validateStatus}
                     help={this.help}
                  >
                     <Input
                        prefixCls="my-ant-input"
                        size={"large"}
                        style={{width: "240px"}}
                        className={less.cardNumIpt}
                        onChange={(e) => {
                           let v = e.target.value;
                           if (v) {
                              if (/^[0-9]{1,30}$/.test(v)) {
                                 //成功
                                 this.showError();
                              } else {
                                 this.showError("请输入正确的卡号");
                              }
                           } else {
                              this.showError("请输入卡号");
                           }
                           this.setState({
                              inputValue: v
                           });
                        }}
                        prefix={<Icon type="credit-card" style={{fontSize: 13}}/>}
                        placeholder={"请输入" + rg[this.state.value] + "卡号"}/>
                  </FormItem>
                  <div>
                     <Icon type={"info-circle"} style={{color: "#f6994a"}}/> 支持百家全国及地方银行
                  </div>
                  <div style={{textAlign: "left"}}>

                     <Button
                        disabled={this.validateStatus === "error" || !this.state.inputValue}
                        type="primary"
                        className={less.openCardBtn}
                        onClick={() => {
                           //开始上传
                           this.setState({
                              upLoad: true
                           }, () => {
                              //打开
                              this.wh.openInitWindow();
                               let cardNo = this.state.inputValue;
                              this.loadUnionPayAdd({cardNo: cardNo}, (code, msg, data) => {
                                 this.showError(code > 0 ? null : msg);
                                 if(code>0){
                                    //去开卡
                                     if(!data){
                                         this.loadUnionPayOpen({
                                             cardNo: this.state.inputValue,
                                             frontUrl:window.location.origin+"/html/paysuccess.html",
                                             orderId:this.props.orderId,
                                         },(code, msg, data)=>{

                                            if(code>0){
                                                this.setState({
                                                   upLoad: false
                                                }, () => {
                                                    //打开开通

                                                    if (this.props.onAction) {
                                                        this.props.onAction({
                                                            url:"/apin"+Api.opencard+data.id,
                                                            cardNo:cardNo
                                                        });
                                                    }
                                                });
                                            }else{
                                               if(code===-400){
                                                  //银行卡号错误
                                                   this.wh.closeWindow();
                                                   this.showError("请输入正确的银行卡号");
                                                   this.setState({upLoad:false});
                                               }
                                            }
                                         });
                                     }else{
                                         this.wh.closeWindow();
                                         this.showError("您已开通此卡");
                                         this.setState({
                                             upLoad: false
                                         });

                                     }
                                 }else{
                                     this.wh.closeWindow();
                                     this.showError(msg);
                                     this.setState({
                                         upLoad: false
                                     });
                                 }

                              });
                           });

                        }}
                     >
                        立即开通
                     </Button>

                  </div>
               </div>
            </Spin>
         </Modal>
      );
   }
    loadUnionPayOpen(param, cb) {
        HttpTool.request(HttpTool.typeEnum.POST, Api.openCardFrontToken, (code, msg, json, option) => {
            cb(code,msg,json);
        }, (code, msg, option) => {
            cb(code,msg, {});
        }, param);

    }
   loadUnionPayAdd(param, cb) {
       HttpTool.request(HttpTool.typeEnum.POST, Api.isOpen, (code, msg, json, option) => {
           cb(code,msg,json);
       }, (code, msg, option) => {
           cb(code,msg, {});
       }, param);

      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 1;
      //    let data = {
      //       url: "http://taobao.com"
      //    };
      //    cb(code, code > 0 ? "获取成功" : "卡号已存在", data);
      // }, Math.random() * 1000);
   }
}

UnionPayAdd.contextTypes = {
   router: React.PropTypes.object
};
module.exports = UnionPayAdd;