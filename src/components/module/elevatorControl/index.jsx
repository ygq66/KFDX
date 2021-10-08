import React, { useState, useEffect } from 'react';
import EleCtrlLeft from './eleCtrlLeft';
import EleCtrlRight from './ele_ctrl_right';
import { createMap,Model,Event } from '../../../utils/map3d';
import { eSocket as elvtorSocket } from '../../../api/address';
import { message } from 'antd';
import { useMappedState } from 'redux-react-hook';
import "./style.scss"
const ElevatorControl = () => {

    const mp_dark = useMappedState(state => state.map3d_dark);
    const ELE_SOCKET = new WebSocket(elvtorSocket);
    const diantiList = [
        {gid:"DianTi_F1_F2_B_10",floorType:"F1_F2"},
        {gid:"DianTi_F1_F3_B_5",floorType:"F1_F3"},
        {gid:"DianTi_F1_F4_B_2",floorType:"F1_F4"},
        {gid:"DianTi_F1_F5_B_2",floorType:"F1_F5"},
        {gid:"DianTi_F5_F4_B_7",floorType:"F5_F4"},
        {gid:"DianTi_F5_F3_B_2",floorType:"F5_F3"},
        {gid:"DianTi_F5_F2_B_2",floorType:"F5_F2"},
        {gid:"DianTi_F5_F1_B_6",floorType:"F5_F1"},
    ]
    const [floorLists,setFloors] = useState([
        {
            id:"ff1",
            floor:"F1",
            x:3558.431640625,
            y:4228.70849609375,
            z:380.993774414063
        },
        {
            id:"ff2",
            floor:"F2",
            x:3558.431640625,
            y:4228.70849609375,
            z:700.993774414063
        }
    ])

    useEffect(() => {
        // watchElevatot()
        randomFloor()
        setInterval(() => {
            randomFloor()
        }, 6000);
        return ()=>{
            ELE_SOCKET.close();
        }
        // eslint-disable-next-line 
    },[])

    //所有电梯隐藏
    const dianti_all_hide = ()=>{
        diantiList.forEach(element => {
            Model.showModel(mp_dark,element.gid,false)
        });
    }
    //自定义数据
    const randomFloor = ()=>{
        dianti_all_hide()
        let goTrajectory = {
            "style": "sim_arraw_Cyan",
            "width": 200,
            "speed":50,
            "geom":floorLists
        }
        Event.createRoute(mp_dark,goTrajectory,false)

        var typeFloor = diantiList[Math.floor(Math.random()*(7+1))].floorType
        message.warning("动画楼层："+ typeFloor)

        diantiList.forEach(element => {
            if(element.floorType === typeFloor){
                Model.showModel(mp_dark,element.gid,true)
            }else{
                Model.showModel(mp_dark,element.gid,false)
            }
        });
    }
    //监听电梯数据
    const watchElevatot= () => {
        ELE_SOCKET.onopen = function (e) {
            console.log('%c 电梯数据 websocket is open:', "color:red;font-size:13px")
        }
        ELE_SOCKET.onmessage = function (e) {
            dianti_all_hide()
            //画线
            let results = JSON.parse(e.data)
            let goTrajectory = {
                "style": "sim_arraw_Cyan",
                "width": 200,
                "speed":50,
                "geom":floorLists
            }
            Event.createRoute(mp_dark,goTrajectory,false)
            //电梯动画
            var typeFlr = results.depart.floor_name.replace("00","")+"_"+results.arrive.floor_name.replace("00","")
            console.log(typeFlr,'typeFlr')
            message.warning("动画楼层："+ typeFlr)
            diantiList.forEach(element => {
                if(element.floorType === typeFlr){
                    Model.showModel(mp_dark,element.gid,true)
                }else{
                    Model.showModel(mp_dark,element.gid,false)
                }
            });
        }
        ELE_SOCKET.onclose = () => {
            console.log('关闭电梯数据 socket')
        }
    }

    return (
        <div id="elevatorControl">
            <EleCtrlLeft/>
            <EleCtrlRight/>
        </div>
    )
}

export default ElevatorControl;