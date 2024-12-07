import { Button, Card, Col, Form, Input, Row } from 'antd';
import { UserOutlined, LockOutlined, BarcodeOutlined, MailOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { withRouter } from '../utils/withRouter';
import { getEmailCode, zuCe } from '../api/appapi/appapi';
/**
 * 注册页面
 * 
 * @author
 */
class ZhuCe extends Component {
    formRef = React.createRef();
    state = { daoJiShi: 60, buttonStatus: false }
    render() {
        const { navigate } = this.props.router;
        const { buttonStatus, daoJiShi } = this.state;
        var newDaoJiShi = daoJiShi;
        return (
            <div style={ { position: 'relative', top: '25vh', minWidth: 1300, height: 300, background: '#08228D', userSelect: 'none' } }>
                <div style={ { color: 'white', fontWeight: 800, fontSize: 35, padding: '80px 0px 0px 160px', fontFamily: '微软雅黑' } }>
                    梦幻诛仙攻略系统
                    <div style={ { fontSize: 18, paddingLeft: 30, paddingTop: 50 } }>开发者：伊甸佳苑-小狐狸</div>
                    <div style={ { fontSize: 18, paddingLeft: 60, paddingTop: 10 } }>帮派：東方丶神啟</div>
                </div>
                <Card style={ { width: 460, height: 550, position: 'absolute', right: 200, top: -100, border: '1px solid #6C6C6C' } }>
                    <div style={ { fontSize: 40, fontWeight: 600, textAlign: 'center' } }>账号注册</div>
                    <Form
                        name="zhuCe"
                        initialValues={{
                            remember: false,
                        }}
                        style={{
                            maxWidth: 360,
                            marginLeft: 25,
                            marginTop: 30
                        }}
                        ref={ this.formRef }
                        onFinish={(values) => {
                            const { username, password, email, code } = values;
                            zuCe(username, password, email, code).then(res => {
                                if (res.data.code === 200) {
                                    // 注册成功 删掉缓存token 进入登录页面
                                    document.cookie="Admin-Token=''; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                    navigate("/login");
                                }
                            })
                        }}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
                        </Form.Item>
                        <Form.Item
                            name="toPassword"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入重复密码!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不正确'));
                                    }
                                })
                            ]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="重复密码" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: '请输入正确的邮箱!',
                                },
                                {
                                    required: true,
                                    message: '请输入邮箱!',
                                },
                            ]}
                        >
                            <Input prefix={<MailOutlined />}  placeholder="邮箱" onChange={ (value) => {this.setState({email: value.target.value})} } />
                        </Form.Item>
                        <Form.Item
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码!',
                                },
                            ]}>
                                <Row>
                                    <Col span={ 12 }>
                                        <Input  placeholder='验证码' prefix={ <BarcodeOutlined /> } />
                                    </Col>
                                    <Col span={ 4 } offset={ 3 }>
                                        <Button disabled={ buttonStatus } onClick={ async() => {
                                            var values = {};
                                            try {
                                                values = await this.formRef.current.validateFields(); 
                                            } catch (error) {
                                                // 验证不通过
                                                var errorFields = error.errorFields;
                                                // 清除表单的验证提示
                                                this.formRef.current.setFields([{name: "code", errors: null}]);
                                                if (!(errorFields.length === 1 && errorFields[0].name[0] === "code")) {
                                                    // 当且仅当只有验证码没填的时候通过验证
                                                    return;
                                                }
                                                values.email = error.values.email;
                                            }
                                            getEmailCode(values.email).then(res => {
                                                if (res.data.code === 200) {
                                                    this.setState({buttonStatus: true, daoJiShi: 59});
                                                    // 倒计时
                                                    var interval = setInterval(() => {
                                                        if (newDaoJiShi > 0) {
                                                            newDaoJiShi = newDaoJiShi - 1;
                                                            this.setState({ daoJiShi: newDaoJiShi });
                                                        } else {
                                                            this.setState({buttonStatus: false, daoJiShi: 60});
                                                            clearInterval(interval);
                                                        }
                                                    }, 1000);
                                                }
                                            })
                                            } }>
                                            { daoJiShi === 60 ? "点击获取验证码" : `等待${daoJiShi}秒` }
                                        </Button>
                                    </Col>
                                </Row>
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit" style={ {height: 45} }>
                                注  册
                            </Button>
                            <Button onClick={ () => {navigate("/login")} } block style={ {marginTop: 20, height: 45} }>
                                已经注册了？
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default withRouter(ZhuCe);