import React, {Component} from 'react';
import {Modal} from 'antd';
import less from './ShowDetail.less';

class ShowDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show:this.props.show,
            data:this.props.data,
        };
    }

    render(){
        return(
            <div>
                <Modal
                    title={'详情'}
                    visible={this.state.show}
                    footer={null}
                    onCancel={()=>{
                        this.changeShowState(false);
                    }}
                >
                    {this.getDetailViews(this.state.data)}
                </Modal>
            </div>
        );
    }

    //绘制内容
    getDetailViews(data){
        if(!data){
            return;
        }
        if(this.props.getView){
            this.props.getView(data);
        }else{
            let view = [];
            for(let key in data){
                view.push(
                  <div className={less.lineBox} key={key}>
                      <div className={less.title}>
                          {key}
                      </div>
                      <div className={less.content}>
                          {data[key]}
                      </div>
                  </div>
                );
            }

            return view;
        }
    }

    /**
     * 改变显示状态
     * @param state
     */
    changeShowState(state){
        this.setState({
            show:state||false,
        });
    }

    /**
     * 打开模态框
     * @param state
     * @param data
     */
    openDetail(state,data){
        this.setState({
            show:state||false,
            data:data||null,
        });
    }
}

ShowDetail.defaultProps = {
    show:false,
    data:null,
};


module.exports = ShowDetail;