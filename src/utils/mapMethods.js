import { createMap,Event,Model } from './map3d';
import { locationList } from '../api/mainApi'
export const Common = {
    //格式化坐标
    filter(value){
        return value?parseInt(value):0;
    },
    //飞行定位
    mapFly(map,data){
        createMap.FlyToPosition(map,{x:Common.filter(data.center.x),y:Common.filter(data.center.y),z:Common.filter(data.center.z),pitch:Common.filter(data.center.pitch),yaw:Common.filter(data.center.yaw),roll:Common.filter(data.center.roll)})
    },
    //初始化地图位置
    initializationPosition(map3d){
        locationList().then(res=>{
            if(res.msg === "success"){
                var resultsPosition = JSON.parse(res.data[0].position)
                let positionJson = {
                    x:resultsPosition.x,
                    y:resultsPosition.y,
                    z:resultsPosition.z,
                    pitch:resultsPosition.pitch,
                    yaw:resultsPosition.yaw,
                    roll:resultsPosition.roll
                }
                Common.mapFly(map3d,{center:positionJson})
            }
        })
    },  
    //往地图递归添加模型
    addModel(index,data,map3d){
        console.log("111,00");
        if(data[index].model_name !== null && data[index].model_url !== null){
            let position = data[index].list_style?data[index].list_style:data[index].center
            Model.modelLoading(map3d,{
                gid:data[index].model_url,
                filename:data[index].model_name,
                attr:data[index],
                location:{
                    x:Common.filter(position.x),
                    y:Common.filter(position.y),
                    z:Common.filter(position.z),
                    pitch:Common.filter(position.pitch),
                    yaw:Common.filter(position.yaw),
                    roll:Common.filter(position.roll)
                }
            },(msg)=>{
                if(++index<data.length){
                    setTimeout(()=>{Common.addModel(index,data,map3d);},0)
                }else{
                    console.log('模型加载完毕')
                    Model.getModel(map3d);
                }
            })
        }else{
            if(++index<data.length){
                setTimeout(()=>{Common.addModel(index,data,map3d);},0)
            }else{
                console.log('模型加载完毕')
                Model.getModel(map3d);
            }
        }
    },
    //导航地图效果清除
    navigationClose(map3d) {
        Model.closeIcon(map3d)
        Event.clearPatrolPath(map3d);
        //Model.getModel(map3d);   //5.22李帆帆进行调整，新加，解决头部导航点击之后鼠标点击之类的操作失灵
    }
}