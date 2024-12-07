import { Avatar, Badge, Dropdown, message, notification } from 'antd';
import React, { Component } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { getInfo, gongGaoCount, logout } from './api/myapi/myApi';
import { UserOutlined, ClockCircleTwoTone } from '@ant-design/icons'
import { withRouter } from './utils/withRouter';
import { getCookie } from './utils/reqUtil';
import { tokenKopf } from './api/appapi/appapi';

/**
 * 主页
 * 
 * @author wuzhi
 */
class App extends Component {
  state = { user: {}, message: [], count: 0, huoDongTitle: "", huoDongContent: "" }
  componentDidMount() {
    const { navigate } = this.props.router;
    var token = getCookie(tokenKopf);
    if (token) {
      getInfo().then(res => {
        if (res.data.code === 200) {
          this.setState({user: res.data.data.user});
          // 连接WebSocket
          // var socket = new WebSocket("http://localhost:8080/resource/websocket?token=" + token);
          var socket = new WebSocket("/ws?token=" + token);
          socket.onmessage = (e) => {
            var info = "";
            try {
              info = JSON.parse(e.data);  
            } catch (error) {
              // 报错说明是字符串不是json
              info = e.data;
            }
            // 是否是信息提醒
            if (info instanceof Object) {
              // {"code": 200, "msg": "已将所有未读信息设为已读。"}
              if (info.code && info.code === 200 && info.msg === "已将所有未读信息设为已读。") {
                gongGaoCount().then(res => {
                  if (res.data.code === 200) {
                    this.setState({count: res.data.data});
                  }
                })
              } else if (info.msg && info.msg.title) {
                const { count } = this.state;
                // 服务器给大家发送活动提醒
                notification.open({
                  message: info.msg.title,
                  description:
                    info.msg.content.length > 20 ? info.msg.content.substring(20) : info.msg.content,
                  onClick: () => {
                    // 点击公告查看详情
                    navigate("/info");
                  },
                  icon: <ClockCircleTwoTone />
                });
                // 并且更新未读消息数
                this.setState({count: count + 1});
              }
            } else {
              switch (info) {
                case "退出成功":
                  this.setState({user: {}});
                  break;
                case "修改个人信息成功":
                  getInfo().then(res => {
                    if (res.data.code === 200) {
                      this.setState({user: res.data.data.user});
                    }
                  })
                  break;
                default:
                  break;
              }
              const { message } = this.state;
              message.unshift(info);
              if (message.length > 10) {
                message.pop();
              }
              this.setState({message});
            }
            
          }
        }
      });
      // 获取未处理的消息数量
      gongGaoCount().then(res => {
        if (res.data.code === 200) {
          this.setState({count: res.data.data});
        }
      })
    }
  }
  render() {
    const { user, count } = this.state;
    const { navigate } = this.props.router;
    var avatar = <><span>登 录</span><span>注 册</span></>;
    const items = [
      {
        key: '1',
        label: (
          <Link to="/my/user">
            个人资料
          </Link>
        ),
      },
      {
        key: '2',
        label: (
            <Link to="/my/info">
              <Badge count={count > 99 ? "99+" : count} style={ {userSelect: 'none', position: 'relative', left: 0, top: 14} } >
                公告
              </Badge>
            </Link>
          
        ),
      },
      {
        key: '3',
        label: (
            <Link to="/my/freund">
              <Badge count={count > 99 ? "99+" : count} style={ {userSelect: 'none', position: 'relative', left: 0, top: 14} } >
                好友
              </Badge>
            </Link>
          
        ),
      },
      {
        key: '4',
        label: <>退出登录</>,
        onClick: () => {
          logout().then(res => {
            if (res.data.code === 200) {
              message.success(res.data.msg);
              navigate("/login");
            }
          })
        }
      }
    ];
    if (user.nickName) {
      avatar = <>
        <span style={ {userSelect: 'none', fontSize: 18, marginRight: 7} }>{ user.nickName }</span>
        <Dropdown
          menu={{
            items
          }}
          placement="bottomLeft"
        >
          <Badge count={count > 99 ? "99+" : count} style={ {userSelect: 'none', marginTop: 8} } >
            <Avatar shape="square" size={ 64 } icon={ <UserOutlined /> }  src={ user.avatar } />
          </Badge>
      </Dropdown>
      </>
    }
    return (
      <div className='all'>
        <div className='IndexHeard'>
          <div className='eins' onClick={ () => {navigate("/index")} } ></div>
          <div className='zwei'>梦幻诛仙攻略系统</div>
          <div className='drei'>{ avatar }</div>
        </div>
        <div className='Boom'>
          <div className='zwei'>
            <Outlet />
          </div>
        </div> 
        <div className='Bottom'>
          <div style={ {fontSize: 14} }>
            <div>健康游戏忠告</div>	    
            <div style={ {marginTop: -15} }><span>抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。</span><span>适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。</span></div>	   
          </div> 
          <div style={ {fontSize: 18} }>作者： 伊甸佳苑-小狐狸(wuzhi)</div>
          <div style={ {fontSize: 20, marginTop: -15} } >帮派：東方丶神啟</div>
          <div style={ {fontSize: 15, marginTop: -15} }>系统架构：前端-REACT 后端-JAVA 数据库-MYSQL 中间件-REDIS,POWERJOB 文件存储系统-MINIO 欢迎下载手机APP</div>
        </div>
      </div>
    )
  }
}

export default withRouter(App);
