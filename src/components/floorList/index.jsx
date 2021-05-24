import React,{ useState,useEffect,useLayoutEffect,Fragment,useRef } from 'react';
import { useMappedState } from 'redux-react-hook';
import { labelList,cameraList_S,roomDetails } from '../../api/mainApi';
import { Build,Model } from '../../utils/map3d';
import { Common } from '../../utils/mapMethods'
import './style.scss';

const FloorList = () => {
    const map = useMappedState(state => state.map3d_light);
    const [flList,setFlist] = useState(["一层","二层","三层","四层","五层","六层","七层"])
    const [count,setCount] = useState()
    const [show,setShow] = useState(false)
    const [buildData,setBdata] = useState({build_name:{name:"默认"}})
    const [everythings,setEverything] = useState([])
    const isClick = useRef(false)//同步进行延迟处理
    const dataRef = useRef({})//同步进行延迟处理
    const [PolygonList,setPolygonList] = useState([])

    //关闭分层
    const closeFloor = (maps,data) =>{
        var floorh2 = []
        data.floor_name.forEach(element => {floorh2.push(element.floor_id.split("#")[1])});
        Build.showFloor(maps,data.build_name.build_id,"all",floorh2)
    }

    useEffect(()=>{
        cameraList_S({device_code:""}).then(res=>{
            if(res.msg === "success"){
                var shinei  = []
                res.data.forEach(element=>{
                    if(element.indoor){
                        shinei.push(element)
                    }
                })
                setEverything(shinei)
            }
        })
    },[]);

    const getModelhandle =(mp)=>{
        window.receiveMessageFromIndex = function (e) {
            if (e !== undefined) {
                switch (e.data.switchName) {
                    case 'buildLable':
                            console.log('点击了建筑牌子')
                            labelList({build_id:e.data.Personnel}).then(res=>{
                                if(res.msg === "success"){
                                    setBdata(res.data[0])
                                    setFlist(res.data[0].floor_name)
                                    isClick.current = true;
                                    dataRef.current = res.data[0];
                                }
                            })
                            setShow(true)
                            //监听相机模型事件触发楼层列表下标
                            if(e.data.index){setCount(e.data.index-1)}else{Build.allShow(mp,true)}
                        break;
                    default:
                        return null;
                }
            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }

    useLayoutEffect(()=>{
        if(!(Object.keys(map).length === 0)){
            getModelhandle(map)
        }
        // eslint-disable-next-line
    },[map]);
    //点击楼层
    const handleFloor = (item,index)=>{
        
        setCount(index)

        if(PolygonList.length>0){
            PolygonList.forEach((element)=>{
                Model.updatePolygon(map,element.positions,element.positions.style)
            })
        }
        //获取房间详情
        roomDetails({build_id:buildData.build_name.build_id,floor_id:item.floor_id}).then(res=>{
            if(res.msg === "success"){
                setPolygonList(res.data)
              
              
                // Common.mapFly(map,res.data[0].positions.center)
                if(res.data.length>0){
                    res.data.forEach((element)=>{
                        //画面
                        // element.positions.center.x= element.positions.center.x/100
                        // element.positions.center.y= element.positions.center.y/100
                        // element.positions.center.z= element.positions.center.z/100
                        var pos = {
                            x:Common.filter(element.positions.center.x)/100,
                            y:Common.filter(element.positions.center.y)/100
                        }
                          element.positions.center.x= pos.x
                          element.positions.center.y= pos.y
                          Model.createPolygon(map,element.positions.points)
                          Model.updatePolygon(map,element.positions,"gaoyadianwang_icon_Mat")
                        // 展示图标
                        // element.positions.push({
                        //     typeStyle:"shiyongzhong_Mat"
                        // })
                        // const json = {
                        //     typeStyle:'shiyongzhong_Mat',
                        //     location: {
                        //         x: Common.filter(element.positions.center.x),
                        //         y: Common.filter(element.positions.center.y),
                        //         z: Common.filter(element.positions.center.z),
                        //         pitch: Common.filter(element.positions.center.pitch),
                        //         yaw: Common.filter(element.positions.center.yaw),
                        //         roll: Common.filter(element.positions.center.roll)
                        //     }
                        // }
                        //Model.createIcon(map,json)
                        // Model.createIcon(map,element.positions)
                    })
                }
            }
        })
        //分层
        var floorh = []
        buildData.floor_name.forEach(element => {floorh.push(element.floor_id.split("#")[1])});
        Build.showFloor(map,buildData.build_name.build_id,item.floor_id.split("#")[1],floorh)
        //模型分层显示
        everythings.forEach(element => {
            if(element.floor_id === item.floor_id){
                Model.showModel(map,element.model_url,true)
            }else{
                Model.showModel(map,element.model_url,false)
            }
        });
    }
    //关闭楼层
    const closeFloorList = ()=>{
        setShow(false);
        closeFloor(map,buildData)
        if(PolygonList.length>0){
            PolygonList.forEach((element)=>{
                Model.updatePolygon(map,element.positions,element.positions.style)
            })
        }
    }
    return (
        <Fragment>
            {
                show? <div id="floorList">
                    <div className="fl_title">
                        <span>{buildData.build_name.name}</span>
                        <img src={require("../../assets/images/closeBtn.png").default} alt="" onClick={()=>closeFloorList()}/>
                    </div>
                    <div className="fl_content">
                        <ul>
                            {flList.map((item,index) => {
                                return (
                                    <li key={index} className={count === index?"acitve":null} onClick={()=>handleFloor(item,index)}>{item.name}</li>
                                )
                            })}  
                        </ul>
                    </div>
                </div>:null
            }
        </Fragment>
    ) 
}

export default FloorList;