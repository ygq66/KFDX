import React, { useState, useCallback } from 'react';
import { Common } from '../../utils/mapMethods';
import { useMappedState } from 'redux-react-hook';
import { roamflyList } from '../../api/mainApi';
import { Event } from '../../utils/map3d'
import './style.scss'

const SmallTools = () => {
    const [isRoam, setRoam] = useState(false)
    const iconList = [{ icon: "fuwei", name: "复位" }, { icon: "changjing", name: "场景" }, { icon: "zhibeizhen", name: "指北" }, { icon: "roam", name: "漫游" }]
    const [roamList, setRoamList] = useState([])
    const [count, setCount] = useState()
    const [show, setShow] = useState(false)
    const mp_light = useMappedState(state => state.map3d_light);
    const mp_dark = useMappedState(state => state.map3d_dark);
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
            case 3:
                setRoam(true)
                getRoamList()
                break;
            default:
                console.log(iconList[index].name)
        }
        //eslint-disable-next-line
    }, [mp_light,mp_dark])
    
    const roamLine = (type,item,index)=>{
        let ndatas = item.postions.points
        if(type === "stop"){
            setCount(index)
            Event.pausePatrolPath(mp_light)
        }else if(type === "Go_on"){
            setCount()
            Event.continuePatrolPath(mp_light)
        }else if(type === "start"){
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
                "style": "sim_arraw_Cyan",
                "width": 200,
                "speed":20,
                "geom":trajectory
            }
            Event.createRoute(mp_light,goTrajectory,false)
            Event.playPatrolPath(mp_light)
        }else if(type === "end"){
            setCount()
            Event.clearPatrolPath(mp_light)
            Common.initializationPosition(mp_light)
        }
    }
    return (
        <div id="smallTools">
            {
                show ? <div className="st_iconlist animate_speed animate__animated animate__fadeInRight">
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
                                <img src={require('../../assets/images/cha.png').default} alt="" onClick={() => {setRoam(false);Event.clearPatrolPath(mp_light)}} />
                            </div>
                            <ul>
                                {roamList.map((item, index) => {
                                    return (
                                        <li key={index}>
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