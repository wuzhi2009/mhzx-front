import React, { Component } from 'react';

/**
 * 跑商任务地图
 * 
 * @author wuzhi
 * @param mapRef
 * @param width
 * @param height
 * @param address 标注地点
 */
class FundMap extends Component {
    canvasRef = React.createRef();
    state = { ok: false }
    // 绘制圆点和文字
    pic2 = () => {
        const { mapRef, address } = this.props;
        var canvas = this.canvasRef.current;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(mapRef.current, 0, 0); 
        var x = -1;
        var y = -1;
        if (address && address.startsWith("(")) {
            var index = address.substring(1, address.length - 1).split(",");
            x = index[0];
            y = index[1];
        }
        if (x !== -1 || y !== -1 ) {
            // 绘制圆点
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            // 提示文字
            ctx.font = "28px 楷体";
            ctx.fillStyle = "white";
            if (Number(x) + 150 > canvas.width) {
                x = x - 150;
                ctx.fillText("在此处哦=>", x, Number(y) + 10);
            } else {
                ctx.fillText("<=在此处哦", x, Number(y) + 10);
            }
        }
    }
    pic = () => {
        const { mapRef } = this.props;
        const { ok } = this.state;
        if (ok) {
            this.pic2();
        }
        mapRef.current.onload = () => {
            // 第一次需要等待加载
            this.pic2();
            this.setState({ok: true});
        }
    }
    componentDidMount() {
        this.pic();
    }
    componentDidUpdate(oldProps) {
        const { address } = this.props;
        if (address !== oldProps.address) {
            this.pic();
        }
    }
    render() {
        const { height, width } = this.props;
        return (
            <canvas ref={ this.canvasRef } height={ height } width={ width } />
        )
    }
}

export default FundMap;