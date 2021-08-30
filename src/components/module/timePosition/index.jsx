import React, { useState, useEffect } from 'react';
import { GetPeopleInfo, GetlocationPaths } from '../../../api/mainApi';
import { pSocket as PersonS } from '../../../api/address';
import touxiang from '../../../assets/images/touxiang.png';
import { Model } from '../../../utils/map3d';
import { DatePicker, Space, Button, Empty, message } from 'antd';
import { Event } from '../../../utils/map3d';
import { useMappedState } from 'redux-react-hook';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import "./style.scss"

const TimePosition = (props) => {
    const TP_SOCKET = new WebSocket(PersonS);
    const mp_light = useMappedState(state => state.map3d_light);
    const [isRoute, setRoute] = useState(false);
    const [personList, setList] = useState([]);
    const [routeList, setRoutelist] = useState([]);
    const [personId, setPersonId] = useState();
    const [time, setTime] = useState({ stime: "", etime: "" });
    // eslint-disable-next-line
    const [person_iconList,setpiList] = useState([])

    useEffect(() => {
        //默认当前时间
        let nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
        setTime({ stime: nowTime, etime: nowTime })
        getPersionList()
        watchPerson()
        return () => {
            Model.closeIcon(mp_light);
            TP_SOCKET.close();
        }
        // eslint-disable-next-line
    },[])

    //socket实时监听人员
    const watchPerson = () => {
        TP_SOCKET.onopen = function (e) {
            console.log('%c 人员定位 websocket is open:', "color:red;font-size:13px")
        }
        TP_SOCKET.onmessage = function (e) {
            let results = JSON.parse(e.data)
            if (results.xAxis) {
                // Model.removeGid()
                getPersonIcon(results, { x: Number(results.xAxis), y: Number(results.yAxis) })
            } else {
                console.log(results,"除人员定位以外的socket信息并进行列表刷新")
                getPersionList()
            }
        }
        TP_SOCKET.onclose = () => {
            console.log('关闭人员定位 socket')
        }
    }

    //获取人员列表
    const getPersionList = () => {
        GetPeopleInfo().then(res => {
            if (res.msg === "Success") {
                setList(res.Data)
            }
        })
    }

    //加载人员图标
    const getPersonIcon = (data, pos) => {
        Model.closeIcon(mp_light);
        setTimeout(() => {
            Model.createIcon(mp_light, {
                typeStyle: "dingwei",
                attr: data,
                location: {
                    x: repaclePosition(pos).x,
                    y: repaclePosition(pos).y,
                    z: 0
                }
            }, (msg) => {
                console.log(msg, '图标加载完毕')
                setpiList(msg)
            })
        }, 100);
    }

    //换算坐标
    const repaclePosition = (loc_pos) => {
        let locationX1 = 0, locationY1 = 0, locationX2 = 867, locationY2 = -519, mapX1 = 201.81576538085938, mapY1 = -100.05974578857422, mapX2 = 1524.793212890625, mapY2 = 830.1629638671875;
        //获取差值
        let location_distance_x = locationX1 - locationX2;
        let location_distance_y = locationY1 - locationY2;
        let map_distance_x = mapX1 - mapX2;
        let map_distance_y = mapY1 - mapY2;
        //偏移精度
        let deviation_x = map_distance_x / location_distance_x;
        let deviation_y = map_distance_y / location_distance_y;
        //导出计算后的值
        let map_deviation_x = mapX1 - (locationX1 - loc_pos.x) * deviation_x;
        let map_deviation_y = mapY1 - (locationY1 - loc_pos.y) * deviation_y;
        let pos = { x: map_deviation_x, y: map_deviation_y };
        return pos;
    }

    //搜索历史轨迹
    const searchRoute = () => {
        if (time.stime === "" || time.stime === "") {
            message.warning("参数不全");
        } else {
            GetlocationPaths({
                registerCode: personId,
                beginTime: time.stime,
                endTime: time.etime
            }).then(res => {
                if (res.msg === "Success") {
                    let results = res.Data.data.maps[0].details;
                    if(results !== null){
                        let needRouteList = []
                        setRoutelist(results)
                        results.forEach(element => {
                            needRouteList.push({
                                id:element.cameraIndexCode,
                                x:repaclePosition({x:element.indexPointX,y:element.indexPointY}).x,
                                y:repaclePosition({x:element.indexPointX,y:element.indexPointY}).y
                            })
                        });
                        if(needRouteList.length>0){
                            getFaceRoute(needRouteList)
                        }
                    }else{
                        message.warning("暂无数据")
                    }
                }
            })
        }
    }

    //修改时间
    const timeChange = (date, dateString, type) => {
        setTime({ ...time, [type]: dateString })
    }

    //轨迹方法
    const getFaceRoute = (data) => {
        Event.clearPatrolPath(mp_light)
        //拼接数据
        let trajectory = []
        if (data.length > 0) {
            data.forEach((element, index) => {
                if (index > 0) {
                    trajectory.push({
                        id: element.id,
                        x: element.x,
                        y: element.y,
                        z: 200,
                        floor: "F1"
                    })
                }
            })
        }
        let goTrajectory = {
            "style": "sim_arraw_Cyan",
            "width": 200,
            "speed": 20,
            "geom": trajectory
        }
        //判断轨迹点数长度
        if (trajectory.length > 1) {
            Event.createRoute(mp_light, goTrajectory,false)
        } else {
            message.warning("没有轨迹路线")
        }
    }

    return (
        <div className="TimePosition">
            <div className="TimePosition_top">
                <h1>实时定位</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => {props.close();Event.clearPatrolPath(mp_light)}} />
            </div>
            <div className="TimePosition_list">
                <ul>
                    {personList.map((item, index) => {
                        return (
                            <li key={index}>
                                <img className="TimePosition_list_tx" src={item.personPic || touxiang} alt="" />

                                <div className="TimePosition_list_div">
                                    <span>{item.personName}</span>
                                    <div className="positionIcon">
                                        <img src={require("../../../assets/images/guiji-icon.png").default} alt="" onClick={() => { setRoute(true); setPersonId(item.id)} } />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {
                isRoute ? <div className="Routes">
                    <div className="route_header">
                        <h1>历史轨迹</h1>
                        <img src={require('../../../assets/images/cha.png').default} alt="" onClick={() => {setRoute(false);Event.clearPatrolPath(mp_light)}} />
                    </div>
                    <div className="routeSearch">
                        <div className="time_start">
                            <Space><span>起始时间：</span><DatePicker onChange={(date, dateString) => timeChange(date, dateString, 'stime')} format="YYYY-MM-DD HH:mm:ss" defaultValue={moment()} placeholder="请选择日期" locale={locale} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} /></Space>
                        </div>
                        <div className="time_end">
                            <Space><span>结束时间：</span><DatePicker onChange={(date, dateString) => timeChange(date, dateString, 'etime')} format="YYYY-MM-DD HH:mm:ss" defaultValue={moment()} placeholder="请选择日期" locale={locale} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} /></Space>
                        </div>
                        <div className="search">
                            <Button type="primary" onClick={() => searchRoute()}>搜索</Button>
                        </div>
                    </div>
                    {
                        routeList.length > 0 ? <div className="routeList">
                            <ul>
                                <li className="title"><span>地点</span><span>时间</span></li>
                                {routeList.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <span>{item.areaName}</span>
                                            <span>{moment(item.enterTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div> : <Empty style={{ marginTop: "100px" }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                    }
                </div> : null
            }
        </div>
    )
}

export default TimePosition;