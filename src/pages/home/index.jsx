import React, { useState,useEffect,useLayoutEffect,Suspense,lazy,Fragment,useRef,useCallback  } from 'react';
import './style.scss'
import Header from '../../components/header'
import MapLight from '../../components/map_light'
import MapDark from '../../components/map_dark'
import { Model,createMap,Build } from '../../utils/map3d'
import { useMappedState,useDispatch } from 'redux-react-hook';
import Site from '../../components/site' //数字化工具
import SmallTools from '../../components/smallTools' //小工具
import Alarm from '../../components/alarm' //报警
import GradeAlarm from '../../components/gradeAlarm' //报警
import FloorList from '../../components/floorList' //楼层
import InterphonePopup from '../../components/interphonePopup' //对讲气泡
import CameraPopup from '../../components/cameraPopup' //摄像头气泡
import { cameraList_S,cameraRegion,getConfig_L } from '../../api/mainApi'
import { ASocekt as alarmS } from '../../api/address';
import { videoPlay } from '../../utils/untils'
import { message } from 'antd';
import { Common } from '../../utils/mapMethods'

function Home(){
    const ws = useRef(null);
    const siteRef = useRef(null);
    const mapDark = useRef(null)//黑暗地图延迟加载的问题
    const MapLight_M = useRef(null)//黑暗地图延迟加载的问题
    const liandong = useRef(null)//联动立即执行问题
    const dispatch = useDispatch();
    const top_module = useMappedState(state => state.top_navigation_module);
    const mp_light = useMappedState(state => state.map3d_light);
    const mp_dark = useMappedState(state => state.map3d_dark);
    const [ContentPage, setContentPage] = useState("div");//模块组件容器
    const [m_data,setData] = useState();//给子元素传值
    // eslint-disable-next-line
    const [c_data,setDataC] = useState();//摄像气泡传值
    const [dark,setDark] = useState(false)//切换场景
    const [dark_width,setDw] = useState("50%")//切换场景
    const [darkall,setDa] = useState(false)
    const [readyState, setReadyState] = useState('alarm_socket loading...');
    const [linkage,setLinkage] =useState(false)
    const [alarmData,setAlarmdata] = useState()

    const isSame = useRef(null) //防止重复点击
    //监听窗口事件
    useEffect(() => {
        window.addEventListener('beforeunload', function(){
            Model.closeIcon(mp_light)
            Build.allShow(mp_light,true)
        });
        // eslint-disable-next-line
    }, []);

    // 报警联动
    const webSocketInit = useCallback(() => {
        console.log('%c 报警socketReadyState:',"color: blue;font-size:13px",readyState)
        const stateArr = ['正在连接中','已经连接并且可以通讯','连接正在关闭','连接已关闭或者没有连接成功'];
        var beforeMsg = []
        if (!ws.current || ws.current.readyState === 3) {
            ws.current = new WebSocket(alarmS)
            ws.current.onopen = _e =>{
            ws.current?.send("subscribe")
                setReadyState(stateArr[ws.current?.readyState ?? 0]);
            }
            ws.current.onclose = _e =>
            setReadyState(stateArr[ws.current?.readyState ?? 0]);
            ws.current.onerror = e =>
            setReadyState(stateArr[ws.current?.readyState ?? 0]);
            ws.current.onmessage = e => {
                console.log(e,'报警收到的信息（非首次')
                if(e.data.length>10){
                    setAlarmdata(JSON.parse(e.data))
                    setDark(true)
                    siteRef.current.open(2,'parents')
                    //报警~弹视频控件
                    videoPlay(JSON.parse(e.data).device_info)
                    //延迟地图方法
                    setTimeout(()=>{
                        cameraList_S({device_code:JSON.parse(e.data).device_info.device_code}).then(res=>{
                            if(res.msg === "success"){
                                if(res.data.length>0){
                                    var results = res.data[0]
                                    var pos = {
                                        x:Common.filter(results.center.x)/100,
                                        y:Common.filter(results.center.y)/100
                                    }
                                    cameraRegion({positions:pos}).then(res=>{
                                        
                                        if(res.msg === "success"){

                                            if(liandong.current){
                                                /** 报警定位废弃
                                                 *  Common.mapFly(mapDark.current,results)
                                                 *  Common.mapFly(MapLight_M.current,results)
                                                 */
                                            }else{    
                                                if(res.data[0].length>0){
                                                    //报警闪闪
                                                    createMap.findObjectById(mapDark.current,res.data[0][0].real_name,msg=>{
                                                        const usebeforeMsg = {...msg}
                                                        Model.updatePolygon(mapDark.current,msg,"SplineOrangeHighlight1")
                                                        beforeMsg.push(usebeforeMsg)
                                                        dispatch({type:"alarmMsg",alarmMsg:beforeMsg});
                                                    })
                                                    //加线和文字
                                                    setTimeout(() => {
                                                        var points = results.list_style?results.list_style:results.center
                                                        var points2 = {
                                                            x:Common.filter(points.x),
                                                            y:Common.filter(points.y),
                                                            z:Common.filter(points.z),
                                                            pitch:Common.filter(points.pitch),
                                                            yaw:Common.filter(points.yaw),
                                                            roll:Common.filter(points.roll)
                                                        }
                                                        Model.createLineBj(mapDark.current,res.data[0][0].real_name,points2,JSON.parse(e.data).device_info.device_name,400,"#cef810")
                                                    }, 300)

                                                }else{
                                                    message.warning("此次报警无坐标值");
                                                }
                                            }
                                        }
                                    })
                                }else{
                                    message.warning("此次报警无坐标值");
                                }
                            }
                        })
                    },800)
                }else{
                    console.log(e.data,'报警socket进行了首次连接')
                }
            };
        }
        // eslint-disable-next-line
    }, [ws,readyState,linkage]);
    // 关闭模块
    const closePage = ()=>{
        dispatch({type:"handleTop",top_navigation_count:""});
        dispatch({type:"handleModule",top_navigation_module:""});
    }
    // 监听点击模型
    const getModel_s =(map3d)=>{
        if(map3d){
            window.receiveMessageFromIndex = function (e) {
                if (e !== undefined) {
                    switch (e.data.switchName) {
                        case 'model':
                            let msg = e.data.Personnel
                            if(isSame.current !== msg){
                                isSame.current = msg
                                //点击对讲模型
                                if(msg.attr.type_name === "对讲"){
                                    setData(msg.attr)
                                }else{
                                    //弹出视频控件
                                    if(msg.attr.detail_info){ 
                                        videoPlay(msg.attr)
                                    }else{
                                        message.warning("暂无视频编码");
                                    }
                                    //视频状态
                                    // setDataC(msg.attr)
                                }
                            }
                            break;
                        default:
                            return null;
                    }
                }
                return;
            }
            //监听message事件
            window.addEventListener("message", window.receiveMessageFromIndex, false);
        }
    }
    // 切换模块
    useLayoutEffect(() => {
        if (top_module !== "") {
            setContentPage(lazy(() => import(`../../components/module/${top_module}`)))
        }
    },[top_module])

    useEffect(() => {
        setTimeout(()=>{
            if(!(Object.keys(mp_light).length === 0)){
                getModel_s(mp_light)
                MapLight_M.current = mp_light;
            }
            if(!(Object.keys(mp_dark).length === 0)){
                mapDark.current = mp_dark;
                liandong.current = linkage;
            }else{
                webSocketInit()
            }
        },1000)
        // eslint-disable-next-line
    },[mp_light,mp_dark,webSocketInit,linkage])

    // 获取地图url配置
    const getMapURL =()=>{
        getConfig_L().then(res=>{
            if(res.msg ==="success"){
                let configMap = res.data[0]
                console.log(configMap,'接口获取地图url配置:')
                dispatch({type:"mp_light_url",mapLight_url:configMap.map_database_url});
                dispatch({type:"mp_dark_url",mapDark_url:configMap.digit_model_url});
            }
        })
    }
    useEffect(() => {
        getMapURL()
        // eslint-disable-next-line
    },[])
    return (
        <div className="home">
           <Header/>
            <div className="conent">
                {
                    dark?<div className="map">
                        {
                            darkall?<MapDark setWidth={dark_width}/>:
                            <Fragment>
                                <MapLight setWidth="50%"/>
                                <MapDark setWidth={dark_width}/>
                            </Fragment>
                        }
                    </div>:<div className="map"><MapLight setWidth="100%"/></div>
                }
                {top_module !== "" && <Suspense fallback={<div>"loading"</div>}>
                    <div className="popup">
                        <ContentPage close={closePage}/>
                    </div>
                </Suspense>}
                <div className="untils_site">
                    <Site ctrlcheck={setDark} ctrlwidth={setDw} ctrlall={setDa} ref={siteRef} stl={setLinkage}/>
                </div>
                <div className="untils_sTools">
                    <SmallTools/>
                </div>
                <div className="untils_alarm">
                    <Alarm/>
                </div>
                <div className="untils_floor">
                    <FloorList/>
                </div>
                <div className="untils_alarm2">
                    <GradeAlarm msgdata={alarmData}/>
                </div>
                <div className="untils_interPhone">
                    <InterphonePopup msgdata={m_data}/>
                </div>
                <div className="untils_cameraPopup">
                    <CameraPopup msgdata={c_data}/>
                </div>
            </div>
        </div>
    )
}

export default Home;