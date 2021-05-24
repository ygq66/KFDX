// 引用api公共地址
import constant from './constent'
// 引用接口公共方法
import request from './request'

export function getLogin(paramsData) {
    return request({
        url: constant.getLogin,
        method: 'post',
        data: paramsData
    })
}
export function getConfig() {
    return request({
        url: constant.getConfig,
        method: 'get'
    })
}
export function layoutList(paramsData) {
    return request({
        url: constant.layoutList,
        method: 'post',
        data: paramsData
    })
}
export function Cameratotal() {
    return request({
        url: constant.Cameratotal,
        method: 'get'
    })
}
export function Treetotal(paramsData){
    return request({
        url:constant.Treetotal,
        method:'post',
        data: paramsData
    })
}
export function cameraList_S(paramsData) {
    return request({
        url: constant.cameraList_S,
        method: 'post',
        data: paramsData
    })
}
export function cameraRegion(paramsData) {
    return request({
        url: constant.cameraRegion,
        method: 'post',
        data: paramsData
    })
}
export function infoList(paramsData) {
    return request({
        url: constant.infoList,
        method: 'post',
        data: paramsData
    })
}
export function lineLista() {
    return request({
        url: constant.lineList,
        method: 'get',
    })
}
export function lineAlllist(paramsData) {
    return request({
        url: constant.lineAlllist,
        method: 'post',
        data: paramsData
    })
}
export function labelList(paramsData) {
    return request({
        url: constant.labelList,
        method: 'post',
        data: paramsData
    })
}
export function getConfig_L() {
    return request({
        url: constant.getConfig_L,
        method: 'get'
    })
}
export function buildList() {
    return request({
        url: constant.buildList,
        method: 'get'
    })
}
export function locationList() {
    return request({
        url: constant.locationList,
        method: 'get'
    })
}
export function infoListS(paramsData) {
    return request({
        url: constant.infoListS,
        method: 'post',
        data: paramsData
    })
}
export function labelLists() {
    return request({
        url: constant.labelLists,
        method: 'get'
    })
}
export function infoCount() {
    return request({
        url: constant.infoCount,
        method: 'get'
    })
}
export function weekCount() {
    return request({
        url: constant.weekCount,
        method: 'get'
    })
}
export function businessFace(paramsData) {
    return request({
        url: constant.businessFace,
        method: 'post',
        data: paramsData
    })
}
export function businessSearch(paramsData) {
    return request({
        url: constant.businessSearch,
        method: 'post',
        data: paramsData
    })
}
export function regionList(paramsData) {
    return request({
        url: constant.regionList,
        method: 'post',
        data: paramsData
    })
}
export function categoryList() {
    return request({
        url: constant.categoryList,
        method: 'get'
    })
}
export function infoInfoList(paramsData) {
    return request({
        url: constant.infoInfoList,
        method: 'post',
        data: paramsData
    })
}
export function infoUpdate(paramsData) {
    return request({
        url: constant.infoUpdate,
        method: 'post',
        data: paramsData
    })
}
//门禁
export function SPCC_doControl(paramsData) {
    return request({
        url: constant.SPCC_doControl,
        method: 'post',
        data: paramsData
    })
}export function SPCC_DoorState(paramsData) {
    return request({
        url: constant.SPCC_DoorState,
        method: 'post',
        data: paramsData
    })
}export function SPCC_DoorList(paramsData) {
    return request({
        url: constant.SPCC_DoorList,
        method: 'post',
        data: paramsData
    })
}

// 数据面板页
// 本年度
export function yearSex() {
    return request({
        url: constant.yearSex,
        method: 'get'
    })
}

export function yearSexOut() {
    return request({
        url: constant.yearSexOut,
        method: 'get'
    })
}

export function yearSexIn() {
    return request({
        url: constant.yearSexIn,
        method: 'get'
    })
}
 // 历史案件
 export function historyCase() {
    return request({
        url: constant.historyCase,
        method: 'get'
    })
}
// 办案组概况
  

export function banComgary() {
    return request({
        url: constant.banComgary,
        method: 'get'
    })
}
// 谈话情况

export function talkSuation() {
    return request({
        url: constant.talkSuation,
        method: 'get'
    })
}


export function talkSuationList() {
    return request({
        url: constant.talkSuationList,
        method: 'get'
    })
}


