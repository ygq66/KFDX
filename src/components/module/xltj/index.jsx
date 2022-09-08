import React, {useState, useEffect} from 'react';
import {Tree, Spin, Empty, message, DatePicker, Space} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {DownOutlined} from '@ant-design/icons';
import './style.scss';
import {useMappedState} from 'redux-react-hook';
import {
  regionList,
  infoListS,
  labelList,
  SPCC_doControl,
  SPCC_DoorState,
  SPCC_DoorList,
  // Doorpictures
} from '../../../api/mainApi';
import {timeFormat} from '../../../utils/untils'
import {Build, Map, Model} from '../../../utils/map3d'
import {Common} from '../../../utils/mapMethods';
import moment from 'moment';
import axios from "axios";
import title_1 from '../../../assets/doorApply_copy/title_1.png'
// import icon from '../../../assets/doorApply_copy/icon_zhankai.png'
// import cheliang from '../../../assets/doorApply_copy_1/img_cheliang.png'
// import icon_sousuo from '../../../assets/doorApply_copy_1/icon_sousuo.png'
import title_2 from '../../../assets/doorApply_copy_2/标题.png'
import icon_aq from '../../../assets/doorApply_copy_4/icon_aq_3_xg.png'
import rectangle from '../../../assets/doorApply_copy_4/Rectangle 67.png'
import map from '../../../assets/doorApply_copy_4/icon_map.png'
import time1 from '../../../assets/doorApply_copy_4/icon_time1.png'
import DoorApply_copy_6 from '../doorApply_copy_6';


