import { get, getCookie, post } from "../../utils/reqUtil";

/**
 * 图形验证码uuid的cookieKey
 */
const yanZhengMaKey = "yanZhengMa";

/**
 * token头
 */
export const tokenKopf = "Admin-Token";

/**
 * 获取首页选择菜单
 * 
 * @author wuzhi
 * @returns data:[title: "", list: []]
 */
export function getIndexMenu() {
    return get(`/getMenu`);
}

/**
 * 获取图形验证码
 */
export async function getImgCode() {
    var img = "";
    await get("/auth/code").then(res => {
        if (res.data.code === 200) {
            // 将uuid存到cookie
            document.cookie=`${yanZhengMaKey}=${res.data.data.uuid}`;
            img = res.data.data.img;
        }
    })
    return img;
}

/**
 * 账号密码登录
 */
export async function passwordLogin(username, password, code) {
    // 获取验证码
    var uuid = getCookie(yanZhengMaKey);
    var info = {
        clientId: 'mhzxgonglveForWUZHI',
        grantType: 'password',
        code,
        uuid,
        username,
        password
    }
    var ok = false;
    await post("/auth/login", info).then(res => {
        if (res.data.code === 200) {
            // token放到cookie中 网页端token过期时间为7天
            // 获取当前日期
            var currentDate = new Date();
            // 获取七天后的日期
            var targetDate = new Date();
            targetDate.setDate(currentDate.getDate() + 7);
            document.cookie=`${tokenKopf}=${res.data.data.access_token}; expires=${targetDate.toDateString()}`;
            // 图形验证码的uuid删掉
            document.cookie=`${yanZhengMaKey}=""; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            ok = true;
        }
    });
    return ok;
}

/**
 * 获取邮箱验证码
 */
export function getEmailCode(email) {
    return get(`/resource/email/code?email=${email}`);
}

/**
 * 注册
 * 
 * @param {*} username 用户名
 * @param {*} password 密码
 * @param {*} email 邮箱
 * @param {*} code 邮箱验证码
 */
export function zuCe(username, password, email, code) {
    var info = {
        username,
        password,
        email,
        code,
        userType: "sys_user",
        grantType: "password",
        clientId: "mhzxgonglveForWUZHI"
    };
    return post("/auth/register", info);
}