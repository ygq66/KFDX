import { api1 as ApiUrl, api2 as ApiUrl2, doorInurl as doorUrl, api3 as datamanel } from './address';

// 接口集合
const constant =  {
  //登录
  getLogin : `${ApiUrl}/sys/user/list`,

  //获取平台配置
  getConfig : `${ApiUrl}/sys/config/list`,

  //头部模块列表
  layoutList : `${ApiUrl}/layout/config/list`,

  //资源图谱相机计总
  Cameratotal : `${ApiUrl2}/device/category/count`,

  //资源图谱树图
  Treetotal : `${ApiUrl2}/Resource/map`,

  //所有相机模型列表
  cameraList_S : `${ApiUrl2}/device/camera/listS`,

  //人脸应用  --->人脸库
  businessFace : `${ApiUrl2}/business/selectFacebank`,

  // --->历史轨迹查询
  businessSearch : `${ApiUrl2}/business/SearchImg`,

  // --->相机列表
  infoList : `${ApiUrl}/device/info/list`,
  
  //视频监控树
  regionList:`${ApiUrl}/device/region/list`,

  //查询设备属于哪个网格
  cameraRegion:`${ApiUrl2}/camera/region`,

  //巡逻路线
  lineList:`${ApiUrl2}/patrol/line/list`,
  
  //根据id查路线
  lineAlllist:`${ApiUrl2}/patrol/line/alllist`,

  //建筑id查建筑和楼层数据
  labelList:`${ApiUrl2}/figure/label/listId`,

  //查询黑白地图url配置
  getConfig_L : `${ApiUrl2}/sys/config/list`,

  //获取所有建筑信息
  buildList : `${ApiUrl2}/map/build/list`,

  //获取初始化位置接口
  locationList : `${ApiUrl2}/init/location/list`,

  //查种类设备详情
  infoListS : `${ApiUrl2}/device/info/listS`,

  //查文字标注
  labelLists : `${ApiUrl2}/figure/label/list`,

  //报警统计
  infoCount : `${ApiUrl}/event/info/count`,

  //七日报警
  weekCount : `${ApiUrl}/event/info/week/count`,

  //所有的设备类型
  categoryList : `${ApiUrl}/device/category/list`,

  //报警记录
  infoInfoList : `${ApiUrl}/event/info/type/list`,

  //确定忽略
  infoUpdate : `${ApiUrl}/event/info/update`,

  //门禁控制
  SPCC_doControl : `${doorUrl}/SPCC/doControl`,
  
  //门禁状态
  SPCC_DoorState : `${doorUrl}/SPCC/DoorState`,

  //门禁进出记录
  SPCC_DoorList : `${doorUrl}/SPCC/DoorList`,
   // 本年度留置男女
   yearSex: `${datamanel}/detain/getDetainPeopleNum`,
   yearSexIn: `${datamanel}/detain/getDetainPeoplePieInfo`,
   yearSexOut: `${datamanel}/detain/getDetainPeopleTypePieInfo`,
   // 历史案件
   historyCase:`${datamanel}/detain/getHistoryCaseNum`,
   // 办案组概况
   banComgary: `${datamanel}/staff/getInvesGroupInfo`,
   // 谈话情况 次数
   talkSuation: `${datamanel}/interrogate/getInterrogateRoomByYear`,

   lzsqk: `${datamanel}/detain/getOrdinaryDetainRoomInfo`,  
   // 谈话情况 列表
   talkSuationList: `${datamanel}/interrogate/getInterrogateRoomList`,
   // 滞留人员出入 入区
   In: `${datamanel}/detain/getInDetainPapcInfo`,
   // 滞留人员出入 出区
   Out: `${datamanel}/detain/getOutDetainPapcInfo`,
   // 留置区使用情况
   useSutation: `${datamanel}/detain/getDetainRecordUsage`,
   //谈话室数
   talkSutation: `${datamanel}/interrogate/getInterrogateRoomInfo`,
   //根据留置房间编码获取留置人员信息
   roomPeople: `${datamanel}/detain/getDetainPeopleInfoByRoomIndexCode`,

   //1)根据房间编号搜索房间监控点信息
   roomCamera: `${datamanel}/detain/searchCamera`,

   roomList: `${datamanel}/detain/getUseDetainRoomInfo`,
   //所有房间使用情况
   roomUserSutation:`${datamanel}/detain/getAllUseRoom`,
   // 运行态势
   runSuation: `${datamanel}/detain/getMindDetainRoomInfo`,
   // 运行态势 人数
   runSuationCount: `${datamanel}/detain/getDetainRiskTotal`,
   // 运行态势折线
   runSuationZX: `${datamanel}/detain/getDetainRiskInfo`,
   // 滞留预警
   Zinstrouct: `${datamanel}/detain/getDetainAlarmInfo`,
   // 滞留成本 总人数
   zProduct: `${datamanel}/detain/getConservePersonTotal`,
   // 滞留成本 折线图
   zx: `${datamanel}/detain/getConservePersonTimesLineChart`,
   // 山庄接口
   //基地概况
   jdgk: `${datamanel}/staff/getBaseInfo`,
   // 留置区概况
   lz1qgk: `${datamanel}/detain/getTargetInfo`,
   // 常规留置区 那个折线
   cglzq: `${datamanel}/detain/getDetainLineChart`,
   // 留置态势分析
   //已解除对象
   yjc: `${datamanel}/detain/getRelievePeopleNum`,
   // 内圈饼图
   nqbt: `${datamanel}/detain/getRelievePeoplePieInfo`,
   //外圈饼图
   wqbt: `${datamanel}/detain/getRelievePeopleTimePieInfo`,
   // 人员概况
   rygk: `${datamanel}/staff/getPersonnelNum`,
   // 看护力量分布
   khll: `${datamanel}/staff/getPlaceInfo`,
   // 武警饼图
   wjbt: `${datamanel}/staff/getSWATPieInfo`,
   // 特警饼图
   tjbt: `${datamanel}/staff/getPolicePieInfo`,

   //看护总和两个类型参数
   moreKanhu: `${datamanel}/detain/getDetainNumPieInfo`,

   //查询房间信息
   roomDetails: `${ApiUrl2}/bed/room/list`,

   //1)个案跟踪跳转地址获取
   geangenz: `${datamanel}/detain/getHomePage`,
   // 查找一个资源
   findResources: `${datamanel}/alarm/findOneResource`,
   //1)当前留置人员类型
   lzTypeNum: `${datamanel}/detain/getDetainPeopleTypeNumInfo`,
   //人体特征
   rttz:`${datamanel}/device/getOneSignPerSecData`,
   // 人体特征心率
   rttzHL:`${datamanel}/device/getHeartLineSignPerSecData`,
   // 人体特征 呼吸
   rtzzHX:`${datamanel}/device/getBreathLineSignPerSecData`,
  // 人体特征 呼吸
  rtzzTD:`${datamanel}/device/getMotionLineSignPerSecData`
   
} 

export default constant;