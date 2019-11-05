import React from 'react';
import {Steps, Form, message, Modal, Button, Spin, Select, Input, Row, Col} from 'antd';

const Step = Steps.Step;

import {PackTypeData,StartTypeData,StepList} from './ConfigData';

class AppPutOn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stepMsg: {
                current: 0,
                status: 'process',   //wait process finish error
            },
            firstForm: {},
            secondForm: {},
            thirdForm: {},
        };
    }

    render() {
        const {stepMsg} = this.state;

        return (<div style={{margin: '60px', padding: '20px', border: '1px solid #0000ff'}}>
            {this.getStepTab(stepMsg)}
            {this.getForms(stepMsg)}
            {this.getButtons(stepMsg)}
        </div>);
    }

    /**
     * 步骤条
     * @param stepMsg
     * @return {*}
     */
    getStepTab(stepMsg) {
        let result = [];
        StepList.forEach((obj, index) => {
            result.push(<Step
                key={'stepKey' + index}
                title={stepMsg.current === index && stepMsg.status === 'error' ? obj.errTitle : obj.title}
            />);
        });

        return <Steps
            {...stepMsg}
        >{result}</Steps>;
    }

    /**
     * 步骤按钮
     * @param stepMsg
     * @return {*}
     */
    getButtons(stepMsg) {
        let length = StepList.length;
        return <Row>
            <Col span={8} offset={8}>
                {
                    stepMsg.current >= 0 && stepMsg.current < length - 2
                        ? <Button
                            size={'large'}
                            type={'primary'}
                            onClick={()=>{
                                this.changeStep('next','process');
                            }}
                        >下一步</Button>
                        : null
                }
                {
                    stepMsg.current === length - 2
                        ? <Button
                            size={'large'}
                            type={'primary'}
                            onClick={()=>{
                                alert("验证表单");
                            }}
                        >提交</Button>
                        : null
                }
                {
                    stepMsg.current > 0 && stepMsg.current <= length - 2
                        ? <Button
                            size={'large'}
                            onClick={()=>{
                                this.changeStep('prev','process');
                            }}
                        >上一步</Button>
                        : null
                }
            </Col>
        </Row>;
    }

    /**
     * 修改步骤
     * @param newStep
     */
    changeStep(type,status){
        let currStep = this.state.stepMsg;
        let foword = type === 'next' ? 1 : -1;
        let newIndex = currStep.current + foword;
        this.setState({
            stepMsg:{
                current:newIndex,
                status:status,
            }
        });
    }

    /**
     * 渲染表单
     * @param stepMsg
     */
    getForms(stepMsg){
        let view = null;
        switch(stepMsg.current){
            case 0:break;
            case 1:break;
            case 2:break;
            case 3:break;
        }

        return view;
    }
}

module.exports = AppPutOn;