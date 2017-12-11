import React, {Component} from 'react';
import less from './Panel.less';

import {Button, Modal, message} from 'antd';

class Panel extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         data: {},
      };
   }

   show(loading, data, callBack) {
      this.setState({
         loading,
         data
      }, callBack);
   }

   getPayingLayout() {
      let verPay = (action) => {

         if (this.props.onAction) {
            this.props.onAction(action, this.state.data.showType);
         }
      };
      return (
         <div>
            <div className={less.getPayingLayout}>{this.state.data.content}</div>
            <Button
               className={less.modalBtn}
               onClick={() => {
                  verPay("cancel");
               }}>{this.state.data.cancelText}</Button>
            <Button
               className={less.modalBtn}
               type="primary"
               onClick={() => {
                  verPay("ok");
               }}>{this.state.data.okText}</Button>
         </div>
      );
   }

   getErrorLayout() {
      return (
         <div className={less.payResultContainer}>
            <div>
               <img className={less.infoImg} src={require("./images/pay_err.png")} alt="支付失败"/>
               <div className={less.tips}>{this.state.data.content}</div>
                <Button
                    className={less.modalBtn}
                    type="primary"
                    onClick={() => {
                        this.show(false);
                    }}>{"我知道了"}</Button>
            </div>
         </div>
      );
   }
    getWarnLayout() {
      return (
         <div className={less.payResultContainer}>
            <div>
               <img className={less.infoImg} src={require("./images/pay_timeout.png")} alt="支付失败"/>
               <div className={less.tips}>{this.state.data.content}</div>
                <Button
                    className={less.modalBtn}
                    type="primary"
                    onClick={() => {

                        if (this.props.onAction) {
                            this.props.onAction(this.state.data.action, this.state.data.showType);
                        }
                    }}>{"我知道了"}</Button>
            </div>
         </div>
      );
   }

   getSuccessLayout() {
      return (
         <div className={less.payResultContainer}>
            <img className={less.infoImg} src={require("./images/pay_succ.png")} alt="支付成功"/>
            <div className={less.tips}>{this.state.data.content}</div>
            <Button
               className={less.modalBtn}
               type={"primary"}
               onClick={(action) => {
                  if (this.props.onAction) {
                     this.props.onAction("ok", this.state.data.showType);
                  }
               }}>查看订单</Button>
         </div>
      );
   }

   getLoadingLayout() {
      return (
         <div>
            <div className={less.animationGroup}>
               <span className={less.animationGroup_circle}></span>
               <span className={less.animationGroup_circle}></span>
               <span className={less.animationGroup_circle}></span>
            </div>

            <div>{this.state.data.content}</div>
         </div>
      );
   }

   render() {
      if (!this.state.loading) {
         return null;
      }
      let view = null;
      switch (this.state.data.showType) {
         case "loading":
         case "verpay":
            view = this.getLoadingLayout();
            break;
         case "error":
            view = this.getErrorLayout();
            break;
         case "success":
            view = this.getSuccessLayout();
            break;
         case "warn":
            view = this.getWarnLayout();
            break;
         case "paying":
         case "unioning":
            view = this.getPayingLayout();
            break;
      }

      //当为“error”时候，设置显示“X”并且点击“X”或“蒙版”均可以关闭模态框
      let errProps = null;
      // if(this.state.data.showType === "error"){
      //    errProps = {
      //       maskClosable: true,
      //       closable: this.state.data.showType === "error" ? true : false,
      //       onCancel: () => {
      //          //不能删除该方法
      //          //这里IDE提示没有引用，但实际是引用了的，
      //          this.show(false);
      //       }
      //    };
      // } else {
      //
      // }
       errProps = {
           confirmLoading: false,
           maskClosable: false
       };
      return (
         <Modal
            visible={true}
            width={400}
            style={{
               position: "absolute",
               margin: "auto",
               top: 0,
               bottom: 0,
               right: 0,
               left: 0,
               height: 220,
            }}
            closable={false}
            footer={null}
            {...errProps}
            {...this.state.data}
         >
            <div className={less.modalConent}>
               {view}
            </div>
         </Modal>
      );
   }
}

Panel.contextTypes = {
   router: React.PropTypes.object
};
module.exports = Panel;