import React,{ useState,useEffect,useRef,Fragment } from 'react';
import { DatePicker,Space,Select } from 'antd';
import { lineList, lineAlllist, PlanList, PlanList_p, labelList } from '../../../api/mainApi';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { useMappedState } from 'redux-react-hook';
import { Common } from '../../../utils/mapMethods'
import { videoPlay } from '../../../utils/untils'
import { Build, Event } from '../../../utils/map3d'

import './style.scss'
const { Option } = Select;
const ElectronicPatrol = () => {
    const inputRef = useRef();
    const mp_light = useMappedState(state => state.map3d_light);
    const [UploadImg,setImg] = useState(require('../../../assets/images/up_load.png').default)
    const [isChangeImg,setici] = useState(false)
    // eslint-disable-next-line
    const [tabs,setTabs] = useState(["视频巡逻路线","电子巡更记录"])
    const [tabs2,setTabs2] = useState(["暂停","退出","异常上传"])
    const [show,setShow] = useState(true)//叉
    const [count,setCount] = useState(0)
    const [count2,setCount2] = useState()
    const [ycsb_show,setYcsb] = useState(false) //异常上报页面
    // eslint-disable-next-line
    const [problems,setProblem] = useState([{name:"撒打算",value:"0"},{name:"撒打算",value:"1"},{name:"撒打算",value:"2"}])
    const [show2,setShow2] = useState(false)//开始之后
    // eslint-disable-next-line
    const [timeList,setTimeList] = useState([
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"},
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"},
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"},
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"},
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"},
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"},
        {time:"11:10:13",address:"1号楼大门口",name:"赵萌萌"}
    ])
    // eslint-disable-next-line
    const [lineLists,setLineList] = useState([]) 
    const [planLists,setPlanList] = useState([])
    const [speed,setSpeed] = useState(5)
    const [stop,setStop] = useState(true)
    useEffect(()=>{
        getLinepatrol()
        getPlanList()
    },[]);
    //获取巡逻路线
    const getLinepatrol = () =>{
        lineList().then(res=>{
            if(res.msg === "success"){
                setLineList(res.data)
            }
        })
    }
    //获取巡预案路线
    const getPlanList = () =>{
        PlanList().then(res=>{
            if(res.msg === "success"){
                setPlanList(res.data)
            }
        })
    }
    const onChange=(date, dateString)=> {
        console.log(date, dateString);
    }
    const startXL = (value)=>{
        console.log(value)
        const floorId = value.floor_id
        const floorNumber = Build.getFloorNumberByFloorId(floorId)
        const floorName = Build.getFloorNameByFloorId(floorId)

        let isIndoor = value.indoor
        let buildId = value.build_id

        let routeZValue = 400
        let floorLabel = 'F1'

        if (floorNumber) {
            routeZValue *= floorNumber
        }

        // 是室内的室内的巡逻路线
        if (isIndoor) {
            // 获取这栋建筑内的所有楼层
            labelList({build_id: buildId}).then(res => {
                let floorList = res.data[0].floor_name.map(floor => floor.floor_name)
                Build.showFloor(mp_light, buildId, floorName, floorList)
                floorLabel = Build.getFloorLabelById(floorId)
            })
        }

        // return

        setShow(false)
        setShow2(true)
        setCount2(9)
        lineAlllist({id:value.id}).then(res=>{
            if(res.msg === "success"){
                var before_lines = res.data.patrol_line_subsection
                var trajectory =[]
                before_lines.forEach(element => {
                    trajectory.push({
                        id:res.data.id,
                        x:element.options.line[0],
                        y:element.options.line[1],
                        z:routeZValue,
                        floor: floorLabel,
                        cameraList:element.patrol_camera
                    })

                });
                trajectory.push({
                    id:res.data.id,
                    x:before_lines[before_lines.length-1].options.noodles[0][2],
                    y:before_lines[before_lines.length-1].options.noodles[0][3],
                    z:routeZValue,
                    floor: floorLabel,
                    cameraList:before_lines[before_lines.length-1].patrol_camera
                })

                let goTrajectory = {
                    "style": "sim_arraw_Cyan",
                    "width": 200,
                    "speed": speed,
                    "geom":trajectory
                }
                console.log("创建路线的数据",trajectory)
                Event.createRoute(mp_light,goTrajectory,false)

                setTimeout(()=>{
                    if(before_lines[0].patrol_camera.length>0){
                        before_lines[0].patrol_camera.forEach((elcs,index)=>{
                            (function(index){
                                setTimeout(()=>{
                                    // ------中院
                                    videoPlay(elcs,"Patrol") 
                                    // ------汉中
                                    // videoPlay({device_code:elcs.camera_code})
                                },index*1500)
                            }(index))
                        })
                    }
                    Event.playPatrolPath(mp_light,((msg)=>{
                        trajectory.forEach(element=> {
                            if(element.x === msg.x && element.y === msg.y){
                                if(element.cameraList.length>0){
                                    element.cameraList.forEach((elc,index)=>{
                                        (function(index){
                                            setTimeout(()=>{
                                                // ------中院
                                                videoPlay(elc,"Patrol")
                                                // ------汉中
                                                // videoPlay({device_code:elc.camera_code})
                                            },index*1500)
                                        }(index))
                                    })
                                }
                            }
                        });
                    }))
                },100)
            }
        })
    }

    const startXL2 = (data)=>{

        setShow(false)
        setShow2(true)
        setCount2(9)
        PlanList_p({plan_id:data.id}).then(res=>{
            console.log(res)
            if(res.msg === "success"){
                let before_lines = []
                res.data.forEach(element => {
                   element.patrol_line_subsection.forEach(element2 => {
                        before_lines.push(element2)
                   });
                });

                var trajectory =[]
                before_lines.forEach((element,index) => {
                    trajectory.push({
                        id:"yuan"+index,
                        x:element.options.line[0],
                        y:element.options.line[1],
                        z:400,
                        floor:"F1",
                        cameraList:element.patrol_camera
                    })

                });
                trajectory.push({
                    id:"yuan_end",
                    x:before_lines[before_lines.length-1].options.noodles[0][2],
                    y:before_lines[before_lines.length-1].options.noodles[0][3],
                    z:400,
                    floor:"F1",
                    cameraList:before_lines[before_lines.length-1].patrol_camera
                })

                let goTrajectory = {
                    "style": "sim_arraw_Cyan",
                    "width": 200,
                    "speed": speed,
                    "geom":trajectory
                }
                console.log("创建路线的数据",trajectory)
                Event.createRoute(mp_light,goTrajectory,false)

                setTimeout(()=>{
                    if(before_lines[0].patrol_camera.length>0){
                        before_lines[0].patrol_camera.forEach((elcs,index)=>{
                            (function(index){
                                setTimeout(()=>{
                                    videoPlay({detail_info:{camera_code:elcs.camera_code,camera_name:elcs.camera_name}},"Patrol") 
                                },index*1500)
                            }(index))
                        })
                    }
                    Event.playPatrolPath(mp_light,((msg)=>{
                        trajectory.forEach(element=> {
                            if(element.x === msg.x && element.y === msg.y){
                                if(element.cameraList.length>0){
                                    element.cameraList.forEach((elc,index)=>{
                                        (function(index){
                                            setTimeout(()=>{
                                                videoPlay({detail_info:{camera_code:elc.camera_code,camera_name:elc.camera_name}},"Patrol") 
                                            },index*1500)
                                        }(index))
                                    })
                                }
                            }
                        });
                    }))
                },100)
            }
        })
    }

    const handle_top2=(index)=>{
        setCount2(index)
        if(index === 1){
            setShow(true)
            setShow2(false)
            setCount(0)
            setYcsb(false)
            //退出变回继续
            tabs2[0] = "暂停"
            setTabs2(tabs2)
            setStop(true)
            //退出清除路线
            Event.clearPatrolPath(mp_light)
            Common.initializationPosition(mp_light)
            Build.allShow(mp_light, true)

        }else if(index === 2){
            setYcsb(true)
        }else{
            setYcsb(false)
            if(stop){
                tabs2[0] = "继续"
                setTabs2(tabs2)
                Event.pausePatrolPath(mp_light)
                setStop(false)
            }else{
                tabs2[0] = "暂停"
                setTabs2(tabs2)
                Event.continuePatrolPath(mp_light)
                setStop(true)
            }
        }
    }
    const handleEquipment=(value)=>{
        
    }
    const changImg = async (event) => {
        var imgFile;
        let reader = new FileReader(); //html5读文件
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (event) { //读取完毕后调用接口
            imgFile = event.target.result;
            setImg(imgFile)
            setici(true)
        }
    }
    return (
        <div id="electronicPatrol">
            {
                !show2?<div className="elp_top">
                    <ul>
                        {tabs.map((item, index) => {
                            return (
                                <li className={count === index?"li_active":""} key={index} onClick={()=>{setCount(index);setShow(true)}}>{item}</li>
                            )
                        })}
                    </ul>
                </div>:null
            }
            {
                count === 0 && show?<div className="elp_content animate_speed animate__animated animate__fadeInLeft">
                    <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>{setShow(false);Event.clearPatrolPath(mp_light)}}/>
                    <div className="content_top">
                        <h2>巡逻路线</h2>
                    </div>
                    <div className="content_list">
                        <ul>
                            {lineLists.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <span>{item.line_name}</span>
                                        <div className="button" onClick={()=>startXL(item)}>开始</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="content_top3">
                        <h2>巡逻预案</h2>
                    </div>
                    <div className="content_list3">
                        <ul>
                            {planLists.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <span>{item.plan_name}</span>
                                        <div className="button" onClick={()=>startXL2(item)}>开始</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="content_top2">
                        <h2>巡逻速度</h2>
                    </div>
                    <div className="xunluo_speed">
                        <div className="change1">
                            <span>无设备路线速度：</span>
                            <input type="text"/>
                            <span>秒</span>
                        </div>
                        <div className="change2">
                            <span>单个设备速度：</span>
                            <input type="text" onChange={(e)=>setSpeed(e.target.value)}/>
                            <span>秒</span>
                        </div>
                    </div>
                </div>:null
            }
            {
                count === 1 && show?<div className="elp_content animate_speed animate__animated animate__fadeInLeft">
                    <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>setShow(false)}/>
                    <div className="content_top">
                        <h2>巡更历史记录</h2>
                    </div>
                        <div className="timeChange">
                            <Space direction="horizontal" align="center">
                                <div>
                                    <span>时间选择：</span>
                                    <DatePicker onChange={onChange} placeholder="请选择日期" locale={locale}/>
                                </div>
                                <div className="search">搜索</div>
                            </Space>
                        </div>
                        <div className="thead">
                            <ul>
                                <li>时间</li>
                                <li>地点</li>
                                <li>管理员</li>
                            </ul>
                        </div>
                        <div className="timeList">
                            <ul>
                                {
                                    timeList.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <span>{item.time}</span>
                                                <span>{item.address}</span>
                                                <span>{item.name}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                </div>:null
            }
            {
                !show && show2?<div className="startXL animate_speed animate__animated animate__fadeInLeft">
                    <div className="start_top">
                        <ul>
                            {
                                tabs2.map((item, index) => {
                                    return (
                                        <li className={count2 === index?"li_active2":""} key={index} onClick={()=>handle_top2(index)}>{item}</li>
                                    )
                                })   
                            }
                        </ul>
                    </div>
                    {
                        ycsb_show?<div className="error_upload animate_speed animate__animated animate__fadeInLeft">
                            <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>setYcsb(false)}/>
                            <div className="upload_top">
                                <h2>异常上传</h2>
                            </div>
                            <div className="upload_data">
                                <div className="camera_name">
                                    <span>相机名称：</span>
                                    <input type="text"/>
                                </div>
                                <div className="problems">
                                    <span>常见问题：</span>
                                    <Select style={{ width: 180 }} onChange={handleEquipment} placeholder="请选择类别">
                                        {
                                            problems.map((item, index) => {
                                                return(
                                                    <Option key={index} value={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                                <div className="problems2">
                                    <span>常见问题：</span>
                                    <textarea></textarea>
                                </div>
                                <div className="img_upload">
                                    <span>上传文件：</span>
                                    <div className="upload">
                                        <input type="file" id='optUrl' ref={inputRef} hidden accept=".jpg,.jpeg,.png,.mp4" onChange={(e)=>changImg(e)}/>
                                        <div className="imgBox"  onClick={() => { inputRef.current.click()}}>
                                            {
                                                isChangeImg?<img className="img2" src={UploadImg} alt="" />:<Fragment>
                                                    <img className="img1" src={UploadImg} alt="" />
                                                    <h5>点击上传</h5>
                                                </Fragment>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="upload_button">保存信息</div>
                        </div>:null
                    }
                </div>:null
            }
        </div>
    )
}

export default ElectronicPatrol;