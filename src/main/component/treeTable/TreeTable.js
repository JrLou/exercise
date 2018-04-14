import React, {Component} from 'react';
import {Table,Button} from 'antd';
import less from './TreeTable.less';
import SearchBox from '../searchBox/SearchBox.js';

class TreeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            update: 0,
        };

        //获取模拟数据
        this.items = require('./data.js');

        //设置表格列
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                className:less.tableCountryName,
                width:250,
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text, record, index) => {
                    let type = text;
                    switch (text) {
                        case 0:
                            type = '国家';
                            break;
                        case 1:
                            type = '省/州';
                            break;
                        case 2:
                            type = '市级';
                            break;
                        case 3:
                            type = '区/县';
                            break;
                        default:
                            break;
                    }
                    return (<span>{type}</span>);
                },
            },
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '英文名',
                dataIndex: 'English',
                key: 'English',
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                            text == 1
                            ? <span>启用</span>
                            :<span className={less.redText}>停用</span>
                        }
                        </span>
                    );
                },
            },
            {
                title:'操作',
                render:()=>{
                    return(
                        <div>
                            <div className={less.btnDetail}>查看详情</div>
                            <div className={less.btnAdd}>添加子成员</div>
                            <div className={less.btnEdit}>编辑</div>
                            <div className={less.btnDelete}>删除</div>
                        </div>
                    );
                },
                width:350,
            }
        ];
    }

    render() {

        return (
            <div>
                <div className={less.searchBox}>
                    <SearchBox
                        placeholder={'请输入中文名、英文名或编码'}
                        searchAction={(value,changeState)=>{
                            changeState('searchLoading',true);
                            alert(value);
                            setTimeout(()=>{
                                changeState('searchLoading',false);
                            },2000);
                        }}
                        reSetAction={(changeState)=>{
                            changeState('resetLoading',true);
                            alert('重置');
                            changeState('resetLoading',false);
                        }}
                    />
                </div>
                <div className={less.btnBox}>
                    <Button
                        size={'large'}
                        type={'primary'}
                        onClick={()=>{
                            alert('添加');
                        }}
                    >
                        新增国家
                    </Button>
                </div>
                <Table
                    className={less.table}
                    loading={this.state.loading}
                    bordered={true}
                    columns={this.columns}
                    dataSource={this.items}
                    indentSize={20}
                    defaultExpandAllRows={false}
                    onExpand={(expanded, recode) => {
                        this.changeChildRowsOpen(expanded, recode);
                    }}
                />
            </div>
        );
    }

    /**
     * 更新视图
     */
    upDate() {
        this.setState({
            update: this.state.update + 1
        });
    }

    /**
     * 展开/关闭子栏目时触发
     * @param expanded  true/false
     * @param recode    行数据
     */
    changeChildRowsOpen(expanded, recode) {
        //1.关闭子栏目，不操作 2.如果已经有子栏目，不进行查询
        if (!expanded || (recode.children && recode.children.length > 0)) {
            return;
        }
        console.log(recode);
        //查询子数据
        this.loadChildData(recode);
    }

    /**
     * 改变列表查询状态
     * @param state
     */
    changeLoadState(state) {
        this.setState({
            loading: state || false,
        });
    }

    /**
     * 查询子栏目的数据
     * @param recode
     */
    loadChildData(recode) {
        //设置列表为查询状态
        this.changeLoadState(true);

        //模拟查询数据
        setTimeout(() => {
            let index = recode.index;
            //模拟返回的数据
            let json = [
                {
                    key: parseInt(Math.random() * 10000),
                    index: 8001,
                    type: 1,
                    name: '测试省一',
                    code: 'CE1',
                    English: 'ceshi01',
                    state: 1,
                    children: [],
                },
                {
                    key: parseInt(Math.random() * 10000),
                    index: 8002,
                    type: 1,
                    name: '测试省二',
                    code: 'CE2',
                    English: 'ceshi02',
                    state: 0,
                    children: [],
                },
            ];

            //更新数据
            this.upDateItem(index, json);
        }, 0);
    }

    /**
     * 更新数据
     * @param index     用于识别的属性值
     * @param item      需要插入的数据
     */
    upDateItem(index, item) {
        if (!index || !item || item.length <= 0) {
            return;
        }

        //在指定位置插入数据
        this.insertData(this.items, index, item);

        //恢复列表状态
        this.upDate();
        this.changeLoadState(false);
    }

    /**
     * 递归一个树形结构的数组，在指定位置插入数据
     * @param target    目标数组
     * @param index     用于识别的属性值
     * @param data      需要插入的数据
     */
    insertData(target, index, data) {
        if (!target || target.length <= 0) {
            return;
        }
        for (let key in target) {
            let childTarget = target[key];
            if (childTarget.index == index) {
                childTarget.children = data;
                return;
            } else {
                this.insertData(childTarget.children, index, data);
            }
        }
    }
}

module.exports = TreeTable;