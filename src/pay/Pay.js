import React, {Component} from 'react';

import {Button, message} from 'antd';
import {HttpTool,CookieHelp} from "../../lib/utils/index.js";

import PayInfo from './PayInfo';
import WindowHelp from './WindowHelp.js';
import Api from './Api.js';
import Panel from './Panel';
import WXPay from './WXPay';
import UnionPay from './UnionPay';
import BankPay from './BankPay';
import IntegralInfo from './IntegralInfo';
import PaySelectLayout from './PaySelectLayout';
import PayPassWord from './PayPassWord';

//获取模拟数据
import less from './Pay.less';

class page extends Component {
    constructor(props) {
        super(props);
        // CookieHelp.saveUserInfo({
        //     Authorization:"eyJ1c2VySWQiOiIyMjIiLCJ1c2VyTmFtZSI6ImFkZCJ9",
        // });
        this.wh = new WindowHelp();
        this.state = {
            step: 1,
            loading: true,
        };
        // ?data={"id":1}
        //  this.data = {pay:{},integral:{},order:{}};
        this.par = window.app_getPar(this);
        console.log(this.par);
        this.id = this.par ? this.par.id : null;



    }

    componentDidMount() {
        if (this.un) {
            return;
        }
        this.refresh();

    }

    componentWillUnmount() {
        this.un = true;
    }

    refresh() {
        this.show(true, () => {
            this.loadPayInfo({
                orderId: this.id
            }, (code, msg, data) => {
                if (this.un) {
                    return;
                }
                if(data&&data.error){
                    msg = data.error;
                    code = -9999;
                }
                this.data = data;
                this.setState({
                    loading: false,
                    error: code > 0 ? "" : msg,
                    code:code,
                });
            });
        });

    }

    show(loading, callBack) {
        this.setState({
            loading
        }, callBack);
    }
    openOrder(){
        window.app_open(this, "/OrderFormDetail", {
            id: this.id
        }, "self");
    }
    getLoadingView() {
        return (<div className={less.loading}>
           <div className={less.allCenter} style={{height:"80px"}}>
               <div style={{marginBottom:"20px"}}>
                   <span className={less.animationGroup_circle}></span>
                   <span className={less.animationGroup_circle}></span>
                   <span className={less.animationGroup_circle}></span>
               </div>
               正在为您拉取订单信息,请稍候
           </div>
        </div>);
    }

    getDefaultView() {
       let go2Order = (
          <Button
             className={less.modalBtn}
             style={{marginTop:"10px"}}
             type="primary"
             onClick={()=>{
                this.openOrder();
             }}>查看订单</Button>
       );
        return (
            <div className={less.loading} style={{height:"600px"}}>
               <div className={less.allCenter2}>
                   <img src={require("../../src/images/search_empty.png")} alt="空"/>
                {this.state.error  ? <div> {this.state.error}</div> : null}
                <div>{go2Order}</div>
               </div>
            </div>
        );

    }

