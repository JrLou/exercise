import React, {Component} from 'react';
import {Icon} from 'antd';
import less from './PaySelectLayout.less';
import  Item from './Item';
class PaySelectLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxSelect: 3,
            showMore: this.props.defaultshowMore||false,
            selectIndex: this.props.defaultIndex||0,
            loading: true
        };
    }
    getData(){
        return this.props.data ||{};
    }
    getPayList() {
        return [
            {
                type: "ali",
                title: "支付宝",
                getView: () => {
                    return <img src={require("./images/pay_ali.png")} alt={"支付宝图片"}/>;
                },
            },
            {
                type: "wechat",
                title: "微信支付",
                getView: () => {
                    return <img src={require("./images/pay_wechat.png")} alt={"微信图片"}/>;
                },
            }, {
                type: "online",
                title: "银联支付",
                getView: () => {
                    return <img src={require("./images/pay_union.png")} alt={"银联图片"}/>;
                },
            }, {
                type: "bank",
                title: "银行转账",
                getView: () => {
                    return (
                       <div style={{cursor:'pointer'}}>
                          <img src={require("./images/pay_bank.png")} alt={"银行图片"}/>
                           <div className={less.bankItme_msg}>
                               <p>银行转账</p>
                               <p>(上传转账凭证)</p>
                           </div>
                       </div>
                    );
                },
            }
        ];
    }


    render() {
        let payList = this.getPayList();
        if (!this.state.showMore) {
            payList = payList.slice(0, this.state.maxSelect);
        }
        let data = this.getData();
        const showMoreContent = (
           <div
              className={less.payMore}
              onClick={() => {
                 this.setState({
                    showMore: !this.state.showMore
                 },()=>{
                    data.defaultshowMore = this.state.showMore;
                 });
              }}>
              <span>更多支付方式 {this.state.showMore ? <Icon type="up" /> : <Icon type="down" />} </span>
            </div>
        );
        return (
            <div
                {...this.props}
                className={less.payLayout}
            >
               <div className={less.payLayout_top}>请选择支付方式</div>
               <div className={less.payLayout_middle}>
                  <div>
                     {
                        payList.map((obj, index) => {
                           obj.select = this.state.selectIndex === index;

                           if(obj.select){
                              data.type = obj.type;
                              data.defaultIndex = index;
                           }
                           let itemCmp = <Item
                              style={{cursor:'pointer'}}
                              key={index}
                              {...obj}
                              onClick={() => {
                                 this.setState({
                                    selectIndex: index
                                 }, () => {

                                 });
                                 //清空其他选择
                              }
                              }
                           >
                              {obj.getView()}
                           </Item>;
                           if(index === 3){//即为showMore的时候
                              return (
                                 <div key={index}>
                                    {showMoreContent}
                                    {itemCmp}
                                 </div>
                              );
                           } else {
                              return itemCmp;
                           }
                        })
                     }
                  </div>
                 {this.state.showMore ? null:showMoreContent}
               </div>
            </div>
        );
    }
}



PaySelectLayout.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PaySelectLayout;