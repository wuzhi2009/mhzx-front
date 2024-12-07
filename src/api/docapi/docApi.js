import { get, post } from "../../utils/reqUtil";

/**
 * 获取文章详情 
 * 
 * @param {*} docId 文章id
 * @returns 
 */
export function getDoc(docId) {
    return get(`/doc/${docId}`);
}

export function getList() {
    return get("/doc/list");
}

export function add(text) {
    return post("/doc/add", {title: text});
}

/**
 * 获取导航栏
 * 
 * @param {*} path 当前路由地址
 */
export function breadcrumbMap(path) {
    return get(`/doc/breadcrumb-map?path=${path}`);
}

/**
 * 获取科举题目
 * @param {*} title 
 * @param {*} flag 
 * @returns 
 */
export function getKeJuTiMu(title, flag) {
    return get(`/doc/getkejutimu?title=${title}&flag=${flag}`);
}
