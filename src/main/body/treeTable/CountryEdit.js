import React, {Component} from 'react';
import {Form, Input, Select,Radio,Button,Modal} from 'antd';
import less from './Edit.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CountryEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        //改变模态框显示隐藏的方法
        this.changeModalState = this.props.changeModalState?this.props.changeModalState:null;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const defaultData = this.props.defaultData;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="国家编码"
                >
                    {getFieldDecorator('code', {
                        initialValue: defaultData.code || null,
                        rules: [{
                            pattern: /^[A-Z]{0,8}$/, message: '国家编码必须为大写字母',
                        }, {
                            required: true, message: '请输入国家编码!',
                        }],
                    })(
                        <Input maxLength={'5'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="国家中文名"
                >
                    {getFieldDecorator('name', {
                        initialValue: defaultData.name || null,
                        rules: [{
                            pattern: /^[\u4e00-\u9fa5]*$/, message: '请输入中文',
                        }, {
                            required: true, message: '请输入国家中文名!',
                        }],
                    })(
                        <Input maxLength={'20'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="国家英文名"
                >
                    {getFieldDecorator('English', {
                        initialValue: defaultData.English || null,
                        rules: [{
                            pattern: /^[a-zA-Z]*$/, message: '请输入英文',
                        }, {
                            required: true, message: '请输入国家英文名!',
                        }],
                    })(
                        <Input maxLength={'20'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="国家英文缩写"
                >
                    {getFieldDecorator('En', {
                        initialValue: defaultData.En || null,
                        rules: [{
                            pattern: /^[a-zA-Z]*$/, message: '请输入英文',
                        }, {
                            required: true, message: '请输入国家英文缩写!',
                        }],
                    })(
                        <Input maxLength={'10'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="国家首字母"
                >
                    {getFieldDecorator('FistCode', {
                        initialValue: defaultData.FistCode || null,
                        rules: [{
                            pattern: /^[a-zA-Z]*$/, message: '请输入英文',
                        }, {
                            required: true, message: '请输入国家首字母!',
                        }],
                    })(
                        <Input maxLength={'1'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="所属大洲"
                >
                    {getFieldDecorator('continent', {
                        initialValue: defaultData.continent || null,
                        rules: [{
                            required: true, message: '请选择所属大洲!',
                        }],
                    })(
                        <Select>
                            <Option value="0">亚洲</Option>
                            <Option value="1">欧洲</Option>
                            <Option value="2">非洲</Option>
                            <Option value="3">北美洲</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="国家电话代码"
                >
                    {getFieldDecorator('phone', {
                        initialValue: defaultData.phone || null,
                        rules: [{
                            pattern: /^[0-9\-]*$/, message: '请检查格式',
                        }, {
                            required: true, message: '请输入国家电话代码!',
                        }],
                    })(
                        <Input maxLength={'20'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="时差"
                >
                    {getFieldDecorator('timeZone', {
                        initialValue: defaultData.timeZone || null,
                        rules: [{
                            pattern: /^[0-9]*$/, message: '请输入数字',
                        }, {
                            required: true, message: '请输入时差!',
                        }],
                    })(
                        <Input maxLength={'2'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                >
                    {getFieldDecorator('state', {
                        initialValue: defaultData.state || null,
                        rules: [{
                            required: true, message: '请选择状态!',
                        }],
                    })(
                        <RadioGroup>
                            <Radio value={1}>启用</Radio>
                            <Radio value={2}>禁用</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <div className={less.btnBox}>
                    <Button
                        size={'large'}
                        className={less.btn}
                        type={'danger'}
                        onClick={()=>{
                            Modal.confirm({
                                title: '提示',
                                content: '是否确定取消编辑并关闭窗口？',
                                okText: '确定',
                                cancelText: '返回',
                                onOk:()=>{
                                    this.changeModalState(false);
                                }
                            });
                        }}
                    >
                        取消
                    </Button>
                    <Button
                        size={'large'}
                        className={less.btn}
                        type={'primary'}
                        onClick={()=>{
                            this.handleSubmit();
                        }}
                    >
                        提交
                    </Button>
                </div>
            </Form>
        );
    }

    /**
     * 提交
     */
    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            Modal.confirm({
                title: '提示',
                content: '是否提交内容？',
                okText: '确定',
                cancelText: '返回',
                onOk:()=>{
                    alert('提交');
                }
            });
        });
    }

}


const CountryEditForm = Form.create()(CountryEdit);

CountryEditForm.defaultProps = {
    defaultData: {
        code: null,
        name: null,
        English: null,
        En: null,
        FirstCode: null,
        continent: null,
        phone: null,
        timeZone: null,
        state: null,
    }
};


module.exports = CountryEditForm;