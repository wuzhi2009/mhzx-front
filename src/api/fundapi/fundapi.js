import { get } from "../../utils/reqUtil"

/**
 * 获取寻访列表
 * 
 * @author wuzhi
 * @param page 第几页
 * @param pageSize 每页几条数据
 * @param flag  1 京城寻访 2 河阳寻访 3 大王村寻访 4 南疆寻访 5 空桑山寻访
 * @param search 搜索值
 */
export function list(page, pageSize, flag, search) {
    return get(`/fund/list?page=${page}&pageSize=${pageSize}&search=${search}&flag=${flag}`);
}

export function dengMi(search) {
    return get(`/fund/zhong-qiu-deng-mi?search=${search}`);
}