const TreeNode = Tree.TreeNode;
let icons = []
let iconIdx = 0;
const DoorApply_copy_4 = (props) => {
  const mp_light = useMappedState(state => state.map3d_light);
  const [doorList, setDoorlist] = useState([]);
  const [doorHistorylist, setDoorHistory] = useState([])
  const [doorVislib, DoorVislib] = useState(false)
  const [doorHistory, DoorHistoryVislib] = useState(false)
  const [showDetail, setShowDetail] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([])
  const [spinning, setSpinning] = useState(true)
  const [count, setCount] = useState()
  const [dooState, setDoorState] = useState('开')//门禁状态
  const [doorDatas, setDoorData] = useState({})
  const [doorName, setDoorName] = useState("门禁1")
  const [fenceng, setSF] = useState({build_id: "", allfloor: ""})
  const [time, setTime] = useState({stime: "", etime: ""})
  const [showTime, setShowTime] = useState(false);
  const [showPicUrl, setShowPicUrl] = useState(false);
  const [picUrl, setPicUrl] = useState('');
  const [menjinList, setMenjinList] = useState([
    {
      name: '门禁1', location: {
        pitch: 31.360532760620117,
        roll: -9.998408359024324e-7,
        x: -2494.12890625,
        y: -16630.955078125,
        yaw: 48.549434661865234,
        z: 1806.986083984375,
      }
    },
    {
      name: '门禁2', location: {
        pitch: 31.360532760620117,
        roll: -9.998408359024324e-7,
        x: 15442.298828125,
        y: -23199.833984375,
        yaw: 48.549434661865234,
        z: 986.3075561523438,
      }
    },
    {
      name: '门禁3', location: {
        pitch: 31.360532760620117,
        roll: -9.998408359024324e-7,
        x: 17677.056640625,
        y: -18724.77734375,
        yaw: 48.549434661865234,
        z: 1186.8597412109375,
      }
    }
  ]);

  useEffect(() => {
    getDoorList()
    drawIcon()
    return () => {
      clearIcon()
    }
  }, [])

  const drawIcon = async () => {
    let res = await axios({url: './data/menjin2.js'})
    let came = eval(res.data)
    console.log("查询门禁", came)
    let un_indoor = [];
    let Data = came;
    console.log('返回的总结果', Data);
    for (let index = 0; index < Data.length; index++) {
      const element = Data[index];
      if (element.category_name === '摄像机' || element.category_name === '摄像头') {
        if (!element.indoor) {
          un_indoor.push(element)
        }
      }
    }
    icons = un_indoor.map(element => {
      iconIdx++
      return {
        gid: "MENJIN_ICON_" + iconIdx,
        type: "image", // 10102  或  image
        style: 'menjin_icon',
        scale: 0.5,
        screen: true, //对或错
        location: {
          x: element.list_style.x,
          y: element.list_style.y,
          z: element.list_style.z + 50,
          pitch: element.list_style.pitch, // 俯仰角 0——90度
          yaw: element.list_style.yaw, // 偏航角 0-360度
          roll: element.list_style.roll, // 翻滚角
        },
        attr: {device_name: element.device_name, id: element.id},
      }
    })
    console.log('绘制门禁图标', icons);
    await Map.overLayerCreateObjects(window.$map_light, icons)
  }

  const clearIcon = async () => {
    for (const ic of icons) {
      console.log('删除图标', ic.gid)
      await Map.overLayerRemoveObjectById(window.$map_light, ic.gid)
    }
    icons = []
  }

  //视频弹框
  function tan() {
    console.log("点击了")
  }

  function doorqpVisble(index, item) {
    console.log('====打开门禁', index)
    DoorVislib(!doorVislib)
    window.$map_light.FlyToPosition(item.location)
    // if (index === '1') {
    //   Map.closeIcon(mp_light)
    // }
  }

  function abc() {
    DoorVislib(!doorVislib)
    Model.closedoorApply(window.$map_light)
  }

  function doorHistoryvisble() {
    DoorHistoryVislib(!doorHistory)
  }

  //查询门禁记录
  function doorHistoryList() {
    //显示出来
    setShowTime(true);

  }

  function searchNow() {
    SPCC_DoorList({
      doorIndexCodes: [doorDatas.device_code],
      startTime: moment(time.stime).format(),
      endTime: moment(time.etime).format(),
      pageNo: 1,
      pageSize: 50
    }).then(res => {
      if (res.msg === "Success") {
        doorHistoryvisble();
        setDoorHistory(res.Data.data.list);
      }
    })
  }

  // function showPic(svrIndexCode, picUri) {
  //   console.log('地址', svrIndexCode, picUri);
  //   //请求图片接口地址
  //   Doorpictures({svrIndexCode: svrIndexCode, picUri: picUri}).then(res => {
  //     if (res.msg === "Success") {
  //       setShowPicUrl(true)
  //       if (res.Data.Location) {
  //         setPicUrl(res.Data.Location)
  //       } else {
  //         setPicUrl("")
  //       }
  //     }
  //   })
  // }

  function closePic() {
    setShowPicUrl(false)
  }

  const onSelect = (selectedKeys, info) => {
    // if (!info.node.children && info.node.item.device_code) {
    //     console.log(info.node.item, '门禁详情信息')

    //     setDoorName(info.node.item.device_name)
    //     setDoorData(info.node.item)
    //     DoorVislib(true)
    //     SPCC_DoorState({ indexCodes: [info.node.item.device_code] }).then(res => {
    //         if (res.msg === "Success") {
    //             // let resState = res.data.authDoorList[0].doorState;
    //             // if (resState === 0) {
    //             //     resState = "常开"
    //             // } else if (resState === 1) {
    //             //     resState = "开门"
    //             // } else if (resState === 2) {
    //             //     resState = "关门"
    //             // } else if (resState === 3) {
    //             //     resState = "常闭"
    //             // }
    //             // setDoorState(resState)
    //             console.log('门禁状态接口', res)
    //             if (res.msg === 'Success') {
    //                 let resState = res.Data.data.list[0].online;
    //                 if (resState == 0) {
    //                     resState = "离线"
    //                 } else {
    //                     resState = "在线"
    //                 }
    //                 setDoorState(resState);

    //             }
    //         }
    //     })

    //     infoListS({
    //         category_id: info.node.item.category_id,
    //         device_code: info.node.item.device_code
    //     }).then(res => {
    //         if (res.msg === "success") {
    //             if (res.data.length > 0) {
    //                 let doorResults = res.data[0]
    //                 //飞行定位
    //                 Common.mapFly(mp_light, doorResults)
    //                 console.log(fenceng, '阿西吧')
    //                 if (fenceng.build_id !== "" && fenceng.allfloor !== "") {
    //                     Build.showFloor(mp_light, fenceng.build_id, "all", fenceng.allfloor)
    //                 }
    //                 // Build.allShow(mp_light, true)
    //                 //分层
    //                 if (doorResults.build_id) {
    //                     labelList({ build_id: doorResults.build_id }).then(res2 => {
    //                         if (res2.msg === "success") {
    //                             let floorList_s = res2.data[0].floor_name;
    //                             let nfloor = [];
    //                             floorList_s.forEach(element => {
    //                                 nfloor.push(element.floor_id.split("#")[1])
    //                             });
    //                             setSF({ build_id: doorResults.build_id, allfloor: nfloor })
    //                             Build.showFloor(mp_light, doorResults.build_id, doorResults.floor_id.split("#")[1], nfloor)

    //                             //弹出楼层列表
    //                             let messageData = {
    //                                 switchName: 'buildLable',
    //                                 SPJK: false,
    //                                 Personnel: doorResults.build_id,
    //                                 index: Number(doorResults.floor_id.charAt(doorResults.floor_id.length - 1)),
    //                                 floor_id: doorResults.floor_id
    //                             }
    //                             window.parent.postMessage(messageData, '*')
    //                         }
    //                     })
    //                 }
    //             } else {
    //                 message.warning("暂未上图");
    //             }
    //         }
    //     })
    // }


    if (!info.node.children && info.node.item.device_code) {
      console.log(info.node.item, '门禁详情信息')

      // setDoorName(info.node.item.device_name)
      // setDoorData(info.node.item)
      // DoorVislib(true)
      // SPCC_DoorState({ indexCodes: [info.node.item.device_code] }).then(res => {
      //     if (res.msg === "Success") {
      //         // let resState = res.data.authDoorList[0].doorState;
      //         // if (resState === 0) {
      //         //     resState = "常开"
      //         // } else if (resState === 1) {
      //         //     resState = "开门"
      //         // } else if (resState === 2) {
      //         //     resState = "关门"
      //         // } else if (resState === 3) {
      //         //     resState = "常闭"
      //         // }
      //         // setDoorState(resState)
      //         console.log('门禁状态接口', res)
      //         if (res.msg === 'Success') {
      //             let resState = res.Data.data.list[0].online;
      //             if (resState == 0) {
      //                 resState = "离线"
      //             } else {
      //                 resState = "在线"
      //             }
      //             setDoorState(resState);

      //         }
      //     }
      // })

      axios({
        url: './data/listTree.js'
      }).then(res => {
        let listss = eval(res.data)
        if (listss.length > 0) {
          let doorResults = listss[0]
          //飞行定位
          // 弹出门禁列表
          let messageData = {
            switchName: 'model',
            Personnel: {attr: info.node.item},
          };
          console.log('打开门禁列表', messageData);
          window.parent.postMessage(messageData, '*');

          // Build.allShow(mp_light, true)
          //分层

        }

      })
    }

  };

  //获取门禁列表
  const getDoorList = () => {
    axios({
      url: './data/menjin.js'
    }).then(res => {
      let trees = eval(res.data)
      setDoorlist(trees)
      console.log('获取门禁列表', trees)
      setExpandedKeys([trees[0].key, trees[0].children[0].key])//默认展开
      setSpinning(false)
    })
  }

  const getToTal = (arr) => {
    let num = 0;
    arr.forEach(element => {
      if (element.children) {
        num += getToTal(element.children)
        getToTal(element.children)
      } else {
        num += 1;
      }
    });
    return num;
  }

  const getTreeOptions = (nodeData) => {
    return nodeData && Array.isArray(nodeData)
      ? nodeData.map((list) => {
        if (list.children && Array.isArray(list.children) && list.children.length > 0) {
          return (
            <TreeNode key={list.id} title={
              <>
                <span onClick={"doorVislib"}>{list.title}</span>
                {
                  getToTal(list.children) > 0 ? <span style={{color: "yellow"}}> (总数：{getToTal(list.children)})</span> :
                    <span style={{color: "yellow"}}> (总数：{list.children.length})</span>
                }
              </>
            } item={list}>
              {getTreeOptions(list.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={
              <>
                <span>{list.title}</span>
              </>
            }
            key={list.id}
            item={list}
          />
        );
      })
      : [];
  }

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys)
  };

  const caozuo = (type) => {
    SPCC_doControl({doorIndexCodes: [doorDatas.device_code], controlType: type}).then(res => {
      console.log('操作', res)
      if (res.msg === "Success") {
        if (res.Status === '控制成功') {
          message.success("操作成功");
          setCount(type.toString())
        } else {
          message.warning("操作失败");
        }
        SPCC_DoorState({indexCodes: [props.msgdata.device_code]}).then(res => {
          //枣庄
          console.log('门禁状态接口', res)
          if (res.msg === 'Success') {
            let resState = res.Data.data.list[0].online;
            if (resState == 0) {
              resState = "离线"
            } else {
              resState = "在线"
            }
            setDoorState(resState);

          }
        })
        // if (res.data[0].controlResultCode === 0) {
        //     message.success("操作成功");
        //     setCount(type.toString())
        // } else {
        //     message.warning("操作失败", res.data[0]);
        // }
      }
    })
  }
  const caozuo2 = (type) => {
    console.log('操作', type)
  }
  const timeChange1 = (date, dateString) => {
    setTime({...time, stime: dateString})
  }
  const timeChange2 = (date, dateString) => {
    setTime({...time, etime: dateString})
  }

  return (
    showDetail ? (
    <div id="DoorApply" className="DoorApply">
      <div className="DoorApply_top">
        <h1>巡逻统计</h1>
        <img src={title_1} alt=""/>
      </div>
      <div className='xunluo'>
        <div className='xunluo-1'>
          <img src={icon_aq} alt="" />
          <p>巡逻总数</p>
          <span>3356</span>
          <h1>/人次</h1>
        </div>
        <div className='xunluo-2'>
          <img src={icon_aq} alt="" />
          <p>今日巡逻数</p>
          <span>123</span>
          <h1>/人次</h1>
        </div>
      </div>
      <div className='router'>
          <p onClick={() => setShowDetail(false)}>查看巡逻路线</p>
      </div>

      <div className="shishi">
        <h1>实时报警</h1>
        <img src={title_1} alt=""/>
      </div>

      <div className='POLICE'>
        <div className='police-1'>
          <img src={rectangle} alt="" />
            <div className='weiting'>
              <p>车辆违停</p>
            </div>
            <div className='time-map'>
                <img src={time1} alt="" />
                <p>2021-08-01 11:42:26</p>
              </div>
              <div className='address'>
                <img src={map} alt="" />
                <p>老年开放大学东校区</p>
              </div>
              <div className='line'></div>
        </div>
        <div className='police-1'>
          <img src={rectangle} alt="" />
            <div className='weiting'>
              <p>车辆违停</p>
            </div>
            <div className='time-map'>
                <img src={time1} alt="" />
                <p>2021-08-01 11:42:26</p>
              </div>
              <div className='address'>
                <img src={map} alt="" />
                <p>老年开放大学东校区</p>
              </div>
              <div className='line'></div>
        </div>
        <div className='police-1'>
          <img src={rectangle} alt="" />
            <div className='weiting'>
              <p>车辆违停</p>
            </div>
            <div className='time-map'>
                <img src={time1} alt="" />
                <p>2021-08-01 11:42:26</p>
              </div>
              <div className='address'>
                <img src={map} alt="" />
                <p>老年开放大学东校区</p>
              </div>
              <div className='line'></div>
        </div>
        <div className='police-1'>
          <img src={rectangle} alt="" />
            <div className='weiting'>
              <p>车辆违停</p>
            </div>
            <div className='time-map'>
                <img src={time1} alt="" />
                <p>2021-08-01 11:42:26</p>
              </div>
              <div className='address'>
                <img src={map} alt="" />
                <p>老年开放大学东校区</p>
              </div>
              <div className='line'></div>
        </div>
        <div className='police-1'>
          <img src={rectangle} alt="" />
            <div className='weiting'>
              <p>车辆违停</p>
            </div>
            <div className='time-map'>
                <img src={time1} alt="" />
                <p>2021-08-01 11:42:26</p>
              </div>
              <div className='address'>
                <img src={map} alt="" />
                <p>老年开放大学东校区</p>
              </div>
              <div className='line'></div>
        </div>
      </div>
    </div>) : <DoorApply_copy_6 onExit = {() => {
      setShowDetail(true);
    }} />
  )
}

export default DoorApply_copy_4;