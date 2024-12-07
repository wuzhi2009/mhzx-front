import { Card, Modal, Pagination, Table, Tag } from 'antd';
import Search from 'antd/es/input/Search';
import React, { Component } from 'react';
import { list } from '../api/fundapi/fundapi';
import FundMap from '../components/FundMap';
import JCMap from '../imgs/京城.png';
import HYMap from '../imgs/河阳.png';
import DWCMap from '../imgs/大王村.png';
import NJMap from '../imgs/南疆.png';
import KSSMap from '../imgs/空桑山.png';
import XFRWJS from '../imgs/寻访任务介绍.png';
import { DoubleRightOutlined } from '@ant-design/icons';
import TopBreadcrumb from '../components/TopBreadcrumb';
import { withRouter } from '../utils/withRouter';
const tableStyle = {
    marginTop: 5,
    boxShadow: '2px 5px 10px #303643',
    width: 950
}

const tagsData = [{ name: "京城寻访", flag: 1 },
{ name: "河阳寻访", flag: 2 }, { name: "大王村寻访", flag: 3 },
{ name: "南疆寻访", flag: 4 }, { name: "空桑山寻访", flag: 5 },
{ name: "寻访任务介绍说明", flag: 6 }];

/**
 * 寻访任务界面
 * 
 * @author wuzhi
 */
