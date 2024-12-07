import React, { Component } from 'react';
import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import { Button, Card } from 'antd';
import { add } from '../api/docapi/docApi';
class Admin extends Component {
    state = { v: "" }
    render() {
        const { v } = this.state;
        return (
            <Card>
                <ReactQuill modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike'],        // 加粗，斜体，下划线，删除线
                                    ['blockquote', 'code-block'],                     // 引用，代码块
                                    [{ 'header': 1 }, { 'header': 2 }],               // 标题
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // 有序列表，无序列表
                                    [{ 'script': 'sub' }, { 'script': 'super' }],      // 下标，上标
                                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // 缩进
                                    [{ 'direction': 'rtl' }],                          // 文本方向
                                    [{ 'size': ['small', false, 'large', 'huge'] }],   // 字体大小
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         // 标题
                                    [{ 'color': [] }, { 'background': [] }],           // 字体颜色，背景颜色
                                    [{ 'font': [] }],                                  // 字体
                                    [{ 'align': [] }],                                 // 对齐方式
                                    ['clean'],                                         // 清除格式
                                    ['link', 'image', 'video']                         // 链接，图片，视频
                                  ],
                            }} style={ {height: 860, width: 800} } onChange={ (v) => {this.setState({v})} } />
                            <Button onClick={() => {add(v)}} >文字</Button>
            </Card>
        );
    }
}
export default Admin;