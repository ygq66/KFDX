import React, { useState, useEffect } from 'react'
import { Tree, Spin, Empty, message, DatePicker, Space } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { DownOutlined } from '@ant-design/icons'
import './style.scss'
import { useMappedState } from 'redux-react-hook'
import {
  regionList,
  infoListS,
  labelList,
  SPCC_doControl,
  SPCC_DoorState,
  SPCC_DoorList,
  // Doorpictures,
} from '../../../api/mainApi'
import { timeFormat } from '../../../utils/untils'
import { Build, Map, Model } from '../../../utils/map3d'
import { Common } from '../../../utils/mapMethods'
import moment from 'moment'
import axios from 'axios'
import title_1 from '../../../assets/doorApply_copy/title_1.png'
// import icon from '../../../assets/doorApply_copy/icon_zhankai.png'
// import cheliang from '../../../assets/doorApply_copy_1/img_cheliang.png'
// import icon_sousuo from '../../../assets/doorApply_copy_1/icon_sousuo.png'
import title_2 from '../../../assets/doorApply_copy_2/标题.png'
import icon_1 from '../../../assets/doorApply_copy_2/icon_1.png'
import icon_2 from '../../../assets/doorApply_copy_2/icon_2.png'
import icon_3 from '../../../assets/doorApply_copy_2/icon_3.png'
import icon_4 from '../../../assets/doorApply_copy_2/icon_4.png'
import icon_5 from '../../../assets/doorApply_copy_2/icon_5.png'
import icon_6 from '../../../assets/doorApply_copy_2/icon_6.png'
import guanbi from '../../../assets/doorApply_copy_2/icon_guanbi_2.png'
import icon_sousuo from '../../../assets/doorApply_copy_2/icon_sousuo.png'
import zhankai from '../../../assets/doorApply_copy_2/icon_zhankai.png'
import frame from '../../../assets/doorApply_copy_2/Frame44.png'

