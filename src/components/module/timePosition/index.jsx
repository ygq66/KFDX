import React, { useState, useEffect } from 'react';
import { GetPeopleInside } from '../../../api/mainApi';
import { pSocket as PersonS } from '../../../api/address';
import touxiang from '../../../assets/images/touxiang.png';
import { Model } from '../../../utils/map3d';
import { useMappedState } from 'redux-react-hook';
import "./style.scss"

const TimePosition = (props) => {
    const mp_light = useMappedState(state => state.map3d_light);
    const [personList,setList] = useState([])
    
    useEffect(() => {
        getPersionList()
        watchPerson()
    })

    //socket实时监听人员
    const watchPerson = ()=>{
        const webSocket = new WebSocket(PersonS)
        webSocket.onopen = function (e) {
            console.log('%c 人员定位 websocket is open:',"color:red;font-size:13px")
        }
        webSocket.onmessage = function (e) {
            let results = JSON.parse(e.data)
            console.log(results,'socket发送给前端的数据')
            if(results.xAxis){
                getPersonIcon(results,{x:Number(results.xAxis),y:Number(results.yAxis)})
            }else{
                let allList = JSON.parse(JSON.stringify(personList))
                allList.push(results)
                setList(allList)
            }
        }
    }

    //获取人员列表
    const getPersionList = ()=>{
        GetPeopleInside().then(res => {
            if (res.msg === "Success") {
                setList(res.Data)
            }
        })
    }

    //加载人员图标
    const getPersonIcon = (data,pos)=>{
        Model.closeIcon(mp_light);
        setTimeout(() => {
            Model.createIcon(mp_light,{
                typeStyle: "dingwei",
                attr:data,
                location: {
                    x: repaclePosition(pos).x,
                    y: repaclePosition(pos).y,
                    z: 1000
                }
            },(msg)=>{
                console.log(msg,'加载完毕一个图标')
            })
        }, 100);
    }

    //换算坐标
    const repaclePosition = (map_pos)=>{
        let locationX1 = 967,locationY1 = -379,locationX2 = 671,locationY2 = -380,mapX1 = 2244.14990234375,mapY1 = 579.0184936523438,mapX2 = 1831.006103515625,mapY2 = 567.4622192382812;
        //获取差值
        let location_distance_x = locationX1 - locationX2;
        let location_distance_y = locationY1 - locationY2;
        let map_distance_x = mapX1 - mapX2;
        let map_distance_y = mapY1 - mapY2;
        //偏移精度
        let deviation_x = map_distance_x / location_distance_x;
        let deviation_y = map_distance_y / location_distance_y;
        //导出计算后的值
        let map_deviation_x = mapX1 - ( map_pos.x - locationX1) * deviation_x;
        let map_deviation_y = mapY1 - ( map_pos.y - locationY1) * deviation_y;
        let pos = { x:map_deviation_x, y:map_deviation_y };
        return pos;
    }

    return (
        <div className="TimePosition">
            <div className="TimePosition_top">
                <h1>实时定位</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={()=>props.close()} />
            </div>
            <div className="TimePosition_list">
                <ul>
                    {personList.map((item, index) => {
                        return (
                            <li key={index}>
                                <img className="TimePosition_list_tx" src={ item.personPic || touxiang} alt="" />

                                <div className="TimePosition_list_div">
                                    <span>{item.personName}</span>
                                    <div>
                                        <img src={require("../../../assets/images/guiji-icon.png").default} alt="" />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default TimePosition;