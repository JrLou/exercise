import React, {Component} from 'react';
import {Input, Button, Icon} from 'antd';
import less from './SearchBox.less';

class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchLoading: false,       //是否正在搜索
            resetLoading: false,        //是否正在重置
            value: null,                //输入框的值
            reg:this.props.reg||null,   //正则
            passed:true,                  //正则验证状态
        };
    }

    render() {
        return (
            <div className={less.container}>
                <Input
                    size={'large'}
                    maxLength={'15'}
                    className={this.state.passed?less.inputStyle:less.inputErr}
                    placeholder={this.props.placeholder || ''}
                    disabled={this.state.searchLoading||this.state.resetLoading}
                    value={this.state.value}
                    onChange={(obj) => {
                        let value = obj.target.value;
                        if(this.state.reg){
                            this.setState({
                                passed:this.state.reg.test(value)
                            });
                        }
                        this.setInputValue(value);

                    }}
                    suffix={
                        <Icon
                            className={this.state.value&&!this.state.searchLoading&&!this.state.resetLoading ? less.clearBtn : less.hidden}
                            type={'close-circle-o'}
                            style={{fontSize: 18}}
                            onClick={() => {
                                    this.setState({
                                        passed:true,
                                        value:null,
                                    });
                                }
                            }
                        />
                    }
                />
                <Button
                    size={'large'}
                    type={'primary'}
                    className={less.searchBtn}
                    loading={this.state.searchLoading}
                    disabled={this.state.resetLoading||!this.state.value||!this.state.passed}
                    onPressEnter={() => {
                        this.props.searchAction&&this.props.searchAction(this.state.value,this.changeLoadingState.bind(this));
                    }}
                    onClick={() => {
                        this.props.searchAction&&this.props.searchAction(this.state.value,this.changeLoadingState.bind(this));
                    }}
                >
                    搜索
                </Button>
                <Button
                    size={'large'}
                    className={less.resetBtn}
                    loading={this.state.resetLoading}
                    disabled={this.state.searchLoading}
                    onClick={()=>{
                        this.setState({
                            value:null,
                            passed:true,
                        });
                        this.props.reSetAction&&this.props.reSetAction(this.changeLoadingState.bind(this));
                    }}
                >
                    重置
                </Button>
            </div>
        );
    }

    /**
     * 设置输入框值
     * @param value
     */
    setInputValue(value) {
        this.setState({
            value: value || null
        });
    }

    /**
     * 设置加载状态
     * @param type
     * @param state
     */
    changeLoadingState(type, state) {
        this.setState({
            [type]: state || false
        });
    }
}

module.exports = SearchBox;