    render() {
        let contentView = null;
        if (this.state.loading) {
            contentView = this.getLoadingView();
        } else if (this.state.error) {
            contentView = this.getDefaultView();
        } else {
            console.log("==");
            let headView = (
                <PayInfo
                    data={this.data.order}
                    onAction={(type)=>{
                        //订单时间结束,
                        if(type==="end"){
                            // this.setState({
                            //     error:"订单超时"
                            // });
                            //1:关闭所有的交易弹窗口
                            //2:显示错误的提示
                            //停止自动验证
                            this.handVerState = true;
                            //关闭如果打开的窗口
                            this.wh.closeWindow();
                            //如果输入密码在显示
                            // this.payPassWord.show(false);
                            this.panel.show(true, {
                                okText: "我知道了",
                                action:"order",
                                content:this.getConnectUsLink("no","抱歉,由于支付超时,该订单将被关闭.您可重新下单."),
                                // title: "支付信息",
                                showType: "warn"

                            });
                        }
                    }}
                    ref={(ref) => {
                        this.payInfo = ref;
                    }}
                />
            );
            let stepView = null;
            if (this.state.step === 1) {
                stepView = this.getFirstStep();
            } else {
                let Com = this.getSecondStep();
                stepView = <Com
                    wh={this.wh}
                    ref={(ref) => {
                        this.stepAction = ref;
                    }
                    }
                    orderId = {this.id}
                    data={this.data.order||{}}
                    onAction={(type, data, callBack) => {
                        //打开
                        if (type === "unionopen") {
                            //打开开通银联

                            this.cardNo = data.cardNo;
                            this.openUnionPayAdd(data,this.wh.getPanel());
                        } else if (type === "unionpay") {
                            //打开银联支付
                            this.openPayIng(callBack);

                        } else if (type === "unionpaysuccess") {
                            //打开银联支付
                            this.openPaySuccess(callBack);

                        } else if (type === "unionpayver") {
                            //打开银联支付
                            //开始支付 10 秒 轮询支付
                            // let diffTime = new Date().getTime();
                            // if ((new Date().getTime() - diffTime) / 1000 > 10){
                            //
                            // }
                            this.handVerState = false;
                            this.autoVer(null,"pay");
                            setTimeout(()=>{
                                //支付成功,不再验证
                                if( this.payState){
                                    return;
                                }
                                //支付时间到
                                this.handVer("pay", "ok");
                            },1000*10);


                        }else if (type === "unionpayerror") {
                            //打开银联支付
                            this.openPayError(data, callBack);

                        }


                    }
                    }
                    back={() => {
                        this.setStep(1);
                    }
                    }/>;


            }
            contentView = (
                <div>
                    {headView}
                    {stepView}
                    <Panel
                        onAction={(action, showType) => {

                            if (showType === "paying") {
                                //验证是否支付
                                this.handVer("pay", action);
                            } else if (showType === "unioning") {
                                //验证是否开通
                                this.handVer("union",action);
                            }
                            else if (action ==="order" ||action === "ok" && showType === "success") {
                                //打开订单页
                                this.openOrder();
                            }

                        }}
                        ref={(ref) => {
                            this.panel = ref;
                        }}/>
                    <PayPassWord
                        onAction={(phone,code) => {
                            //调用积分支付//完全用积分支付
                            this.openPayIng(() => {
                                this.loadPayIntegral({
                                    phone:phone,
                                    code: code
                                }, (code, msg, data) => {
                                    if (code > 0) {
                                        //
                                        this.openPaySuccess();
                                    } else {
                                        this.openPayError(msg, null);
                                    }
                                });
                            });

                        }}
                        ref={(ref) => {
                            this.payPassWord = ref;
                        }}/>
                    <WXPay
                        ref={(ref) => {
                            this.wxPay = ref;
                        }}/>
                </div>
            );
        }
        return (
            <div className={less.content}>
                {contentView}
            </div>
        );
    }


    getFirstStep() {
        return (
            <div>
                <PaySelectLayout
                    defaultshowMore={this.data.pay.defaultshowMore}
                    defaultIndex={this.data.pay.defaultIndex}
                    data={this.data.pay}
                />
                <IntegralInfo
                    data={this.data}
                    onPriceChange={(use) => {
                        if (this.refMoney) {
                            this.refMoney.upDatePrice(use);
                        }

                    }}
                />

                <div className={less.nextLayout}>
                    <div>
                        <span className={less.nextLayout_priceTitle}>需支付：</span>
                        <span className={less.nextLayout_price}>
                        <span className={less.nextLayout_price_rmb}>¥</span>
                      <Money
                          use={this.data.integral.use}
                          ref={(ref) => {
                              this.refMoney = ref;
                          }}
                          data={this.data.order}
                      />
                        </span>
                    </div>


                    <p>订单含机票、民航发展基金、燃油费、税费</p>
                    <Button type="primary"
                            className={less.nextLayout_btn}
                            onClick={() => {
                                //1:如果是在线支付,进入银联支付
                                //2:如果是银行转账,进入银行转账
                                //3:如果是支付宝/微信支付,进入支付
                                console.log(this.data);
                                if (this.data.order.payPrice <= 0) {
                                    //提示输入密码,积分支付
                                    this.payPassWord.show(true,this.data.order);
                                    return;
                                }

                                let downIng = (fun) => {
                                    this.openPayIng(() => {
                                        this.loadPayIntegral({}, (code, msg, data) => {
                                            if (code > 0) {
                                                this.panel.show(false, {}, () => {
                                                    this.data.order.payPrice = data.price;
                                                    fun();
                                                });
                                            } else {
                                                this.openPayError(msg, null, "下单");
                                            }
                                        });
                                    }, "下单");
                                };
                                switch (this.data.pay.type) {
                                    case "ali"://
                                    case "wechat"://
                                        this.openPay(this.data.pay.type);
                                        break;
                                    case "online":
                                        //
                                        downIng(() => {
                                            this.setStep(2);
                                        });

                                        break;
                                    case "bank":
                                        //打开新页面
                                        downIng(() => {
                                            window.app_open(this, "/Upload", {
                                                orderId: this.id,
                                                price: this.data.order.payPrice,
                                                payment: this.data.order.payment
                                            }, "self");
                                        });

                                        break;
                                }

                            }}
                    >下一步</Button>
                </div>
            </div>
        );
    }

