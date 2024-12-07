import { AutoComplete, Button, Card } from 'antd';
import React, { Component } from 'react';
import { getKeJuTiMu } from '../api/docapi/docApi';
import TopBreadcrumb from '../components/TopBreadcrumb';
import { withRouter } from '../utils/withRouter';

/**
 * 科举页面
 * 
 * @author wuzhi
 * @param type 乡试 xiangshi 会试 huishi 殿试 dianshi
 */
class KeJu extends Component {
    state = { data:[{title: '', content: ''}], searchWord: '' } 
    getTiMu = () => {
        // const { type } = this.props;
        const { searchWord } = this.state;
        getKeJuTiMu(searchWord, '').then(res => {
            if (res.data.code === 200) {
                this.setState({data: res.data.data});
            }
        })
    }
    componentDidMount() {
        this.getTiMu();
    }
    componentDidUpdate(oldProps, oldState) {
        // const { searchWord } = this.state;
        // const oldSearchWord = oldState.searchWord;
        // if (searchWord !== oldSearchWord) {
        //     this.getTiMu();
        // }
    }
    render() { 
        const { data, searchWord } = this.state;
        const { params, location } = this.props.router;
        const type = params.type;
        const pathname = location.pathname;
        var name = "";
        switch (type) {
            case "xiangshi":
                name = "乡试";
                break;
            case "huishi":
                name = "会试";
                break;
            case "dianshi":
                name = "殿试";
                break;
            default:
                break;
        }
        
        var options = [];
        if (data.length > 1) {
            // 去除重复
            var newData = data.map(item => item.title);
            newData = Array.from(new Set(newData));
            options = newData.map(item => { return {label: item, value: item} });
        }
        return (
            <>
                <Card className='KeJu' style={ {width: 1000, minHeight: 800} }>
                    <div className='cardHeader'>
                        <span style={ {marginLeft: 24, userSelect: 'none'} }>您的位置：</span>
                        <TopBreadcrumb path={ pathname } />
                    </div>
                    <div style={ {textAlign: 'center', color: 'white', userSelect: 'none', fontSize: 40, fontWeight: 'bold'} }>{ name + "答题器" }</div>
                    <div style={ {width: 600, position: 'relative', top: 150, left: 120} }>
                    <AutoComplete
                        options={ options }
                        style={{
                            width: 490,
                            display: 'inline-block'
                        }}
                        onSelect={ (value) => { 
                            // 通过选择的一定是准确的 不再发送请求到后端 而是直接将选择的问题放到数组第一个进行显示
                            var select = data.filter(item => value === item.title)[0];
                            var newDasData = data;
                            newDasData[newDasData.length] = data[0];
                            newDasData[0] = select;
                            this.setState({searchWord: value, data: newDasData});
                        } }
                        onChange={ (value) => {this.setState({searchWord: value})} }
                        // onInputKeyDown={ (event) => { 
                        //     if (event.key === "Enter") {
                        //         // 按了回车
                        //         if (searchWord !== "") {
                        //             this.getTiMu();
                        //         } else {
                        //             this.setState({data: [{title: '请您输入查询内容再进行查询', content: '请输入您要查询的题目'}]});
                        //         }
                        //     } 
                        // } }
                        placeholder={ `请输入要搜索的${name}题目` } 
                    />
                    <Button type="primary" style={ {display: 'inline-block'} } onClick={ () => {
                            if (searchWord === '') {
                                this.setState({data: [{title: '请您输入查询内容再进行查询', content: '请输入您要查询的题目'}]});
                            } else {
                                this.getTiMu();
                            }
                        } }
                    >
                        搜 索
                    </Button>
                    </div>
                    <div className='KeJuTiMu'>
                        <div className='TiMu'> { data[0].title } </div>
                        <div className='DaAn'><span style={ {color: 'aqua'} }>答案：</span>{ data[0].content }</div>
                    </div>
                </Card>
            </>
        );
    }
}
 
export default withRouter(KeJu);