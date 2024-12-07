import { Button, Checkbox, Col, Flex, Form, Input, Row } from 'antd';
import React, { Component } from 'react';
import { UserOutlined, LockOutlined, BarcodeOutlined } from '@ant-design/icons';
import { getImgCode, passwordLogin, tokenKopf } from '../api/appapi/appapi';
import { withRouter } from '../utils/withRouter';
import { getCookie } from '../utils/reqUtil';
import { Link } from 'react-router-dom';
/**
 * 登录界面
 * 
 * @author wuzhi
 */
class Login extends Component {
    state = { remember: false, yanZhengMa: "" } 

    async componentDidMount() {
        // 获取token
        var token = getCookie(tokenKopf);
        var yanZhengMa = "";
        if (!token) {
            yanZhengMa = await getImgCode();
        }
        this.setState({yanZhengMa: yanZhengMa ? yanZhengMa : 1});
    }

    componentDidUpdate() {
        const { navigate } = this.props.router;
        var token = getCookie(tokenKopf);
        if (token) {
            // 假如token存在直接跳转
            navigate("/index");
        }
    }
    render() { 
        const { remember, yanZhengMa } = this.state;
        return (
            <div className='Login'>
                <h1 style={ {textAlign: 'center', marginTop: 40, userSelect: 'none', fontFamily: '微软雅黑'} }>账号登录</h1>
                <div className='LoginForm'>
                    <Form
                        name="login"
                        initialValues={{
                            remember: remember,
                        }}
                        style={{
                            maxWidth: 360,
                        }}
                        onFinish={ async(values) => { 
                            const { username, password, code } = values; 
                            if (await passwordLogin(username, password, code)) {
                                // 登录成功 刷新页面
                                window.location.reload();
                            }
                        } }
                        >
                        <Form.Item
                            name="username"
                            rules={[
                            {
                                required: true,
                                message: '请输入你的用户名!',
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
                                message: '请输入你的密码！',
                            },
                            ]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
                        </Form.Item>
                        <Form.Item
                            name="code"
                            rules={[
                            {
                                required: true,
                                message: '请输入验证码！',
                            }
                            ]}>
                            <Row align="middle">
                            <Col span={ 10 }>
                            <Input  placeholder='验证码' prefix={ <BarcodeOutlined /> } />
                            </Col>
                            <Col span={ 8 } offset={ 5 }>
                            <img  style={ {cursor: 'pointer'} } src={ yanZhengMa ? `data:image/png;base64,${yanZhengMa}` : "" } alt="看不清楚？" width={ 110 } height={ 50 } onClick={ async() => {
                                // 重新获取验证码
                                var yanZhengMa = await getImgCode();
                                this.setState({yanZhengMa});
                            } } />
                            </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox onChange={ (e) => { this.setState({remember: e.target.checked})} }>记住账号</Checkbox>
                            </Form.Item>
                            <Link to="/zhu-ce">注册账号</Link>
                            </Flex>
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit" >
                                登 录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                
            </div>
        );
    }
}
 
export default withRouter(Login);