import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/all.css';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCn from 'antd/locale/zh_CN';
import routers from './utils/router';
import './css/app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCn}>
    <RouterProvider router={routers} />
  </ConfigProvider>
);
