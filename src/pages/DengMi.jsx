import { Card, Modal, Table } from 'antd';
import React, { Component } from 'react';
import { dengMi } from '../api/fundapi/fundapi';
import FundMap from '../components/FundMap';
import TopBreadcrumb from '../components/TopBreadcrumb';
import { withRouter } from '../utils/withRouter';
import JCMap from '../imgs/京城.png';
import HYMap from '../imgs/河阳.png';
import YQGMap from '../imgs/玉清宫.png';
import DZFMap from '../imgs/大竹峰.png';
import XZFMap from '../imgs/小竹峰.png';
import QLTMap from '../imgs/七里峒.png';
import GWZDD from '../imgs/鬼王宗大殿.png';
import QYHSMap from '../imgs/青云后山.png';
import HHPMPMap from '../imgs/合欢派门派.png';
import QYSMPMap from '../imgs/青云山门派.png';
import FXGDD from '../imgs/焚香谷大殿.png';
import Search from 'antd/es/input/Search';
const tableStyle = {
    marginTop: 5,
    boxShadow: '2px 5px 10px #303643',
    width: 950
}
/**
 * 中秋猜灯谜页面
 * 
 * @author wuzhi
 */
class DengMi extends Component {
    state = { data: [], loading: false, search: "", openMap: false, address: "", flag: 6 } 
    imgRef = React.createRef();
    initCol = () => {
        this.columns = [
            {
                title: '序号',
                align: 'center',
                dataIndex: 'id',
                width: 70,
                render: (_, { id }, index) => {
                    return (
                        <div>
                            { index + 1 }
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
            },
            {
                title: '地区标识',
                dataIndex: 'flag',
                hidden: true
            }
        ]
    }
    getList = (search) => {
        this.setState({ loading: true });
        dengMi(search).then(res => {
            if (res.data.code === 200) {
                this.setState({ data: res.data.data, loading: false });
            }
        })
    }
    componentDidMount() {
        this.initCol();
        this.getList("");
    }
    render() { 
        const { data, openMap, address, flag } = this.state;
        const { location } = this.props.router;
        const pathname = location.pathname;
        var title = "";
        var mapUrl = "";
        var width = 0;
        var height = 0;
        switch (flag) {
            case 6:
                title = "京城地图";
                mapUrl = JCMap;
                height = 418;
                width = 727;
                break;
            case 7:
                title = "河阳地图";
                mapUrl = HYMap;
                height = 428;
                width = 728;
                break;
            case 8:
                title = "玉清宫地图";
                mapUrl = YQGMap;
                height = 420;
                width = 515;
                break;
            case 11:
                title = "鬼王宗大殿";
                mapUrl = GWZDD;
                height = 767;
                width = 1025;
                break;
            case 10:
                title = "大竹峰地图";
                mapUrl = DZFMap;
                height = 516;
                width = 414;
                break;
            case 9:
                title = "小竹峰地图";
                mapUrl = XZFMap;
                height = 517;
                width = 414;
                break;
            case 12:
                title = "七里峒地图";
                mapUrl = QLTMap;
                height = 386;
                width = 516;
                break;
            case 13:
                title = "青云后山地图";
                mapUrl = QYHSMap;
                height = 372;
                width = 515;
                break;
            case 14:
                title = "合欢派门派地图";
                mapUrl = HHPMPMap;
                height = 434;
                width = 515;
                break;
            case 15:
                title = "焚香谷大殿";
                mapUrl = FXGDD;
                height = 771;
                width = 1030;
                break;
            case 16:
                title = "青云山门派地图";
                mapUrl = QYSMPMap;
                height = 386;
                width = 515;
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
                <Card style={{ marginTop: 160, display: 'inline-block', width: 1000 }}>
                    <div className='cardHeader'>
                        <span style={ {marginLeft: 24, userSelect: 'none'} }>您的位置：</span>
                        <TopBreadcrumb path={ pathname } />
                    </div>
                    <div style={ {width: 850} }>
                        <div style={ {display: 'inline-block', userSelect: 'none', transform: 'translateY(5px)'} }>输入灯谜描述的关键字，即可快速查找寻访NPC名字及其位置：</div>
                        <div style={ {display: 'inline-block', width: 350} }>
                            <Search placeholder="请输入寻访描述..." onSearch={ (search) => { this.getList(search) } } enterButton />
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
                                    this.setState({ openMap: true, address: row.address, flag: Number(row.flag)});
                                }
                            }
                        }
                        }
                        style={ tableStyle }
                        pagination={ false }
                    />
                </Card>
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
        );
    }
}
 
export default withRouter(DengMi);