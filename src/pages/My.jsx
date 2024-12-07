import { Card, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import { getInfo } from '../api/myapi/myApi';
import { withRouter } from '../utils/withRouter';
import { UserOutlined, CommentOutlined, MailOutlined } from '@ant-design/icons';
const itemNames = [
{name: "个人资料", icon: <UserOutlined />, path: "/my/user"},
{name: "公告信息", icon: <MailOutlined />, path: "/my/info"},
{name: "好友", icon: <CommentOutlined />, path: "/my/freund"}
];
const items = itemNames.map((item) => ({
    key: item.path,
    label: item.name,
    icon: item.icon
}));

/**
 * 个人中心页面
 * 
 * @author wuzhi
 */
class My extends Component {
    state = { user: {} } 
    componentDidMount() {
        getInfo().then(res => {
            if (res.data.code === 200) {
                this.setState(res.data.data.user);
            }
        })
    }
    render() { 
        const { router } = this.props;
        var pathname = router.location.pathname;
        return (
                <Layout style={ {width: 1000, height: 1000, marginTop: 40} }>
                <Header
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    }}
                >
                    <div className="demo-logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={ [pathname] }
                        items={ items }
                        style={{
                            flex: 1,
                            minWidth: 0
                        }}
                        onClick={ (item) => {
                            const { navigate } = router;
                            navigate(item.key);
                        } }
                    />
                </Header>
                <Content>
                    <div
                    style={{
                        height: 900
                    }}
                    >
                    <Card style={ {width: 1000, height: 940, boxShadow: '2px 5px 10px #303643', backgroundColor: "#EEEEEE"} }>
                    <Outlet />
                    </Card>
                    </div>
                </Content>
                </Layout>
        );
    }
}
 
export default withRouter(My);