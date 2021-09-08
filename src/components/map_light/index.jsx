import React,{ useEffect } from 'react';
import { createMap,Model,Build } from '../../utils/map3d';
import { Common } from '../../utils/mapMethods';
import { useMappedState,useDispatch } from 'redux-react-hook';
import { cameraList_S,labelLists } from '../../api/mainApi'
import './style.scss'

const MapLight = (props) => {
    const dispatch = useDispatch();
    const mapUrl = useMappedState(state => state.mapLight_url);
    useEffect(() => {
        if(mapUrl){createMapsss("http://"+mapUrl)}
        // eslint-disable-next-line
    },[mapUrl])
    const createMapsss =(url)=>{
        var map_light = createMap.createMap({
            id: "mapv3dContainer_light",
            url:url,
            projectId: "5nbmjsdljf785208",
            token: "rt2d645ty3eadaed32268mdta6"
        },(()=>{
            dispatch({type:"mp_light",map3d_light:map_light});
            //初始化位置
            setTimeout(() => {
                Common.initializationPosition(map_light)
            },0);
            setTimeout(() => {
                Build.allShow(map_light,true)
                cameraList_S().then(res=>{
                    var results = res.data;
                    setTimeout(() => {
                        Common.addModel(0,results,map_light)
                    }, 500);
                })
                //创建文字标注
                labelLists().then(res=>{
                    if(res.msg === "success"){
                        var res2Data = res.data;
                        res2Data.forEach((element2,index2)=>{
                            var labelData = JSON.parse(element2.label_style.model)
                            var labelPosition = labelData.location
                            Model.labelLoading(map_light,{
                                text:element2.label_name,
                                attr:element2,
                                location:{
                                    x:Common.filter(labelPosition.x),
                                    y:Common.filter(labelPosition.y),
                                    z:Common.filter(labelPosition.z),
                                    pitch:Common.filter(labelPosition.pitch),
                                    yaw:Common.filter(labelPosition.yaw),
                                    roll:Common.filter(labelPosition.roll)
                                },
                                fontcolor:labelData.fontcolor,
                                fontsize:labelData.fontsize
                            })
                        })
                    }
                })
            },100);
        }))
    }
    return (
        <div id="mapv3dContainer_light" style={{width:props.setWidth}}></div>
    )
}

export default MapLight;