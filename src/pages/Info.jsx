import React, { Component } from 'react';
import { allYiDu, gongGaoList } from '../api/myapi/myApi';
import GongGaoCard from '../components/GongGaoCard';
import { MailOutlined } from '@ant-design/icons';
import { message, Popconfirm } from 'antd';

/**
 * 消息页
 * 
 * @author wuzhi
 */
class Info extends Component {
    scrollContainerRef = React.createRef();
    state = { data:[], page: 1, pageSize: 2, ok: false } 
    componentDidMount() {
        gongGaoList(1, 5).then(res => {
            if (res.data.code === 200) {
                this.setState({data: res.data.data});
            }
        });
        const container = this.scrollContainerRef.current;
        const f = () => {
            const { scrollHeight, scrollTop, clientHeight } = container;
            if (scrollHeight - (scrollTop + clientHeight) < 1) {
                // 滚动条触底
                const { data, page, ok } = this.state;
                if (!ok) {
                    // 公告未获取完 可以继续获取
                    gongGaoList(page + 1, 5).then(res => {
                        if (res.data.code === 200) {
                            if (res.data.data.length > 0) {
                                // 只有取到数据才更新
                                this.setState({data: [...data, ...res.data.data], page: page + 1});
                            } else {
                                // 取不到数据了 增加标识
                                this.setState({ok: true});
                            }
                        }
                    })  
                } 
            } 
        }
        container.addEventListener("scroll", f);
    }
    /**
     * 全部已读
     */
    yiDu = () => {
        allYiDu().then(res => {
            if (res.data.code === 200) {
                message.success(res.data.msg);
                // 将现有的list修改为已读
                const { data } = this.state;
                data.forEach(item => {
                    item.sehenFlag = "已读";
                })
            }
        })
    }
    render() { 
        const { data } = this.state;
        return (
            <>
                <h1 style={ {textAlign: "center", userSelect: "none"} }>公告信息</h1>
                <Popconfirm 
                    title="提示"
                    description="您确定要将全部未读公告设为已读吗？"
                    onConfirm={(e) => {this.yiDu()}}
                    onCancel={(e) => {}}
                    okText="确定"
                    cancelText="取消">
                    <div style={ {position: "absolute", right: 40, userSelect: "none", cursor: "pointer"} }>
                        <MailOutlined style={ {marginRight: 5} } />全部已读
                    </div>   
                </Popconfirm>
                <div style={ {marginTop: 30, overflow: "auto", height: 810} } ref={ this.scrollContainerRef }>
                    <GongGaoCard data={ data } />
                </div>
            </>
        );
    }
}
 
export default Info;