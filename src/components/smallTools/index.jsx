import React, { useState, useCallback } from 'react';
import { Common } from '../../utils/mapMethods';
import { useMappedState } from 'redux-react-hook';
import { roamflyList } from '../../api/mainApi';
import { createMap,Event } from '../../utils/map3d'
import { message } from 'antd';
import './style.scss'

const SmallTools = () => {
    const [isRoam, setRoam] = useState(false)
    const iconList = [{ icon: "fuwei", name: "复位" }, { icon: "changjing", name: "场景" }, { icon: "zhibeizhen", name: "指北" }, { icon: "roam", name: "漫游" }]
    const [roamList, setRoamList] = useState([])
    const [count, setCount] = useState()
    const [count2, setCount2] = useState()
    const [show, setShow] = useState(false)
    const mp_light = useMappedState(state => state.map3d_light);
    const mp_dark = useMappedState(state => state.map3d_dark);
    const [isOver,setOver] = useState(true)

    //获取漫游列表
    const getRoamList = ()=>{
        roamflyList().then(res => {
            if (res.msg === "success") {
                setRoamList(res.data)
            }
        })
    }
    const handleTool = useCallback((index) => {
        switch (index) {
            case 0:
                Common.initializationPosition(mp_light)
                if (!(JSON.stringify(mp_dark) === "{}")) {
                    Common.initializationPosition(mp_dark)
                }
                break;
            case 1:
                createMap.getCurrent(mp_light,msg=>{
                    console.log('坐标',msg)
                })
                break;
            case 3:
                getRoamList()
                setRoam(true)
                break;
            default:
                console.log(iconList[index].name)
        }
        //eslint-disable-next-line
    }, [mp_light,mp_dark])
    
    const roamLine = (type,item,index)=>{
        setOver(false)
        if(isOver || count2 === index){
            let ndatas = item.postions.points
            if(type === "stop"){
                setCount(index)
                Event.pausePatrolPath(mp_light)
            }else if(type === "Go_on"){
                setCount()
                Event.continuePatrolPath(mp_light)
            }else if(type === "start"){
                setCount()
                setCount2(index)
                let trajectory = [] 
                ndatas.forEach(element => {
                    trajectory.push({
                        id:item.id,
                        x:element.x,
                        y:element.y,
                        z:element.z,
                        floor:"F1"
                    })
                });
                let goTrajectory = {
                    "visible":false,
                    "style": "sim_arraw_Cyan",
                    "width": 200,
                    "speed":35,
                    "geom":trajectory
                }
                Event.createRoute(mp_light,goTrajectory,false)
                Event.playPatrolPath(mp_light,msg=>{
                    if(msg.x === trajectory[trajectory.length-1].x){
                        console.log("巡逻结束")
                        setOver(true)
                        setCount()
                        setCount2()
                        Event.clearPatrolPath(mp_light);
                    }
                })
            }else if(type === "end"){
                if(count2 === index){setOver(true)}
                setCount()
                setCount2()
                Event.clearPatrolPath(mp_light)
                Common.initializationPosition(mp_light)
            }
        }else{
            if(type === "end" && count2 === index){
                setOver(true)
            }else{
                message.warning("请先结束当前漫游路线");
            }
        }
    }

    //关闭漫游列表
    const closeRoam = ()=>{
        setOver(true)
        setCount()
        setCount2()
        Event.clearPatrolPath(mp_light);
        Common.initializationPosition(mp_light);
    }
    return (   
        <div id="smallTools">
            {
                show ? <div className={`${"st_iconlist animate_speed animate__animated"} ${"animate__slideInRight"}`}>
                    <div className="iconTools">
                        <ul>
                            {iconList.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => handleTool(index)}>
                                        <img className="img_active" src={require('../../assets/images/' + item.icon + '.png').default} alt="icon" />
                                        <span>{item.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {
                        isRoam ? <div className="roam animate_speed animate__animated animate__fadeIn">
                            <div className="roamTitle">
                                <h2>漫游</h2>
                                <img src={require('../../assets/images/cha.png').default} alt="" onClick={() => {closeRoam();setRoam(false)}} />
                            </div>
                            <ul>
                                {roamList.map((item, index) => {
                                    return (
                                        <li key={index} className={count2 === index?"active":""}>
                                            <span>{item.roam_name}</span>
                                            <div className="doSomething">
                                                <img src={require('../../assets/images/roamStart.png').default} alt="" onClick={() => roamLine("start",item,index)} />
                                                {
                                                    index === count? <img src={require('../../assets/images/roamGo_on.png').default} alt="" onClick={() => roamLine("Go_on",item,index)} />
                                                    :<img src={require('../../assets/images/roamStop.png').default} alt="" onClick={() => roamLine("stop",item,index)} />
                                                }
                                                <img src={require('../../assets/images/roamEnd.png').default} alt="" onClick={() => roamLine("end",item,index)} />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div> : null
                    }
                </div> : null
            }
            <div className="st_button" onClick={() => setShow(!show)}>
                <img src={require('../../assets/images/gongju-icon.png').default} alt="icon" />
                <span>小工具</span>
            </div>
        </div>
    )
}

export default SmallTools;