const TreeNode = Tree.TreeNode
let icons = []
let iconIdx = 0
const DoorApply_copy_2 = (props) => {
  const mp_light = useMappedState((state) => state.map3d_light)
  const [doorList, setDoorlist] = useState([])
  const [doorHistorylist, setDoorHistory] = useState([])
  const [doorVislib, DoorVislib] = useState(false)
  const [doorHistory, DoorHistoryVislib] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState([])
  const [spinning, setSpinning] = useState(true)
  const [count, setCount] = useState()
  const [dooState, setDoorState] = useState('开') //门禁状态
  const [doorDatas, setDoorData] = useState({})
  const [doorName, setDoorName] = useState('门禁1')
  const [fenceng, setSF] = useState({ build_id: '', allfloor: '' })
  const [time, setTime] = useState({ stime: '', etime: '' })
  const [showTime, setShowTime] = useState(false)
  const [showPicUrl, setShowPicUrl] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [picUrl, setPicUrl] = useState('')
  const [menjinList, setMenjinList] = useState([
    {
      name: '门禁1',
      location: {
        pitch: 31.360532760620117,
        roll: -9.998408359024324e-7,
        x: -2494.12890625,
        y: -16630.955078125,
        yaw: 48.549434661865234,
        z: 1806.986083984375,
      },
    },
    {
      name: '门禁2',
      location: {
        pitch: 31.360532760620117,
        roll: -9.998408359024324e-7,
        x: 15442.298828125,
        y: -23199.833984375,
        yaw: 48.549434661865234,
        z: 986.3075561523438,
      },
    },
    {
      name: '门禁3',
      location: {
        pitch: 31.360532760620117,
        roll: -9.998408359024324e-7,
        x: 17677.056640625,
        y: -18724.77734375,
        yaw: 48.549434661865234,
        z: 1186.8597412109375,
      },
    },
  ])

  useEffect(() => {
    getDoorList()
    drawIcon()
    return () => {
      clearIcon()
    }
  }, [])

  const drawIcon = async () => {
    let res = await axios({ url: './data/menjin2.js' })
    let came = eval(res.data)
    console.log('查询门禁', came)
    let un_indoor = []
    let Data = came
    console.log('返回的总结果', Data)
    for (let index = 0; index < Data.length; index++) {
      const element = Data[index]
      if (
        element.category_name === '摄像机' ||
        element.category_name === '摄像头'
      ) {
        if (!element.indoor) {
          un_indoor.push(element)
        }
      }
    }
    icons = un_indoor.map((element) => {
      iconIdx++
      return {
        gid: 'MENJIN_ICON_' + iconIdx,
        type: 'image', // 10102  或  image
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
        attr: { device_name: element.device_name, id: element.id },
      }
    })
    console.log('绘制门禁图标', icons)
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
    console.log('点击了')
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
    setShowTime(true)
  }

  function searchNow() {
    SPCC_DoorList({
      doorIndexCodes: [doorDatas.device_code],
      startTime: moment(time.stime).format(),
      endTime: moment(time.etime).format(),
      pageNo: 1,
      pageSize: 50,
    }).then((res) => {
      if (res.msg === 'Success') {
        doorHistoryvisble()
        setDoorHistory(res.Data.data.list)
      }
    })
  }

  // function showPic(svrIndexCode, picUri) {
  //   console.log('地址', svrIndexCode, picUri)
  //   //请求图片接口地址
  //   Doorpictures({ svrIndexCode: svrIndexCode, picUri: picUri }).then((res) => {
  //     if (res.msg === 'Success') {
  //       setShowPicUrl(true)
  //       if (res.Data.Location) {
  //         setPicUrl(res.Data.Location)
  //       } else {
  //         setPicUrl('')
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
        url: './data/listTree.js',
      }).then((res) => {
        let listss = eval(res.data)
        if (listss.length > 0) {
          let doorResults = listss[0]
          //飞行定位
          // 弹出门禁列表
          let messageData = {
            switchName: 'model',
            Personnel: { attr: info.node.item },
          }
          console.log('打开门禁列表', messageData)
          window.parent.postMessage(messageData, '*')

          // Build.allShow(mp_light, true)
          //分层
        }
      })
    }
  }

  //获取门禁列表
  const getDoorList = () => {
    axios({
      url: './data/menjin.js',
    }).then((res) => {
      let trees = eval(res.data)
      setDoorlist(trees)
      console.log('获取门禁列表', trees)
      setExpandedKeys([trees[0].key, trees[0].children[0].key]) //默认展开
      setSpinning(false)
    })
  }

  const getToTal = (arr) => {
    let num = 0
    arr.forEach((element) => {
      if (element.children) {
        num += getToTal(element.children)
        getToTal(element.children)
      } else {
        num += 1
      }
    })
    return num
  }

  const getTreeOptions = (nodeData) => {
    return nodeData && Array.isArray(nodeData)
      ? nodeData.map((list) => {
          if (
            list.children &&
            Array.isArray(list.children) &&
            list.children.length > 0
          ) {
            return (
              <TreeNode
                key={list.id}
                title={
                  <>
                    <span onClick={'doorVislib'}>{list.title}</span>
                    {getToTal(list.children) > 0 ? (
                      <span style={{ color: 'yellow' }}>
                        {' '}
                        (总数：{getToTal(list.children)})
                      </span>
                    ) : (
                      <span style={{ color: 'yellow' }}>
                        {' '}
                        (总数：{list.children.length})
                      </span>
                    )}
                  </>
                }
                item={list}
              >
                {getTreeOptions(list.children)}
              </TreeNode>
            )
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
          )
        })
      : []
  }

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
  }

  const caozuo = (type) => {
    SPCC_doControl({
      doorIndexCodes: [doorDatas.device_code],
      controlType: type,
    }).then((res) => {
      console.log('操作', res)
      if (res.msg === 'Success') {
        if (res.Status === '控制成功') {
          message.success('操作成功')
          setCount(type.toString())
        } else {
          message.warning('操作失败')
        }
        SPCC_DoorState({ indexCodes: [props.msgdata.device_code] }).then(
          (res) => {
            //枣庄
            console.log('门禁状态接口', res)
            if (res.msg === 'Success') {
              let resState = res.Data.data.list[0].online
              if (resState == 0) {
                resState = '离线'
              } else {
                resState = '在线'
              }
              setDoorState(resState)
            }
          }
        )
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
    setTime({ ...time, stime: dateString })
  }
  const timeChange2 = (date, dateString) => {
    setTime({ ...time, etime: dateString })
  }

  return (
    <div id="DoorApply" className="DoorApply">
      <div>
        <div className="DoorApply_top">
          <h1>设备管控</h1>
          <img src={title_1} alt="" />
        </div>

        {/* 视频设备 */}
        <div className="shiping">
          <div className="shiping-1">
            <img src={title_2} alt="" />
            <p>视频设备</p>
            <h1 className="ck" onClick={() => setShowVideo(true)}>查看设备列表&gt;&gt;</h1>
          </div>
          <div className="text">
            <img src={icon_1} alt="" />
            <div className="text-1">
              <div>
                <p>接入数量</p>
                <span>562</span>
              </div>
              <div>
                <p>在线数量</p>
                <span>562</span>
              </div>
              <div>
                <p>在线率</p>
                <span>81%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 门禁设备 */}
        <div className="menjin">
          <div className="menjin-1">
            <img src={title_2} alt="" />
            <p>门禁设备</p>
            <span>查看设备列表&gt;&gt;</span>
          </div>
          <div className="text">
            <img src={icon_2} alt="" />
            <div className="text-menjin">
              <div>
                <p>接入数量</p>
                <span>324</span>
              </div>
              <div>
                <p>在线数量</p>
                <span>286</span>
              </div>
              <div>
                <p>在线率</p>
                <span>88%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 消防设备 */}
        <div className="xiaofang">
          <div className="xiaofang-1">
            <img src={title_2} alt="" />
            <p>消防设备</p>
            <span>查看设备列表&gt;&gt;</span>
          </div>
          <div className="text">
            <img src={icon_3} alt="" />
            <div className="text-xiaofang">
              <div>
                <p>接入数量</p>
                <span>249</span>
              </div>
              <div>
                <p>在线数量</p>
                <span>249</span>
              </div>
              <div>
                <p>在线率</p>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 对讲设备 */}
        <div className="duijiang">
          <div className="duijiang-1">
            <img src={title_2} alt="" />
            <p>对讲设备</p>
            <span>查看设备列表&gt;&gt;</span>
          </div>
          <div className="text">
            <img src={icon_4} alt="" />
            <div className="text-duijiang">
              <div>
                <p>接入数量</p>
                <span>56</span>
              </div>
              <div>
                <p>在线数量</p>
                <span>52</span>
              </div>
              <div>
                <p>在线率</p>
                <span>93%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 车辆抓拍设备 */}
        <div className="zhuapai">
          <div className="zhuapai-1">
            <img src={title_2} alt="" />
            <p>车辆抓拍设备</p>
            <span>查看设备列表&gt;&gt;</span>
          </div>
          <div className="text">
            <img src={icon_5} alt="" />
            <div className="text-zhuapai">
              <div>
                <p>接入数量</p>
                <span>42</span>
              </div>
              <div>
                <p>在线数量</p>
                <span>38</span>
              </div>
              <div>
                <p>在线率</p>
                <span>90%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 人脸抓拍设备 */}
        <div className="renlian">
          <div className="renlian-1">
            <img src={title_2} alt="" />
            <p>人脸抓拍设备</p>
            <span>查看设备列表&gt;&gt;</span>
          </div>
          <div className="text">
            <img src={icon_6} alt="" />
            <div className="text-renlian">
              <div>
                <p>接入数量</p>
                <span>115</span>
              </div>
              <div>
                <p>在线数量</p>
                <span>98</span>
              </div>
              <div>
                <p>在线率</p>
                <span>88%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVideo && (
        <div className="list">
          <div className="list-1">
            <img src={title_1} alt="" />
            <p>视频设备列表</p>
            <img className="icon_guanbi" src={guanbi} alt="" onClick={() => setShowVideo(false)} />
          </div>
          <div className="list-2">
            <p>请输入名称</p>
            <img src={icon_sousuo} alt="" />
          </div>
          <div>
            <div className="list-3">
              <img src={zhankai} alt="" />
              <p>老年开放大学东区</p>
            </div>
            <div className="list-4">
              <img src={zhankai} alt="" />
              <p>东校区A区</p>
            </div>
            <div className="list-5">
              <ul>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
                <li>D15-2号门内-路东-西射13-枪机</li>
              </ul>
            </div>
            <div className="list-6">
              <div className="list_1">
                <img src={frame} alt="" />
                <p>东校区B区</p>
              </div>
              <div className="list_2">
                <img src={frame} alt="" />
                <p>东校区B区</p>
              </div>
              <div className="list_3">
                <img src={frame} alt="" />
                <p>东校区B区</p>
              </div>
              <div className="list_4">
                <img src={frame} alt="" />
                <p>东校区B区</p>
              </div>
            </div>
            <div className="list-7">
              <img src={frame} alt="" />
              <p>老年开放大学西校区</p>
            </div>
            <div className="list-8">
              <ul>
                <li>
                  <img src={frame} alt="" />
                  <p className="fenqu-1">西校区A区</p>
                </li>
                <li>
                  <img src={frame} alt="" />
                  <p className="fenqu-2">西校区A区</p>
                </li>
                <li>
                  <img src={frame} alt="" />
                  <p className="fenqu-3">西校区A区</p>
                </li>
                <li>
                  <img src={frame} alt="" />
                  <p className="fenqu-4">西校区A区</p>
                </li>
                <li>
                  <img src={frame} alt="" />
                  <p className="fenqu-5">西校区A区</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoorApply_copy_2
