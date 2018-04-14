import React, {Component} from 'react';
import {Input, Button, Icon} from 'antd';
import less from './SearchBox.less';

class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchLoading: false,
            resetLoading: false,
            value: null,
        };
    }

    render() {
        return (
            <div className={less.container}>
                <Input
                    className={less.inputStyle}
                    placeholder={this.props.placeholder || ''}
                    disabled={this.state.searchLoading||this.state.resetLoading}
                    value={this.state.value}
                    onChange={(obj) => {
                        let value = obj.target.value;
                        this.setInputValue(value);
                    }}
                    suffix={
                        <Icon
                            className={this.state.value&&!this.state.searchLoading&&!this.state.resetLoading ? less.clearBtn : less.hidden}
                            type={'close-circle-o'}
                            style={{fontSize: 18}}
                            onClick={() => {
                                    this.setInputValue(null);
                                }
                            }
                        />
                    }
                />
                <Button
                    type={'primary'}
                    className={less.searchBtn}
                    loading={this.state.searchLoading}
                    disabled={this.state.resetLoading||!this.state.value}
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
                    className={less.resetBtn}
                    loading={this.state.resetLoading}
                    disabled={this.state.searchLoading}
                    onClick={()=>{
                        this.setInputValue(null);
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