    getSecondStep() {
        switch (this.data.pay.type) {
            case "bank":
                return BankPay;
            default:
                return UnionPay;
        }

    }

    setStep(step) {
        this.setState({
            step
        });
    }

    openPayIng(callBack, title = "支付") {
        this.panel.show(true, {
            content: "正在" + title + "....",
            // title: "支付信息",
            showType: "loading"

        }, callBack);
    }

    openPaySuccess(callBack, title = "支付") {
        this.panel.show(true, {
            content: title + "成功",
            // title: "支付信息",
            showType: "success"

        }, callBack);
    }

    openPayError(msg, callBack, title = "支付") {
        this.panel.show(true, {
            okText: "我知道了",
            content: msg,
            // title: "支付信息",
            showType: "error"

        }, callBack);
    }

    openUnionPayAdd(data,apinPanel) {
        if(!apinPanel){
            this.panel.show(true, {
                content: "窗口打开错误",
                // title: "银联开通",
                showType: "error"

            });
            return;
        }
        this.panel.show(true, {
            okText: "我已开通",
            cancelText: "还未开通，重新开通",
            content: "确认是否已开通",
            // title: "银联开通",
            showType: "unioning"

        }, () => {
            //3秒后去开始验证,是否支付成功
            this.handVerState = false;
            setTimeout(()=>{
                this.autoVer(apinPanel,"union",{cardNo:data.cardNo});},1000);
            this.wh.openWindow(apinPanel, data.url);
        });

    }

    openPay(showType) {

        this.openPayIng(() => {
            let apinPanel = this.wh.openInitWindow(showType === "wechat" ? this.wxPay : null);

            //支付前校验积分
            this.loadPayIntegral({}, (code, msg, data) => {
                if (code > 0&&data.flag) {
                    //微信支付宝支付
                    this.data.pay.payPrice = data.price;
                    this.loadPayOrder({
                        orderId:this.id,
                        amount:this.data.pay.payPrice,
                        payment:this.data.order.payment,
                        url: window.location.origin+"/html/paysuccess.html",
                        payType:showType === "wechat"?2:1,//	1支付宝 2 微信
                    }, (code, msg, data) => {
                        if (code > 0) {
                            //3秒后去开始验证,是否支付成功
                            this.handVerState = false;
                            setTimeout(()=>{
                                this.autoVer(apinPanel,"pay");
                            },1000);
                            this.panel.show(true, {
                                okText: "我已支付",
                                cancelText: "还未支付，重新支付",
                                content: "确认是否已支付",
                                // title: "支付信息",
                                showType: "paying"
                            }, () => {
                                this.wh.openWindow(apinPanel, showType === "wechat" ? {
                                    url:data.url,
                                    price:this.data.pay.payPrice

                                }: "/apin"+Api.alipaypay+data.url);
                            });
                        } else {
                            this.wh.closeWindow(apinPanel);
                            this.panel.show(true, {
                                // okText: "我知道了",
                                content: msg,
                                // title: "支付信息",
                                showType: "error"
                            }, () => {


                            });
                        }
                    });
                } else {
                    this.wh.closeWindow(apinPanel);
                    this.openPayError(msg, null, "下单");
                }
            });

        }, "下单");
    }

