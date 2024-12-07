import { Card, message } from 'antd';
import React, { Component } from 'react';
import { getGongGao } from '../api/myapi/myApi';

/**
 * 公告组件
 * 
 * @author wuzhi
 * @param data[] [{name 发布人 content 内容 title 标题 type 类型 sehenFlag 已读 未读}]
 */
class GongGaoCard extends Component {
    state = { weiDuIds: [] } 
    componentDidUpdate(oldProps) {
        // 获取未读的id
        const { data } = this.props;
        if (JSON.stringify(data) !== JSON.stringify(oldProps.data)) {
            var dasData = data.filter(item => item.sehenFlag === "未读");
            var weiDuIds = dasData.map(item => item.id);
            this.setState({weiDuIds});  
        }
    }
    render() { 
        const { data } = this.props;
        const { weiDuIds } = this.state;
        data.reduce((prev, cur, index, arr) => {
            if (prev && prev === cur.createTime) {
                // 时间相同 清除后一个的时间
                delete arr[index].createTime;
            }
            return cur.createTime;
        }, "2024-10-01");
        return (
            <>
            {
                data.map((item, key) => {
                    var createTime = "";
                    if (item.createTime) {
                        // 格式化时间
                        var time = new Date(item.createTime);
                        var now = new Date();
                        var year = time.getFullYear();
                        var date = time.getDate();
                        var month = time.getMonth();
                        if (year === now.getFullYear()) {
                            // 今年的公告 不做年份显示
                            year = "";
                        }
                        if (month === now.getMonth() && date === now.getDate()) {
                            // 今天的公告 不做日期显示
                            date = "";
                        }
                        createTime = `${year ? year + "年" : ""}
                            ${date ? (time.getMonth() + 1).toString().padStart(2, "0") + "月" + time.getDate().toString().padStart(2, "0") + "日" : ""}
                            ${time.getHours().toString().padStart(2, "0")}:
                            ${time.getMinutes().toString().padStart(2, "0")}`;
                    }
                   
                    return (
                        <div key={ key } style={ {userSelect: "none"} }>
                            <div style={ {textAlign: "center"} }>{ createTime ? createTime : "" }</div>
                            <Card 
                                style={ {width: "80%", margin: "auto", marginTop: 5} } 
                                title={ item.title }
                                actions={ [<div onClick={() => {
                                    if (item.sehenFlag !== "未读") {
                                        // 非未读
                                        return;
                                    }
                                    getGongGao(item.id).then(res => {
                                    if (res.data.code === 200) {
                                        message.success("标记为已读成功！！");
                                        // 不刷新页面 直接做已读显示
                                        var dasWeiDuIds = weiDuIds.filter(weiDuId => weiDuId !== item.id);
                                        this.setState({weiDuIds: dasWeiDuIds});
                                    }
                                })}}>标记为已读</div>] }>
                                { weiDuIds.includes(item.id) ? <div style={ {width: 15, height: 15, backgroundColor: "red", position: "absolute", top: -5, right: -5, borderRadius: 7} }></div> : <></>}
                                <div>{ item.content }</div>
                                <div style={ {fontSize: 11, float: "right"} }>发布人：{ item.name }</div>
                            </Card>
                        </div>
                    )
                })
            }
            </>
            
        );
    }
}
 
export default GongGaoCard;