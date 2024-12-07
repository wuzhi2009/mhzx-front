import { Card } from "antd";
import React, { Component } from "react";
import { withRouter } from "../utils/withRouter";
const cardStyle = {
    width: 1041,
    marginTop: 40,
    boxShadow: '2px 5px 10px #303643'
}
/**
 * 每个单元格样式
 */
const gridStyle = {
    position: 'relative',
    width: 260,
    height: 65,
    textAlign: 'center',
    cursor: 'pointer'
};
/**
 * 图片样式
 */
const imgStyle = {
    position: 'absolute',
    left: 7,
    top: 16,
    width: 40,
    height: 40
};
/**
 * 文字样式
 */
const textStyle = {
    userSelect: 'none',
    position: 'absolute',
    left: 90
};
/**
 * 标题样式
 */
const titleStyle = {
    fontSize: 18,
    userSelect: 'none'
};
/**
 * 卡片选择
 * 
 * @author wuzhi
 * @param data 数据数组 [{iconUrl, text, url}]
 * @param title 标题
 * @param key 标识
 */
class ChooseCard extends Component {
    state = {}
    render() {
        const { data, title, key } = this.props;
        const { navigate } = this.props.router;
        return (
            <Card style={ cardStyle } title={ <div style={ titleStyle }>{ title }</div> } key={ key }>
                { data.map((item, key) => {
                    return (
                        <Card.Grid style={ gridStyle } onClick={ () => {navigate(item.url)} } key={ key }>
                            <img alt="" src={ item.iconUrl } style={ imgStyle } />
                            <span style={ textStyle }>{ item.text }</span>
                        </Card.Grid>   
                    )
                }) }
            </Card>
        )
    }
}

export default withRouter(ChooseCard);