    showSuccess(type){
        //支付成功
        //关闭支付窗口
        this.handVerState = true;
        this.wh.closeWindow();
        if (type === "pay") {
            this.payState = true;
            //支付成功/提示支付成功/通知用户去订单详情
            this.panel.show(true, {
                content: "支付成功",
                showType: "success"
            }, () => {

            });
        } else {
            //开通成功/关闭提示/关闭卡号输入
            this.panel.show(false);
            if (this.stepAction && this.stepAction.onAction) {
                this.stepAction.onAction("closeAdd");
            }
        }

    }

    handVer(type, action) {
        this.handVerState = true;
        // action为“ok”或者“cancel”当   action==“ok” && 支付失败 提示文案改变
        //关闭已经存在的窗口
        this.wh.closeWindow();
        //验证是否支付
        this.panel.show(true, {
            content: type === "pay" ? "验证支付中" : "验证开通中",
            showType: "verpay"
        }, () => {
            this[type === "pay" ? "loadPayOrderVer" : "loadUnionVer"]({
                orderId:this.id,
                payment:this.data.order.payment,
                flag:true
            }, (code, msg, data) => {
                //验证是否支付成功
                if (code > 0&&data.flag) {

                    this.showSuccess(type);

                } else {

                    //当   action==“ok” && 支付失败 提示文案改变
                    if(type === "pay"){
                        this.panel.show(action === "ok" , {
                            okText: "我知道了",
                            content:this.getConnectUsLink(action,action === "ok"?"抱歉，当前未收到银行或第三方平台支付确认，为避免重复支付，请确认您的账户已扣款。如已扣款请":msg),
                            // title: type==="pay"?"支付信息":"银联开通",
                            showType: "error"
                        }, () => {

                        });
                    }else{
                        //开通验证
                        this.panel.show(action === "ok" , {
                            okText: "我知道了",
                            content:this.getConnectUsLink(action,action === "ok"?"抱歉，尚未收到银行的开通提示，请重新开通。如有疑问请:":msg),
                            // title: type==="pay"?"支付信息":"银联开通",
                            showType: "error"
                        }, () => {

                        });
                    }

                }

            });

        });

    }
    getConnectUsLink(action,content){
        let connectUsLink = <a
            onClick={() => {
                if (window.ysf && window.ysf.open) {
                    // window.ysf.open();
                    window.ysf.product({
                        show: 1, // 1为打开， 其他参数为隐藏（包括非零元素）
                        title: "订单支付异常",
                        desc: "异常原因:" + (content),
                        note: "订单号:" + this.id,
                        url: window.location.host,
                        success: function () {     // 成功回调
                            window.ysf.open();
                        },
                        error: function () {       // 错误回调
                            // handle error
                        }
                    });
                } else {
                    message.warn(content);
                }
            }}>
            联系客服
        </a>;
        return(
            <div>
                {/*UI说：长文字的时候，就不提示“支付失败”了*/}
                {action === "ok" ?
                    <div style={{textAlign: "left"}}>{content}&nbsp;
                        {connectUsLink}
                    </div>
                    :
                    <div>
                        {content}
                        <br/>
                        <div>如有疑问，请&nbsp;{connectUsLink}&nbsp;</div>
                    </div>
                }
            </div>
        );
    }

    autoVer(apinPanel, type,) {
        if(this.handVerState){
            return;
        }

        this[type === "pay" ? "loadPayOrderVer" : "loadUnionVer"]({
            orderId:this.id,
            payment:this.data.order.payment,
            flag:false
        }, (code, msg, data) => {
            //验证是否支付成功
            if (code > 0&&data.flag) {

                //提示支付成功
                this.showSuccess(type);

            } else {
                setTimeout(() => {
                    this.autoVer(apinPanel, type);
                }, 1000);
            }

        });

    }

