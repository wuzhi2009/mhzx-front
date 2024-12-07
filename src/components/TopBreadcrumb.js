import { Breadcrumb } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { breadcrumbMap } from '../api/docapi/docApi';
const style = {
    display: 'inline-block', 
    userSelect: 'none',
    transform: 'translateY(1px)'
}
/**
 * 文章头部导航栏
 * 
 * @author wuzhi
 * @param path 路由地址
 */
export default class TopBreadcrumb extends Component {
    state = { list:[] }
    getList = () => {
        const { path } = this.props;
        breadcrumbMap(path).then(res => {
            if (res.data.code === 200) {
                var list = res.data.data;
                this.setState({list});
            }
        })
    }
    componentDidMount() {
        this.getList();
    }
    componentDidUpdate(oldProps) {
        const { path } = this.props;
        var oldPath = oldProps.path;
        if (path !== oldPath) {
            this.getList();
        }
    }
    render() {
        const { list } = this.state;
        const { path } = this.props;
        return (
            <Breadcrumb style={ style } 
                items={ list.map((item, key) => {
                    var url = "";
                    if (item === "首页") {
                        url = "/index";
                    } else {
                        url = path;
                    }
                    return { title: <Link to={ url } key={ key }>
                        <span style={ {color: '#fff', fontSize: 15} }>
                            { item }
                        </span>
                    </Link> }
                }) }
            />
        )
    }
}