// 滞留人员入
export function In() {
    return request({
        url: constant.In,
        method: 'get'
    })
}

// 滞留人员出
export function Out() {
    return request({
        url: constant.Out,
        method: 'get'
    })
}

 // 留置区使用情况
 export function Sutation() {
    return request({
        url: constant.useSutation,
        method: 'get'
    })
}

  //谈话室数
export function talkSutation() {
    return request({
        url: constant.talkSutation,
        method: 'get'
    })
}


export function lzsqk() {
    return request({
        url: constant.lzsqk,
        method: 'get'
    })
}
// 运行态势 

export function runSuation() {
    return request({
        url: constant.runSuation,
        method: 'get'
    })
}
// 运行人数
export function runSuationCount() {
    return request({
        url: constant.runSuationCount,
        method: 'get'
    })
}

export function runSuationZX() {
    return request({
        url: constant.runSuationZX,
        method: 'get'
    })
}
// 滞留预警
export function Zinstrouct() {
    return request({
        url: constant.Zinstrouct,
        method: 'get'
    })
}
// 滞留成本
export function zProduct() {
    return request({
        url: constant.zProduct,
        method: 'get'
    })
}

export function zx() {
    return request({
        url: constant.zx,
        method: 'get'
    })
}

// 山庄的接口情况
//基地概况
export function jdgk() {
    return request({
        url: constant.jdgk,
        method: 'get'
    })
}
//// 留置区概况
export function lz1qgk() {
    return request({
        url: constant.lz1qgk,
        method: 'get'
    })
}
// 常规留置区 那个折线
export function cglzq() {
    return request({
        url: constant.cglzq,
        method: 'get'
    })
}

//已解除对象
export function yjc() {
    return request({
        url: constant.yjc,
        method: 'get'
    })
}

// 内圈饼图
export function nqbt() {
    return request({
        url: constant.nqbt,
        method: 'get'
    })
}
//外圈饼图
export function wqbt() {
    return request({
        url: constant.wqbt,
        method: 'get'
    })
}

// 人员概况
export function rygk() {
    return request({
        url: constant.rygk,
        method: 'get'
    })
}
// 看护力量分布
export function khll() {
    return request({
        url: constant.khll,
        method: 'get'
    })
}
// 武警饼图
export function wjbt() {
    return request({
        url: constant.wjbt,
        method: 'get'
    })
}
// 特警饼图
export function tjbt() {
    return request({
        url: constant.tjbt,
        method: 'get'
    })
}
   //根据留置房间编码获取留置人员信息
export function roomPeople(paramsData) {
    return request({
        url: constant.roomPeople,
        method: 'post',
        data: paramsData
    })
}
//根据房间编号搜索房间监控点信息
export function roomCamera(paramsData) {
    return request({
        url: constant.roomCamera,
        method: 'post',
        data: paramsData
    })
}
// 

export function roomList() {
    return request({
        url: constant.roomList,
        method: 'get'
    })
}

export function moreKanhu() {
    return request({
        url: constant.moreKanhu,
        method: 'get'
    })
}

export function roomDetails(paramsData) {
    return request({
        url: constant.roomDetails,
        method: 'post',
        data: paramsData
    })
}
   //所有房间使用情况
   export function roomUserSutation() {
    return request({
        url: constant.roomUserSutation,
        method: 'get'
       
    })
}
//个案跟踪页面路径
export function geangenz() {
    return request({
        url: constant.geangenz,
        method: 'get'
    })
}
//资源分页查询
export function findResources(paramsData) {
    return request({
        url: constant.findResources,
        method: 'post',
        data: paramsData
    })
}
   //1)当前留置人员类型
   export function lzTypeNum() {
    return request({
        url: constant.lzTypeNum,
        method: 'get'
    })
}
// 人体特征
export function rttz(paramsData) {
    return request({
        url: constant.rttz,
        method: 'post',
        data: paramsData
    })
}
  // 人体特征心率
export function rttzHL(paramsData) {
    return request({
        url: constant.rttzHL,
        method: 'post',
        data: paramsData
    })
}
  // 人体特征 呼吸
  export function rtzzHX(paramsData) {
    return request({
        url: constant.rtzzHX,
        method: 'post',
        data: paramsData
    })
}
  //人体特征 呼吸
  export function rtzzTD(paramsData) {
    return request({
        url: constant.rttzHL,
        method: 'post',
        data: paramsData
    })
}