import React, { useState, useEffect, useRef, Fragment } from 'react';
import { DatePicker, Space, Select } from 'antd';
import { lineList, lineAlllist, PlanList, PlanList_p, labelList } from '../../../api/mainApi';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { useMappedState } from 'redux-react-hook';
import { Common } from '../../../utils/mapMethods'
import { videoPlay } from '../../../utils/untils'
import { Build, Event } from '../../../utils/map3d'

import './style.scss'

const {Option} = Select;
const ElectronicPatrol = () => {
  const inputRef = useRef();
  const mp_light = useMappedState(state => state.map3d_light);
  const [UploadImg, setImg] = useState(require('../../../assets/images/up_load.png').default)
  const [isChangeImg, setici] = useState(false)
  // eslint-disable-next-line
  const [tabs, setTabs] = useState(["视频巡逻路线", "电子巡更记录"])
  const [tabs2, setTabs2] = useState(["暂停", "退出", "异常上传"])
  const [show, setShow] = useState(true)//叉
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState()
  const [ycsb_show, setYcsb] = useState(false) //异常上报页面
  // eslint-disable-next-line
  const [problems, setProblem] = useState([{
    name: "撒打算",
    value: "0"
  }, {
    name: "撒打算",
    value: "1"
  }, {
    name: "撒打算",
    value: "2"
  }])
  const [show2, setShow2] = useState(false)//开始之后
  // eslint-disable-next-line
  const [timeList, setTimeList] = useState([
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    },
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    },
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    },
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    },
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    },
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    },
    {
      time: "11:10:13",
      address: "1号楼大门口",
      name: "赵萌萌"
    }
  ])
  // eslint-disable-next-line
  const [lineLists, setLineList] = useState([])
  const [planLists, setPlanList] = useState([])
  const [speed, setSpeed] = useState(5) // 单个设备速度
  const [noDeviceRouteTime, setNoDeviceRouteTime] = useState(10) // 无设备路线的整体巡逻时间
  const [stop, setStop] = useState(true)

  const cameraPlayTimer = useRef(null)
  const currentPlayCameraIndex = useRef(0) // 当前播放的相机，在本段路线中的索引
  const cameraNeedToPlayList = useRef([])  // 当前巡逻段需要播放的相机列表

  useEffect(() => {
    getLinepatrol()
    getPlanList()
  }, []);
  //获取巡逻路线
  const getLinepatrol = () => {
    lineList().then(res => {
      if (res.msg === "success") {
        setLineList(res.data)
      }
    })
  }
  //获取巡预案路线
  const getPlanList = () => {
    PlanList().then(res => {
      if (res.msg === "success") {
        setPlanList(res.data)
      }
    })
  }
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  // 播放巡逻路线上的视频
  const scheduleCameraPlay = () => {
    let playVideo = () => {
      currentPlayCameraIndex.current = currentPlayCameraIndex.current + 1

      const cameraList = cameraNeedToPlayList.current

      let currentCamera = cameraList[currentPlayCameraIndex.current]
      console.log(`播放第${currentPlayCameraIndex.current}/${cameraList.length}个相机视频！`)
      console.log(currentCamera)
      if (currentCamera) {
        videoPlay(currentCamera, "Patrol")
        cameraPlayTimer.current = setTimeout(playVideo, speed * 1000)
      }
    }

    cameraPlayTimer.current = setTimeout(playVideo, speed * 1000)
  }

  const startXL = (value, patrolFinishCallback) => {
    console.log(value)
    const floorId = value.floor_id

    const buildId = value.build_id
    const isIndoor = value.indoor

    let routeZValue = 400
    let floorLabel = 'F1'

    // 是室内的室内的巡逻路线
    if (isIndoor) {
      const floorNumber = Build.getFloorNumberByFloorId(floorId)
      const floorName = Build.getFloorNameByFloorId(floorId)

      // 获取这栋建筑内的所有楼层
      labelList({build_id: buildId}).then(res => {
        let floorList = res.data[0].floor_name.map(floor => floor.floor_name)

        setTimeout(() => {
          Build.showFloor(mp_light, buildId, floorName, floorList)
        }, 100)
        floorLabel = Build.getFloorLabelById(floorId)
      })

      if (floorNumber) {
        routeZValue *= floorNumber
      }
    }

    // return

    setShow(false)
    setShow2(true)
    setCount2(9)

    lineAlllist({id: value.id}).then(res => {
      if (res.msg === "success") {
        let before_lines = Array.from(res.data.patrol_line_subsection)

        console.log(before_lines)

        let trajectory = []

        const patrolOneLine = (currentLineIndex) => {
          console.log('')
          console.log(`开始第：${currentLineIndex + 1} 段巡游路线！ 共 ${before_lines.length} 条路线.`)

          if (currentLineIndex > before_lines.length - 1) {
            console.log(currentLineIndex, before_lines.length)
            console.log('巡更结束！')
            if (patrolFinishCallback) {
              patrolFinishCallback()
            } else {
              handle_top2(1)
              currentPlayCameraIndex.current = -1
              clearTimeout(cameraPlayTimer.current)
              cameraPlayTimer.current = null
            }

            return
          }

          let element = before_lines[currentLineIndex]         // 路线的起点
          let nextElement = before_lines[currentLineIndex + 1] // 路线的中间点
          let endElement = before_lines[currentLineIndex + 2]  // 路线的中间点

          trajectory = []
          trajectory.push({
            id: res.data.id,
            x: element.options.noodles[0][0],
            y: element.options.noodles[0][1],
            z: routeZValue,
            floor: floorLabel,
            cameraList: element.patrol_camera
          })

          // 最后一个元素时，添加到本身元素的noodles的点作为最后一段
          if (nextElement) {
            trajectory.push({
              id: res.data.id,
              // x: nextElement.options.line[0],
              // y: nextElement.options.line[1],
              x: nextElement.options.noodles[0][0],
              y: nextElement.options.noodles[0][1],
              z: routeZValue,
              floor: floorLabel,
              cameraList: nextElement.patrol_camera
            })
          } else {
            console.log('到最后一个点了：', currentLineIndex, JSON.stringify(nextElement), element)
            nextElement = element
            trajectory.push({
              id: res.data.id,
              x: nextElement.options.noodles[0][6],
              y: nextElement.options.noodles[0][7],
              z: routeZValue,
              floor: floorLabel,
              cameraList: nextElement.patrol_camera
            })
          }

          //
          if (endElement) {
            trajectory.push({
              id: res.data.id,
              x: endElement.options.line[0],
              y: endElement.options.line[1],
              z: routeZValue,
              floor: floorLabel,
              cameraList: endElement.patrol_camera
            })
          } else if (!endElement && currentLineIndex === before_lines.length - 2) {
            trajectory.push({
              id: res.data.id,
              x: before_lines[before_lines.length - 1].options.noodles[0][6],
              y: before_lines[before_lines.length - 1].options.noodles[0][7],
              z: routeZValue,
              floor: floorLabel,
              cameraList: before_lines[before_lines.length - 1].patrol_camera
            })
          }

          let cameraNumber = element.patrol_camera.length + nextElement.patrol_camera.length
          console.log(`本段路线共有相机：${cameraNumber} 个.`)
          console.log(`计划巡逻时间：${cameraNumber > 0 ? (cameraNumber * speed) : noDeviceRouteTime} s.`)

          // 获取本段巡游路线的整体时间
          const getRouteTime = () => {
            // 有相机的路线，整体巡逻时间，最小应该是相机的个数 * 单个设备巡逻速度
            if (cameraNumber > 0) {
              return cameraNumber * speed
            }

            return noDeviceRouteTime
          }

          const calcSpeed = () => {
            let distance = Math.sqrt(Math.pow((trajectory[0].x - trajectory[1].x), 2) + Math.pow((trajectory[0].y - trajectory[1].y), 2)) / 100
            console.log('两点之间的距离：', distance, ' m')
            let tempSpeed = distance / getRouteTime()
            console.log('速率： ', tempSpeed, ' m/s.')
            // 无设备巡逻帧率固定成设定的帧率。因为目前没办法计算精确的巡逻速率 m/s.
            if (cameraNumber === 0) {
              return noDeviceRouteTime
            }
            return tempSpeed
          }

          let goTrajectory = {
            "visible": true, // 路线是否可见
            // "style": "sim_arraw_Cyan",
            "style": "default",
            "width": 200,
            // "speed": 20,
            "speed": calcSpeed(),
            "geom": trajectory,
            "pitch": 25,
            "distance": 100
          }

          console.log("创建路线的数据", goTrajectory)

          // mp_light.StopRoute()
          // mp_light.Clear()
          mp_light.Clear()
          mp_light.Stop()

          Event.createRoute(mp_light, goTrajectory, false)

          let startTime = +new Date()

          setTimeout(() => {

            Event.playPatrolPath(mp_light, res => {
              // console.log('开始巡逻第：', currentLineIndex + 1, ' 段！', res)
              //
              // console.log(res)
              let currentEndPoint = trajectory[trajectory.length - 1]
              if ((res.x === trajectory[1].x && res.y === trajectory[1].y) || (
                // 有一种情况，第一个点和第二个点相距近，PlayRoute的回调的执行时机甚至在视角移动到第二个点后才执行，这时终点就取第3个点
                res.x === currentEndPoint.x && res.y === currentEndPoint.y)) {

                let endTime = +new Date()
                console.log('本段巡逻路线共耗时：', (endTime - startTime) / 1000, ' s.')

                patrolOneLine(++currentLineIndex)
              }
            })
          }, 0)

          // 播放相机
          // 上一段路线的有相机还没播放完，直接清除掉，从这一段路线的相机开始播放。
          clearTimeout(cameraPlayTimer.current)

          let allCameraNeedToPlay = [...element.patrol_camera, ...nextElement.patrol_camera]
          if (allCameraNeedToPlay.length > 0) {
            // 保存本段路线中需要播放的相机列表。以便在暂停以后，可以恢复播放
            cameraNeedToPlayList.current = allCameraNeedToPlay
            currentPlayCameraIndex.current = -1    // 总是从路线开始的第一个相机开始播放视频
            scheduleCameraPlay(allCameraNeedToPlay, 0)
          } else {
            cameraNeedToPlayList.current = []
            currentPlayCameraIndex.current = -1
          }
        }

        patrolOneLine(0)

        // before_lines.forEach(element => {
        //   trajectory.push({
        //     id: res.data.id,
        //     x: element.options.line[0],
        //     y: element.options.line[1],
        //     z: routeZValue,
        //     floor: floorLabel,
        //     cameraList: element.patrol_camera
        //   })
        // })
        // trajectory.push({
        //   id: res.data.id,
        //   x: before_lines[before_lines.length - 1].options.noodles[0][2],
        //   y: before_lines[before_lines.length - 1].options.noodles[0][3],
        //   z: routeZValue,
        //   floor: floorLabel,
        //   cameraList: before_lines[before_lines.length - 1].patrol_camera
        // })


        // Event.createRoute(mp_light,goTrajectory,false)

        return
        setTimeout(() => {
          if (before_lines[0].patrol_camera.length > 0) {
            before_lines[0].patrol_camera.forEach((elcs, index) => {
              (function (index) {
                setTimeout(() => {
                  // ------中院
                  videoPlay(elcs, "Patrol")
                  // ------汉中
                  // videoPlay({device_code:elcs.camera_code})
                }, index * 1500)
              }(index))
            })
          }
          Event.playPatrolPath(mp_light, ((msg) => {
            trajectory.forEach(element => {
              if (element.x === msg.x && element.y === msg.y) {
                if (element.cameraList.length > 0) {
                  element.cameraList.forEach((elc, index) => {
                    (function (index) {
                      setTimeout(() => {
                        // ------中院
                        videoPlay(elc, "Patrol")
                        // ------汉中
                        // videoPlay({device_code:elc.camera_code})
                      }, index * 1500)
                    }(index))
                  })
                }
              }
            });
          }))
        }, 100)
      }
    })
  }

  // 点击开始巡逻预案
  const startXL2 = (data) => {

    setShow(false)
    setShow2(true)
    setCount2(9)


    PlanList_p({plan_id: data.id}).then(res => {
      console.log(res)
      if (res.msg === "success") {
        let currentPatrolIndex = 0
        let planPatrolLines = Array.from(res.data)

        let planPatrolExec = (index) => {
          console.log(index, planPatrolLines.length)
          if (currentPatrolIndex < planPatrolLines.length) {
            startXL(planPatrolLines[currentPatrolIndex], () => {
              ++currentPatrolIndex
              setTimeout(() => {
                planPatrolExec(currentPatrolIndex)
              }, 10)
            })
          } else {
            console.log('巡逻预案结束！')
            handle_top2(1)
            currentPlayCameraIndex.current = -1
            clearTimeout(cameraPlayTimer.current)
            cameraPlayTimer.current = null
          }
        }

        planPatrolExec(currentPatrolIndex)

        return
        let before_lines = []
        res.data.forEach(element => {
          element.patrol_line_subsection.forEach(element2 => {
            before_lines.push(element2)
          });
        });

        var trajectory = []
        before_lines.forEach((element, index) => {
          trajectory.push({
            id: "yuan" + index,
            x: element.options.line[0],
            y: element.options.line[1],
            z: 400,
            floor: "F1",
            cameraList: element.patrol_camera
          })

        });
        trajectory.push({
          id: "yuan_end",
          x: before_lines[before_lines.length - 1].options.noodles[0][2],
          y: before_lines[before_lines.length - 1].options.noodles[0][3],
          z: 400,
          floor: "F1",
          cameraList: before_lines[before_lines.length - 1].patrol_camera
        })

        let goTrajectory = {
          "style": "sim_arraw_Cyan",
          "width": 200,
          "speed": speed,
          "geom": trajectory
        }
        console.log("创建路线的数据", trajectory)
        Event.createRoute(mp_light, goTrajectory, false)

        setTimeout(() => {
          if (before_lines[0].patrol_camera.length > 0) {
            before_lines[0].patrol_camera.forEach((elcs, index) => {
              (function (index) {
                setTimeout(() => {
                  videoPlay({
                    detail_info: {
                      camera_code: elcs.camera_code,
                      camera_name: elcs.camera_name
                    }
                  }, "Patrol")
                }, index * 1500)
              }(index))
            })
          }
          Event.playPatrolPath(mp_light, ((msg) => {
            trajectory.forEach(element => {
              if (element.x === msg.x && element.y === msg.y) {
                if (element.cameraList.length > 0) {
                  element.cameraList.forEach((elc, index) => {
                    (function (index) {
                      setTimeout(() => {
                        videoPlay({
                          detail_info: {
                            camera_code: elc.camera_code,
                            camera_name: elc.camera_name
                          }
                        }, "Patrol")
                      }, index * 1500)
                    }(index))
                  })
                }
              }
            });
          }))
        }, 100)
      }
    })
  }

  const handle_top2 = (index) => {
    setCount2(index)
    if (index === 1) {
      setShow(true)
      setShow2(false)
      setCount(0)
      setYcsb(false)
      //退出变回继续
      tabs2[0] = "暂停"
      setTabs2(tabs2)
      setStop(true)
      //退出清除路线
      Event.clearPatrolPath(mp_light)
      Common.initializationPosition(mp_light)
      Build.allShow(mp_light, true)
      clearTimeout(cameraPlayTimer.current)

    } else if (index === 2) {
      setYcsb(true)
    } else {
      setYcsb(false)
      // 点击了暂停
      if (stop) {
        tabs2[0] = "继续"
        setTabs2(tabs2)
        Event.pausePatrolPath(mp_light)
        setStop(false)

        clearTimeout(cameraPlayTimer.current)
      } else {
        tabs2[0] = "暂停"
        setTabs2(tabs2)
        Event.continuePatrolPath(mp_light)
        setStop(true)

        scheduleCameraPlay(cameraNeedToPlayList.current, currentPlayCameraIndex.current)
      }
    }
  }
  const handleEquipment = (value) => {

  }
  const changImg = async (event) => {
    var imgFile;
    let reader = new FileReader(); //html5读文件
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (event) { //读取完毕后调用接口
      imgFile = event.target.result;
      setImg(imgFile)
      setici(true)
    }
  }
  return (
    <div id="electronicPatrol">
      {
        !show2 ? <div className="elp_top">
          <ul>
            {tabs.map((item, index) => {
              return (
                <li className={count === index ? "li_active" : ""} key={index} onClick={() => {
                  setCount(index);
                  setShow(true)
                }}>{item}</li>
              )
            })}
          </ul>
        </div> : null
      }
      {
        count === 0 && show ? <div className="elp_content animate_speed animate__animated animate__fadeInLeft">
          <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={() => {
            setShow(false);
            Event.clearPatrolPath(mp_light)
          }}/>
          <div className="content_top">
            <h2>巡逻路线</h2>
          </div>
          <div className="content_list">
            <ul>
              {lineLists.map((item, index) => {
                return (
                  <li key={index}>
                    <span>{item.line_name}</span>
                    <div className="button" onClick={() => startXL(item)}>开始</div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="content_top3">
            <h2>巡逻预案</h2>
          </div>
          <div className="content_list3">
            <ul>
              {planLists.map((item, index) => {
                return (
                  <li key={index}>
                    <span>{item.plan_name}</span>
                    <div className="button" onClick={() => startXL2(item)}>开始</div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="content_top2">
            <h2>巡逻速度</h2>
          </div>
          <div className="xunluo_speed">
            <div className="change1">
              <span>无设备路线速度：</span>
              <input type="text" value={noDeviceRouteTime} onChange={(e) => setNoDeviceRouteTime(e.target.value)}/>
              <span>秒</span>
            </div>
            <div className="change2">
              <span>单个设备速度：</span>
              <input type="text" value={speed} onChange={(e) => setSpeed(e.target.value)}/>
              <span>秒</span>
            </div>
          </div>
        </div> : null
      }
      {
        count === 1 && show ? <div className="elp_content animate_speed animate__animated animate__fadeInLeft">
          <img className="cha" src={require('../../../assets/images/cha.png').default} alt=""
               onClick={() => setShow(false)}/>
          <div className="content_top">
            <h2>巡更历史记录</h2>
          </div>
          <div className="timeChange">
            <Space direction="horizontal" align="center">
              <div>
                <span>时间选择：</span>
                <DatePicker onChange={onChange} placeholder="请选择日期" locale={locale}/>
              </div>
              <div className="search">搜索</div>
            </Space>
          </div>
          <div className="thead">
            <ul>
              <li>时间</li>
              <li>地点</li>
              <li>管理员</li>
            </ul>
          </div>
          <div className="timeList">
            <ul>
              {
                timeList.map((item, index) => {
                  return (
                    <li key={index}>
                      <span>{item.time}</span>
                      <span>{item.address}</span>
                      <span>{item.name}</span>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div> : null
      }
      {
        !show && show2 ? <div className="startXL animate_speed animate__animated animate__fadeInLeft">
          <div className="start_top">
            <ul>
              {
                tabs2.map((item, index) => {
                  return (
                    <li className={count2 === index ? "li_active2" : ""} key={index}
                        onClick={() => handle_top2(index)}>{item}</li>
                  )
                })
              }
            </ul>
          </div>
          {
            ycsb_show ? <div className="error_upload animate_speed animate__animated animate__fadeInLeft">
              <img className="cha" src={require('../../../assets/images/cha.png').default} alt=""
                   onClick={() => setYcsb(false)}/>
              <div className="upload_top">
                <h2>异常上传</h2>
              </div>
              <div className="upload_data">
                <div className="camera_name">
                  <span>相机名称：</span>
                  <input type="text"/>
                </div>
                <div className="problems">
                  <span>常见问题：</span>
                  <Select style={{width: 180}} onChange={handleEquipment} placeholder="请选择类别">
                    {
                      problems.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
                <div className="problems2">
                  <span>常见问题：</span>
                  <textarea></textarea>
                </div>
                <div className="img_upload">
                  <span>上传文件：</span>
                  <div className="upload">
                    <input type="file" id="optUrl" ref={inputRef} hidden accept=".jpg,.jpeg,.png,.mp4"
                           onChange={(e) => changImg(e)}/>
                    <div className="imgBox" onClick={() => {
                      inputRef.current.click()
                    }}>
                      {
                        isChangeImg ? <img className="img2" src={UploadImg} alt=""/> : <Fragment>
                          <img className="img1" src={UploadImg} alt=""/>
                          <h5>点击上传</h5>
                        </Fragment>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="upload_button">保存信息</div>
            </div> : null
          }
        </div> : null
      }
    </div>
  )
}

export default ElectronicPatrol;