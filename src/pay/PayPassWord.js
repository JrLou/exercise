import React, {Component} from 'react';
import less from './PayPassWord.less';
import {HttpTool} from "../../lib/utils/index.js";
import {Button, Form, Input, Icon, Spin,message, Modal, Radio} from 'antd';
import Api from './Api.js';
const FormItem = Form.Item;

class PayPassWord extends Component {
   constructor(props) {
      super(props);
      this.state = {
          data:{},
          loading: false,
      };
   }


   show(loading, data,callBack) {
      this.setState({
          loading,
          data,
      }, callBack);
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

      return (
         <Modal
            visible={true}
            title={"为了确定您的身份，请输入验证码"}
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
           <div>
               <InputLayout
                   moblie={this.state.data.phone}
                   ref={(ref) => {
                   this.inputLayout = ref;
               }}/>
                 <Button
                     type="primary"
                     className={less.openCardBtn}
                     onClick={() => {
                         //开始上传
                         let data = this.inputLayout.getData();
                         if (data.error) {
                             message.error(data.error);
                             return;
                         }
                         this.show(false,null,()=>{
                             if (this.props.onAction) {
                                 this.props.onAction(data.moblie,data.code);
                             }
                         });

                     }}
                 >
                    确认付款
                 </Button>
           </div>
         </Modal>
      );
   }

}

class InputLayout extends Component {
    constructor(props) {
        super(props);
        this.defaultTime = 60;
        this.state = {
            moblie:this.props.moblie|| "",
            code: "",
            time: 0,
            loading: false,
        };
    }
    componentWillUnmount() {
        this.un = true;
    }

    getData() {
        return {
            moblie: this.state.moblie,
            code: this.state.code,
            error: this.state.moblie.length !== 11 ? "请填写正确的手机号" : (this.state.code.length !== 6 ? "请填写正确的验证码" : null)
        };

    }

    loadPhoneCode(param, cb) {
        HttpTool.request(HttpTool.typeEnum.POST, Api.code, (code, msg, json, option) => {
            cb(code,msg,json);
        }, (code, msg, option) => {
            cb(code,msg, {});
        }, param);
        // setTimeout(() => {
        //     let code = (Math.random() * 10).toFixed(0) - 5;
        //
        //     let data = [];
        //     cb(code, code > 0 ? "获取成功" : "获取失败", data);
        // }, Math.random() * 1000);
    }

    autoTime(time) {
        if(this.un){
            return;
        }
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

    render() {

        return (
            <div>
                <div className={less.lineOne}>
                    <label htmlFor="mobileIpt" className={less.label}>绑定手机：</label>

                    {this.state.moblie.substring(0,3) + "****" + this.state.moblie.substring(7)}
                </div>
                <div className={less.lineOne}>
                    <label htmlFor="codeIpt" className={less.label}>验证码：</label>
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
                        placeholder={"请输入验证码"}
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
                            this.loadPhoneCode({
                                phone:this.state.moblie,
                            }, (code, msg, data) => {
                                if(code>0){
                                    // message.success(msg);
                                   this.setState({getCodeTips: "succ"});
                                }else{
                                    this.setState({
                                        loading: false,
                                       getCodeTips: msg
                                    });
                                    // message.error(msg);
                                    return;
                                }

                                this.setState({
                                    loading: false
                                }, () => {
                                    let succ = !!code;
                                    if (succ) {
                                        this.autoTime(this.defaultTime);
                                    } else {
                                        // message.error(msg);
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
PayPassWord.contextTypes = {
   router: React.PropTypes.object
};
module.exports = PayPassWord;