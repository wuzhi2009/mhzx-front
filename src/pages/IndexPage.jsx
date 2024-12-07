import React, { Component } from 'react';
import { getIndexMenu } from '../api/appapi/appapi';
import ChooseCard from '../components/ChooseCard';

/**
 * 主页
 * 
 * @author wuzhi
 */
class IndexPage extends Component {
    state = { data: [] }
    componentDidMount() {
        getIndexMenu().then(res => {
          if (res.data.code === 200) {
            this.setState({data: res.data.data})
          }
        })
      }
    render() {
        const { data } = this.state;
        return (
            <div style={ {marginTop: 350} }>
                { data.map((item, key) => {
              return (
                <ChooseCard data={ item.list } title={ item.title } key={ key } />
              )
            }) }
            </div>
        )
    }
}

export default IndexPage;