    loadPayIntegral(param, cb) {

        HttpTool.request(HttpTool.typeEnum.POST, Api.pay, (code, msg, json, option) => {
            cb(code, msg, json);
        }, (code, msg, option) => {
            cb(code, msg, {});
        }, Object.assign(param||{},{
            orderId:this.id,
            payment:this.data.order.payment,
            point:this.data.integral.use?this.data.integral.use*1000:0,
        }));

        // setTimeout(() => {
        //    let code = (Math.random() * 10).toFixed(0) - 1;
        //    let data = {};
        //    cb(code, code > 0 ? "验证成功" : "验证失败", data);
        // }, Math.random() * 10);
    }

    loadUnionVer(param, cb) {
        HttpTool.request(HttpTool.typeEnum.POST, Api.isOpen, (code, msg, json, option) => {
            let data = {
                flag:!!json
            };
            cb(code,msg,data);
        }, (code, msg, option) => {
            cb(code,msg, {});
        }, Object.assign(param||{},{
            cardNo:this.cardNo
        }));

        // setTimeout(() => {
        //    let code = (Math.random() * 10).toFixed(0) - 1;
        //    let data = {};
        //    data.url = "http://www.baidu.com";
        //    cb(code, code > 0 ? "开通成功00" : "开通失败000", data);
        // }, Math.random() * 1000 + 2000);
    }

    loadPayOrderVer(param, cb) {
        console.log("======验证支付中");
        HttpTool.request(HttpTool.typeEnum.POST, Api.confirm, (code, msg, json, option) => {
            cb(code, msg, json);
        }, (code, msg, option) => {
            cb(code, msg, {});
        }, param);

        // setTimeout(() => {
        //    let code = (Math.random() * 10).toFixed(0) - 11;
        //    let data = {};
        //    data.url = "http://www.baidu.com";
        //    cb(code, code > 0 ? "支付成功" : "支付失败", data);
        // }, Math.random() * 1000 + 2000);
    }

    loadPayOrder(param, cb) {
        HttpTool.request(HttpTool.typeEnum.POST,Api.online, (code, msg, json, option) => {
            cb(code, msg, json);
        }, (code, msg, option) => {
            cb(code, msg, {});
        }, param);
        // setTimeout(() => {
        //    let code = (Math.random() * 10).toFixed(0) - 1;
        //    let data = {};
        //    data.url = "http://www.baidu.com";
        //    data.payPrice = (Math.random() * 10000).toFixed(0);
        //    cb(code, "无库存了/或者其他", data);
        // }, Math.random() * 1000 + 2000);
    }

    loadPayInfo(param, cb) {
        if (!param || !param.orderId) {
            cb(-3, "缺少订单号", null);
            return;
        }
        HttpTool.request(HttpTool.typeEnum.POST,Api.payInfo, (code, msg, json, option) => {

            let data =  {
                order: {
                    orderNo:json.orderNo,
                    adultCount:json.adultCount,
                    payment:json.payment,
                    childCount:json.childCount,
                    expiredTime:json.expiredTime,
                    time:json.time,
                    phone:json.phone,
                    price: json.amount,
                    priceAll: json.totalAmount,
                },
                integral: {
                    point: json.point,
                    use: 0
                },
                error:json.msg
            };
            if (code > 0) {
                if (!data.pay) {
                    data.pay = {
                        defaultIndex: 0,
                        defaultshowMore: true
                    };
                }
            }
            cb(code, msg, data);
        }, (code, msg, option) => {
            cb(code, msg, {pay:{},integral:{},order:{}});
        }, param);
    }

}

class Money extends Component {
    constructor(props) {
        super(props);
        this.state = {
            use: this.props.use,
        };
    }

    /**
     *
     * @param use 单位 / 分
     */
    upDatePrice(use) {
        this.setState({
            use: use
        });
    }
    // shouldComponentUpdate(nextProps, nextState){
    //    if(nextProps.use!==this.state.use){
    //        this.upDatePrice(nextProps.use);
    //        return false;
    //    }else{
    //        return true;
    //    }
    //
    // }

    getData() {
        return this.props.data || {};
    }

    render() {
        let data = this.getData();
        data.payPrice = (data.price*100 - this.state.use*100)/100;
        return <span {...this.props}>
       {data.payPrice}
      </span>;
    }
}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;

