import React, { useState, useEffect, useLayoutEffect, Fragment, useRef } from 'react';
import { useMappedState } from 'redux-react-hook';
import { labelList, cameraList_S, roomList } from '../../api/mainApi';
import { Build, Model, createMap } from '../../utils/map3d';
import './style.scss';

const FloorList = () => {
    const map = useMappedState(state => state.map3d_light);
    const [flList, setFlist] = useState([])
    const [count, setCount] = useState()
    const [show, setShow] = useState(false)
    const [buildData, setBdata] = useState({ build_name: { name: "默认" } })
    const [everythings, setEverything] = useState([])
    const isClick = useRef(false)//同步进行延迟处理
    const dataRef = useRef({})//同步进行延迟处理
    const [allLabel, setLabel] = useState([])//所有的文字标注
    useEffect(() => {
        cameraList_S({ device_code: "" }).then(res => {
            if (res.msg === "success") {
                let shinei = []
                res.data.forEach(element => {
                    if (element.indoor) {
                        shinei.push(element)
                    }
                })
                setEverything(shinei)
            }
        })
    }, []);

    const getModelhandle = (mp) => {
        window.receiveMessageFromIndex = function (e) {
            if (e !== undefined) {
                switch (e.data.switchName) {
                    case 'buildLable':
                        console.log('点击了建筑牌子')
                        labelList({ build_id: e.data.Personnel }).then(res => {
                            if (res.msg === "success") {
                                setBdata(res.data[0])
                                setFlist(res.data[0].floor_name)
                                isClick.current = true;
                                dataRef.current = res.data[0];
                            }
                        })
                        setShow(true)
                        //监听相机模型事件触发楼层列表下标
                        if (e.data.index) { 
                            setCount(e.data.index - 1) 
                            getForPosition(e.data.floor_id)
                        } else { 
                            Build.allShow(mp, true) 
                            setCount()
                        }
                        break;
                    default:
                        return null;
                }
            }
            
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }

    useLayoutEffect(() => {
        if (!(Object.keys(map).length === 0)) {
            getModelhandle(map)
        }
         // eslint-disable-next-line
    }, [map]);
    //删除所有文字标注
    const del_label = () => {
        allLabel.forEach(element => {
            Model.removeGid(map, element.gid)
        });
    }
    //加载标注
    // eslint-disable-next-line
    const getFloorPosition = (buidId, floorId) => {
        roomList({ build_id: buidId, floor_id: floorId }).then(res => {
            if (res.msg === "success") {
                let neendObj = []
                res.data.forEach(results => {
                    let posX = 0, posY = 0, posZ = 0;
                    results.positions.points.forEach((ele) => {
                        posX += ele.x
                        posY += ele.y
                        posZ += ele.z
                    })
                    Model.labelLoading(map, {
                        text: results.room_name,
                        attr: results,
                        location: {
                            x: posX / 4,
                            y: posY / 4,
                            z: posZ / 4 / 2,
                            pitch: 0,
                            yaw: -390,
                            roll: results.positions.center.roll
                        },
                        fontcolor: "#ff0000",
                        fontsize: 80
                    }, msg => {
                        neendObj.push(msg)
                    })
                });
                setLabel(neendObj);
            }
        })
    }
    //分层模型加载
    const getForPosition = (fl)=>{
        cameraList_S({ device_code: "" }).then(res => {
            if (res.msg === "success") {
                let shinei = []
                res.data.forEach(element => {
                    if (element.indoor) {
                        shinei.push(element)
                    }else{
                        Model.showModel(map, element.model_url, true)
                    }
                })
                if(shinei.length>0){
                    shinei.forEach(element => {
                        if (element.floor_id === fl) {
                            Model.showModel(map, element.model_url, true)
                        } else {
                            Model.showModel(map, element.model_url, false)
                        }
                    });
                }
                setEverything(shinei)
            }
        })
    }
    //点击楼层
    const handleFloor = (item, index) => {
        del_label()
        // getFloorPosition(buildData.build_name.build_id, item.floor_id)
        //传给床位组件
        setCount(index)
        //分层
        var floorh = []
        buildData.floor_name.forEach(element => { floorh.push(element.floor_id.split("#")[1]) });
        var FLOOR=item.floor_id.split("#")[1].substr(0,1);
        if(FLOOR==="B"){
            createMap.showDM(true,map);
        }else{
            createMap.showDM(false,map);
        }
        Build.showFloor(map, buildData.build_name.build_id, item.floor_id.split("#")[1], floorh)
        //模型分层显示
        getForPosition(item.floor_id)
    }
    //关闭楼层
    const closeFloorList = () => {
        setCount()
        del_label()
        setShow(false);
        //关闭所有摄像头
        everythings.forEach(element => {
            Model.showModel(map, element.model_url, false)
        });
        //关闭分层
        // Build.allShow(map, true)
        let floorh2 = []
        buildData.floor_name.forEach(element => { floorh2.push(element.floor_id.split("#")[1]) });
        Build.showFloor(map, buildData.build_name.build_id, "all", floorh2)
    }
    return (
        <Fragment>
            {
                show ? <div id="floorList">
                    <div className="fl_title">
                        <span>{buildData.build_name.name}</span>
                        <img src={require("../../assets/images/closeBtn.png").default} alt="" onClick={() => closeFloorList()} />
                    </div>
                    <div className="fl_content">
                        <ul>
                            {flList.map((item, index) => {
                                return (
                                    <li key={index} className={count === index ? "acitve" : null} onClick={() => handleFloor(item, index)}>{item.name}</li>
                                )
                            })}
                        </ul>
                    </div>
                </div> : null
            }
        </Fragment>
    )
}

export default FloorList;