class Fund extends Component {
    state = { data: [], loading: false, total: 0, page: 1, pageSize: 10, flag: 1, search: "", openMap: false, address: "", move: 0, jieShao: <></> }
    imgRef = React.createRef();
    initCol = () => {
        this.columns = [
            {
                title: '序号',
                align: 'center',
                dataIndex: 'id',
                width: 70,
                render: (_, { id }, index) => {
                    const { page, pageSize } = this.state;
                    return (
                        <div>
                            {(page - 1) * pageSize + index + 1}
                        </div>
                    )
                },
            },
            {
                title: '寻访描述',
                align: 'center',
                dataIndex: 'text',
                width: 760
            },
            {
                title: '寻访NPC',
                dataIndex: 'name',
                align: 'center',
                width: 144
            },
            {
                title: '地图坐标',
                align: 'center',
                dataIndex: 'address',
                width: 116
            }
        ]
    }
    getList = (page, pageSize, flag, search) => {
        this.setState({ loading: true });
        list(page, pageSize, flag, search).then(res => {
            if (res.data.code === 200) {
                this.setState({ data: res.data.data, loading: false, total: res.data.total });
            }
        })
    }
    componentDidMount() {
        this.initCol();
        this.getList(1, 10, 1, "");
    }
    componentDidUpdate(oldProps, oldState) {
        const { page, pageSize, flag, search, move } = this.state;
        var x = move;
        if ((page !== oldState.page || pageSize !== oldState.pageSize || flag !== oldState.flag || search !== oldState.search) && flag !== 6) {
            // 先判断是否在原位
            if (move < 0) {
                var interval = setInterval(() => {
                    if (x < 0) {
                        x = x + 40;
                        this.setState({ move: x })
                    } else {
                        clearInterval(interval);
                    }
                }, 10);
            }
            this.setState({jieShao: <></>});
            this.getList(page, pageSize, flag, search);
        }
        if (flag !== oldState.flag && flag === 6) {
            // 打开寻访任务详情
            interval = setInterval(() => {
                if (x > -1050) {
                    x = x - 40;
                    this.setState({ move: x })
                } else {
                    clearInterval(interval);
                }
            }, 10);
            var jieShao = <Card style={ {display: 'inline-block', margin: '30px 0 0 10px', verticalAlign: 'top'} }>
                <h1>梦幻诛仙寻访任务介绍说明</h1>
                <div style={ {float: 'right', userSelect: 'none', cursor: 'pointer'} } onClick={ () => {this.setState({flag: 1})} }><Tag style={ {fontSize: 18} }>返回<DoubleRightOutlined style={ {fontSize: 20} } /></Tag></div>
                <div>
                    <p>玩家在达到20级后，在京城曾书书处可以接到寻访任务。</p>
                    <p><strong>任务准备：</strong><br />玩家第一次与曾书书对话后，会被要求找河阳布店的老板娘领取给六个NPC送请帖的任务。 <br />完成后，与曾书书第二次对话时，可以接到在京城给八个NPC送请帖的任务。全部完成后，就可以开始寻访任务了。</p>
                    <div align="center"><img alt="" src={ XFRWJS } width="500" /></div>
                    <p><strong>任务完成方式：<br /></strong>接到任务后，要求随机寻访一位在京城、河阳、大王村、南疆、空桑山的npc。会有一段关于这个npc的描述，玩家需要根据描述找到这个npc，与之对话，完成任务。</p>
                    <p><strong>其他说明：</strong><br />寻访任务每天只能完成一次。</p>
                    <p><strong>任务奖励：<br /></strong>完成后会得到经验、金钱。</p>
                </div>
            </Card>
            this.setState({jieShao});
        }
    }
    render() {
        const { data, total, page, flag, openMap, address, move, jieShao } = this.state;
        const { location } = this.props.router;
        const pathname = location.pathname;
        var title = "";
        var mapUrl = "";
        var width = 0;
        var height = 0;
        switch (flag) {
            case 1:
                title = "京城地图";
                mapUrl = JCMap;
                height = 418;
                width = 727;
                break;
            case 2:
                title = "河阳地图";
                mapUrl = HYMap;
                height = 428;
                width = 728;
                break;
            case 3:
                title = "大王村地图";
                mapUrl = DWCMap;
                height = 260;
                width = 518;
                break;
            case 4:
                title = "南疆地图";
                mapUrl = NJMap;
                height = 514;
                width = 351;
                break;
            case 5:
                title = "空桑山地图";
                mapUrl = KSSMap;
                height = 471;
                width = 516;
                break;
            default:
                title = "京城地图";
                mapUrl = JCMap;
                height = 418;
                width = 727;
                break;
        }
        return (
            <>
                <Card style={{ marginTop: 160, marginLeft: move, display: 'inline-block', width: 1000 }}>
                    <div className='cardHeader'>
                        <span style={ {marginLeft: 24, userSelect: 'none'} }>您的位置：</span>
                        <TopBreadcrumb path={ pathname } />
                    </div>
                    <div style={{ marginTop: 30, width: 900 }}>
                        {
                            tagsData.map((tag, index) => (
                                <Tag.CheckableTag
                                    key={index}
                                    checked={flag === tag.flag}
                                    onChange={(checked) => {
                                        if (checked) {
                                            // 选中
                                            this.setState({ flag: tag.flag, page: 1 });
                                        }
                                    }}
                                    style={{ fontSize: 18, marginRight: 40 }}
                                >
                                    <span style={{ userSelect: 'none' }}>{tag.name}</span>
                                </Tag.CheckableTag>
                            ))
                        }
                    </div>
                    <div style={ {width: 850} }>
                        <div style={ {display: 'inline-block', userSelect: 'none', transform: 'translateY(5px)'} }>输入寻访任务描述的关键字，即可快速查找寻访NPC名字：</div>
                        <div style={ {display: 'inline-block', width: 350} }>
                            <Search placeholder="请输入寻访描述..." onSearch={ (search) => {this.setState({ search, page: 1 })} } enterButton />
                        </div>
                    </div>
                    <Table
                        rowKey="id"
                        columns={ this.columns }
                        dataSource={ data }
                        onRow={ (row) => {
                            return {
                                style: { height: 80, userSelect: 'none' },
                                onClick: () => {
                                    this.setState({ openMap: true, address: row.address });
                                }
                            }
                        }
                        }
                        style={ tableStyle }
                        pagination={ false }
                    />
                    <div style={ { marginTop: 15 } }>
                        <Pagination
                            current={ page }
                            total={ total }
                            showSizeChanger
                            showQuickJumper
                            showTotal={ (total) => <span style={{ userSelect: 'none' }}>{`总数据： ${total} 条`}</span> }
                            onChange={ (page, pageSize) => { this.setState({ page, pageSize }) } }
                            disabled={ move < 0 }
                        />
                    </div>
                </Card>
                { jieShao }
                <Modal title={ title }
                    open={ openMap }
                    onCancel={ () => this.setState({ address: "", openMap: false }) }
                    footer={ null }
                    width={ width + 36 }
                    maskClosable={ false }
                >
                    <img alt="" src={ mapUrl } style={ {display: 'none'} } ref={ this.imgRef } />
                    <FundMap mapRef={ this.imgRef } width={ width } height={ height } address={ address } />
                </Modal>
            </>
        )
    }
}

export default withRouter(Fund);