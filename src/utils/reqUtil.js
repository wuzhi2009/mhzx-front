// 引入axios
import axios from 'axios';
import { notification } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons'
import { aesEncrypt } from './AesUtil';
import { rsaEncrypt } from './RsaUtil';
export const baseUrl = '/app/api';
// export const baseUrl = '';
// 创建axios实例
const httpService = axios.create({
  // url前缀-'http:xxx.xxx'
  // baseURL: process.env.BASE_API, // 需自定义
  baseURL:baseUrl
  // 请求超时时间
  // timeout: 20000 // 需自定义
});
// 防止短时间重复请求
var requests = new Map();
/**
 * 获取cookie
 * 
 * @param {*} cookieName cookie的key
 * @returns value
 */
const getCookieValue = (cookieName) => {
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookiePair = cookieArray[i].split('=');
    const key = cookiePair[0].trim();
    if (key === cookieName) {
      return cookiePair[1];
    }
  }
  return null;
};

//添加请求和响应拦截器
// 添加请求拦截器
httpService.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config.headers.token=window.sessionStorage.getItem('token');
  // get请求url中会携带参数 这里需要进行删掉
  var url = config.url;
  if (config.url.indexOf("?") !== -1) {
    url = config.url.slice(0, config.url.indexOf("?"));
  }
  var oldControl = requests.get(url + config.method)
  // 判断是否有请求未处理
  if (oldControl) {
    // 存在 取消上一次请求
      oldControl.abort();
      requests.delete(url + config.method);
  }
  const control = new AbortController();
  config.signal = control.signal;
  // 添加本次的请求
  requests.set(url + config.method, control);
  const token = getCookieValue("Admin-Token");
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.clientid = "mhzxgonglveForWUZHI";
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
httpService.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // get请求url中会携带参数 这里需要进行删掉
  var url = response.config.url;
  if (response.config.url.indexOf("?") !== -1) {
    url = response.config.url.slice(0, response.config.url.indexOf("?"));
  }
  // 删掉请求请求map
  requests.delete(url + response.config.method);
  if (response.data.code === 500) {
    // 抽屉弹窗 业务报错
    notification.open({
      message: '系统错误',
      description: response.data.msg,
      icon:<CloseCircleTwoTone twoToneColor="red" />,
      maxCount:3
    });
  }
  if (response.data.code === 401) {
    // 删除token 验证过期
    document.cookie="Admin-Token=''; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (!(window.location.pathname === "/login" || window.location.pathname === "/zhu-ce")) {
      window.location.href = "/login";
    }
  }
  if (response.status === 404) {
    notification.open({
      message: '服务器找不到',
      description:
        "接口404错误 请联系管理员！！",
      icon:<CloseCircleTwoTone twoToneColor="red" />,
      maxCount:3
    });
  } else if (response.data.code === 404) {
    notification.open({
      message: '您所访问的文章找不到',
      description:
        "您所访问的文章不存在，请查看别的文章！！",
      icon:<CloseCircleTwoTone twoToneColor="red" />,
      maxCount:3
    });
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 抽屉弹框
  if (error.response && error.response.code === 401) {
    notification.open({
        message: '登录失效',
        description:
          "系统接口401异常！！",
        icon:<CloseCircleTwoTone twoToneColor="red" />,
        maxCount:3
      });
      document.cookie="Admin-Token=''; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    /* if (window.location.pathname !== "/login") {
      // 权限已过期 删除token缓存
      document.cookie="Admin-Token=''; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    } */
  }
  if (error.response && error.response.status === 500) {
    notification.open({
      message: '系统错误',
      description:
        "系统错误，请联系管理员！！",
      icon:<CloseCircleTwoTone twoToneColor="red" />,
      maxCount:3
    });
  }
  error.data={code: 500, msg:"系统错误！！", data:{code: 500}}
  return error
});

/**
 * 缓存
 */
const cache = {};
function getCache(url) {
  return cache[url] || null;
}

/*网络请求部分*/

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url) {
  return new Promise((resolve, reject) => {
    // 用户数据缓存
    if (url === "/system/user/getInfo") {
      const cacheData = getCache(url);
      if (cacheData) {
        return resolve(cacheData);
      }
    }
    httpService({
      url: url,
      method: 'get',
    }).then(response => {
      // if (url === "/sp/monitoring/getDeptList") {
      //   cache[url] = response;
      // }
      if (url === "/system/user/getInfo") {
        cache[url] = response;
      }
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/**
 * 获取随机字符串
 * 
 * @param {*} length 
 * @returns 
 */
export function generateRandomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
  var key = generateRandomString(32);
  var newParams = "";
  if (params instanceof Object) {
    newParams = aesEncrypt(JSON.stringify(params), key);
  } else {
    newParams = aesEncrypt(params, key);
  }
  // 对密钥进行rsa加密
  var encryptKey = rsaEncrypt(key);
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: newParams,
      headers: {
        "encrypt-key": encryptKey,
        "isEncrypt": true,
        "Content-Type": "application/json"
      },
      transformRequest: function transformRequest(data, headers) {
        var jsonData = JSON.stringify(data);
        return jsonData.substring(1, jsonData.length - 1);
      }
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

export function put(url, params = {}) {
  var key = generateRandomString(32);
  var newParams = "";
  if (params instanceof Object) {
    newParams = aesEncrypt(JSON.stringify(params), key);
  } else {
    newParams = aesEncrypt(params, key);
  }
  // 对密钥进行rsa加密
  var encryptKey = rsaEncrypt(key);
  return new Promise((resolve, reject) => {
    // 判断是否更新了个人数据 如果更新了则删除缓存
    if (url === "/system/user/change-user-info") {
      cache["/system/user/getInfo"] = undefined;
    }
    httpService({
      url: url,
      method: 'put',
      data: newParams,
      headers: {
        "encrypt-key": encryptKey,
        "isEncrypt": true,
        "Content-Type": "application/json"
      },
      transformRequest: function transformRequest(data, headers) {
        var jsonData = JSON.stringify(data);
        return jsonData.substring(1, jsonData.length - 1);
      }
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/**
 * excel下载 get
 * 
 * @param {*} url 
 * @returns 
 */
export function excelExport(url) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'get',
      responseType: 'blob'
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/**
 * excel下载 post
 * 
 * @param {*} url 
 * @returns 
 */
export function excelExportPost(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params,
      responseType: 'blob'
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

export function getCookie(cookieKey) {
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookiePair = cookieArray[i].split('=');
    const key = cookiePair[0].trim();
    if (key === cookieKey) {
      return cookiePair[1];
    }
  }
  return null;
}

export function getBaseUrl(url, params = {}) {
  return baseUrl;
}
const req = {get, post, put, fileUpload, getBaseUrl, excelExport, excelExportPost, getCookie};
export default req;