import { Card, List } from 'antd';
import { withRouter } from '../utils/withRouter';
import React, { Component } from 'react';
import { getDoc, getList } from '../api/docapi/docApi';
import { Link } from 'react-router-dom';
import TopBreadcrumb from '../components/TopBreadcrumb';
const cardStyle = {
    marginTop: 180,
    width: 780,
    display: 'inline-block',
    minHeight: 800,
    backgroundColor: '#E2E2E2'
}
/**
 * 文章页面
 * 
 * @author wuzhi
 * @param docId 访问文章id
 */
class Doc extends Component {
    state = { data: {}, list: [] }
    shuaXin = (docId) => {
        const { navigate } = this.props.router;
        if (docId) {
            getDoc(docId).then(res => {
                if (res.data.code === 200) {
                    this.setState({data: res.data.data});
                } else {
                    // 搜索了不存在或不予公示的文章
                    navigate("/index");
                }
            })
            getList().then(res => {
                if (res.data.code === 200) {
                    this.setState({list: res.data.data});
                }
            })
        }
    }
    componentDidMount() {
        const { params } = this.props.router;
        const docId = params.docId;
        this.shuaXin(docId);
    }
    componentDidUpdate(oldProps, oldState) {
        const { params } = this.props.router;
        const docId = params.docId;
        var oldDocId = oldProps.router.params.docId;
        if (docId !== oldDocId) {
            // 文章id发生改变 说明选择了别的文章 需要重新加载页面
            this.shuaXin(docId);
        }
    }
    render() {
        const { data, list } = this.state;
        const { navigate, location } = this.props.router;
        const pathname = location.pathname;
        return (
            <>
                <Card style={ cardStyle }>
                    <div className='cardHeader'>
                        <span style={ {marginLeft: 24, userSelect: 'none'} }>您的位置：</span>
                        <TopBreadcrumb path={ pathname } />
                    </div>
                    <div style={ {borderBottom: '1px solid black'} }>
                        <h1 style={ {textAlign: 'center'} }>{ data.title }</h1>
                        <div style={ {textAlign: 'right'} }>
                            发布时间：<span style={ {fontWeight: 700, marginRight: 13} }>{ data.createTime }</span> 
                            发布者：<span> { data.nickName } </span></div>  
                    </div>
                    <div dangerouslySetInnerHTML={ {__html: data.content} } style={ {maxWidth: 1000} } />
                </Card>
                <Card style={ {display: 'inline-block', verticalAlign: 'top', margin: '310px 0 0 10px'} }>
                <List
                    size="large"
                    header={<div style={ {userSelect: 'none'} }>推荐攻略</div>}
                    bordered
                    dataSource={ list }
                    renderItem={ (item) => (
                        <List.Item>
                            <Link
                                onClick={ () => {navigate(`/doc/${item.docId}`)} }
                                style={ {userSelect: 'none'} }
                            >
                                { item.title }
                            </Link>
                        </List.Item>
                        ) }
                    />
                </Card>
            </>
        )
    }
}

export default withRouter(Doc);