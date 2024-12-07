import { Button, Col, Form, Input, message, Row, Select, Upload } from 'antd';
import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { getInfo, updateUserInfo } from '../api/myapi/myApi';
import { baseUrl, getCookie } from '../utils/reqUtil';
import { tokenKopf } from '../api/appapi/appapi';

/**
 * 个人资料页面
 * 
 * @author wuzhi
 */
class User extends Component {
    formRef = React.createRef();
    state = { user: {} }
    componentDidMount() {
        getInfo().then(res => {
            if (res.data.code === 200) {
                const { user } = res.data.data;
                this.setState({user});
                this.formRef.current.setFieldsValue({...user, avatar: null});
            }
        })
    }
    render() {
        const { user } = this.state;
        const imageUrl = user.avatar;
        return (
            <div style={ {userSelect: 'none'} }>
            <div style={ {textAlign: 'center', fontFamily: '微软雅黑', fontWeight: 'bold', fontSize: 40} }> { user.userName } </div>
                <Form
                    onValuesChange={() => { }}
                    // variant={componentVariant}
                    style={{
                        minWidth: 600
                    }}
                    ref={ this.formRef }
                    onFinish={(values) => {
                        updateUserInfo(values).then(res => {
                            if (res.data.code === 200) {
                                message.success(res.data.msg);
                            }
                        })
                    }}
                /* initialValues={{
                  variant: componentVariant,
                }} */
                >
                    <div style={{ padding: '100px 120px 0 120px' }}>
                        <Row align='middle'>
                            <Col span={10}>
                                <Form.Item
                                    label="昵称"
                                    name="nickName"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入您的昵称！！',
                                        },
                                        {
                                            max: 10,
                                            message: '请不要输入超过十个字符'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6} />
                            <Col span={6}>
                                <Form.Item 
                                    label="头像"  
                                    name="avatar" 
                                    labelCol={{ style: { marginTop: 30 } }}>
                                    <Upload 
                                        accept='.png,.jpg'
                                        action={ `${baseUrl}/resource/oss/upload` }
                                        listType="picture-card" 
                                        maxCount={ 1 }
                                        withCredentials={ true }
                                        headers= { {
                                            Authorization: `Bearer ${getCookie(tokenKopf)}`, 
                                            clientid: "mhzxgonglveForWUZHI"
                                        } }
                                        onChange={ (info) => {
                                            const { status } = info.file;
                                            if (status === 'done') {
                                                this.setState({user: {...user, avatar: info.file.response.data.url}});
                                                this.formRef.current.setFieldsValue({avatar: info.file.response.data.ossId});
                                            }
                                          }
                                        }
                                        showUploadList={ false }
                                    >
                                    { imageUrl ? (
                                        <img
                                            src={ imageUrl }
                                            alt="avatar"
                                            style={{
                                            width: '100%',
                                            }}
                                        />
                                        ) : (<button
                                            style={{
                                                border: 0,
                                                background: 'none',
                                            }}
                                            type="button"
                                        >
                                            <PlusOutlined />
                                            <div
                                                style={{
                                                    marginTop: 8,
                                                }}
                                            >
                                                上传照片
                                            </div>
                                        </button>) }
                                        
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Form.Item
                                    label="性别"
                                    name="sex"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择您的性别！！',
                                        }
                                    ]}
                                >
                                    <Select options={ 
                                        [
                                        {label: "男", value: "0"},
                                        {label: "女", value: "1"},
                                        {label: "保密", value: "2"}
                                        ]
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6} />
                            <Col span={9} >
                                <Form.Item
                                    label="邮箱"
                                    name="email"
                                    
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择您的邮箱！！',
                                        }
                                    ]}
                                >
                                    <Input disabled={ true } />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                        <Form.Item
                            label="简介"
                            name="remark"
                            style={ {marginLeft: 12, marginTop: 40} }
                        >
                            <Input.TextArea style={ {minWidth: 600, minHeight: 200} } />
                        </Form.Item>
                        </Row>
                    </div>
                    <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" style={ {width: 150, marginLeft: 150} }>
                            保 存
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default User;