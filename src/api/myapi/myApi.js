import { get, put } from "../../utils/reqUtil";

/**
 * 获取个人信息
 * 
 * @returns 个人信息
 */
export function getInfo() {
    return get("/system/user/getInfo");
}

/**
 * 修改个人信息
 * 
 * @param {*} user 
 * @returns 
 */
export function updateUserInfo(user) {
    return put("/system/user/change-user-info", user);
}

/**
 * 退出登录
 * 
 * @returns 
 */
export function logout() {
    return get("/auth/logout");
}

/**
 * 获取未处理的消息数
 * 
 * @returns 公告未读数
 */
export function gongGaoCount() {
    return get("/my/count");
}

/**
 * 获取公告
 * @param page 第几页
 * @param pageSize 每页几条数据
 * @returns 公告数组
 */
export function gongGaoList(page, pageSize) {
    return get(`/my/getGongGao?page=${page}&pageSize=${pageSize}`);
}

/**
 * 查看公告
 * 
 * @param {*} id 公告id
 * @returns 
 */
export function getGongGao(id) {
    return get(`/my/gongGao/${id}`)
}

export function allYiDu() {
    return get("/my/all-yi-du");
}