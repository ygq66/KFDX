import React, {useState,useRef,useLayoutEffect,Fragment} from 'react';
import { DatePicker,Space,Slider,Empty,message,Spin } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { businessFace,businessSearch,infoList,labelList,buildList } from '../../../api/mainApi'
import { useMappedState } from 'redux-react-hook';
import { Event,Build } from '../../../utils/map3d';
import { Common } from '../../../utils/mapMethods';
import { videoPlay } from '../../../utils/untils'
import { lwIP as luWang,lwName as luwangName } from '../../../api/address';
import updataImg from '../../../assets/images/shangchuan.png'
import moment from 'moment';
import "./style.scss"

const FaceApplication =(props)=>{
    const inputRef = useRef();
    const mp_light = useMappedState(state => state.map3d_light);
    const [tabs] = useState(["相机应用","人脸检索"])
    const [imgTabs] = useState(["上传图片","人脸库"])
    const [tabCount,setTabCount] = useState(0)
    const [imgtabCount,setImgTabCount] = useState()
    const [rlzpCount,setTabRlzpCount] = useState()
    const [left,setLeft] = useState(true)//人脸应用
    const [videoShow,setVideo]= useState(false)
    const [isChoose,setIchoose] = useState(false)//是否选择照片
    const [renImg,setRenImg] = useState(false)
    const [baifenbi,setbfb]= useState(50)
    const [whoTrack,setTrack] = useState(true)
    const [UploadImg,setImg] = useState()
    const [cameraList,setCamera] = useState([])
    // eslint-disable-next-line
    const [rlzpList,setRLZP] = useState([{address:"2楼1号大厅",time:"15:30:00",img:require('../../../assets/images/demo.jpg').default},{address:"2楼1号大厅",time:"15:30:00",img:require('../../../assets/images/demo.jpg').default},{address:"2楼1号大厅",time:"15:30:00",img:require('../../../assets/images/demo.jpg').default},{address:"2楼1号大厅",time:"15:30:00",img:require('../../../assets/images/demo.jpg').default},{address:"2楼1号大厅",time:"15:30:00",img:require('../../../assets/images/demo.jpg').default},{address:"2楼1号大厅",time:"15:30:00",img:require('../../../assets/images/demo.jpg').default}])
    const [renData,setRenData] = useState([])
    const [time,setTime] = useState({stime:"",etime:""})
    const [trackClick,setrackClick] = useState()//点击日期变黄
    const [trackClick2,setrackClick2] = useState(false)//点击日期出现人脸列表
    // eslint-disable-next-line
    const [sliderBottom,setSb] = useState(true)
    const [cameraListS,setSlist] = useState([])
    const [cameraListS2,setSlist2] = useState([])
    const [renSelect,setRenSelect] = useState({name:"",cardid:""})//人脸库查询
    const [isRlgj,setRlgj] = useState(false)
    const [spinning,setSpinning] = useState(false)
    useLayoutEffect(()=>{
        getFacelibrary()
        getXjyy()
        // eslint-disable-next-line
    },[]);
    // 获取相机应用相机列表
    const getXjyy = () =>{
        infoList({type_id:"10001_02_04"}).then(res=>{
            if(res.msg === "success"){
                setCamera(res.data)
            }
        })
    }
    //人脸库数据
    const getFacelibrary = ()=>{
        businessFace({name:"",cardid:""}).then(res=>{
            if(res.msg === "success"){
                renSupplement(res.data)
            }else{
                message.error("人脸库数据出错")
            }
        })
    }
    //人脸库样式补位
    const renSupplement =(data)=>{
        if(!(data.length % 4 === 0)){
            if(data.length<4){
                let number_r =  4-(data.length)
                for(let i = 0;i<number_r;i++){
                    data.push({name:"zw"})
                    setRenData(data)
                }
            }else{
                let number_r =  4-(data.length%4)
                for(let i = 0;i<number_r;i++){
                    data.push({name:"zw"})
                    setRenData(data)
                }
            }
        }
    }
    //大类选择
    const tabClick =(index)=>{
        setTabCount(index)
        setLeft(false)
        if(index === 0){
            setLeft(true)
            setrackClick2(false)
            setRenImg(false)
        }else{
            setLeft(false)
        }
    }
    //人脸图片||人脸库
    const imgTabChange = (index)=>{
        setImgTabCount(index)
        if(index === 0){
            Event.clearPatrolPath(mp_light)
            inputRef.current.click()
            setRenImg(false)
        }else{
            setRenImg(true)
            setrackClick2(false)
        }
    }
    //右侧图片上传
    const chooseImg = async (event) => {
        var imgFile;
        let reader = new FileReader(); //html5读文件
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (event) { //读取完毕后调用接口
            imgFile = event.target.result;
            setIchoose(true)
            setImg(imgFile)
        }
    }
    const timeChange1 =(date, dateString)=>{
        setTime({...time,stime:dateString})
    }
    const timeChange2 =(date, dateString)=>{
        setTime({...time,etime:dateString})
    }
    const formatter=(value)=> {
        return `${value}%`;
    }
    const handleSlider =(value)=>{
        setbfb(value)
    }
    const style = {
        display: 'inline-block',
        width:160,
        marginLeft:8
    };
    //搜索
    const searchButton =()=>{
        if(time.stime && time.etime && UploadImg){
            setSpinning(true)
            setRenImg(false)
            businessSearch({
                threshold:baifenbi.toString(),
                startTime:time.stime,
                endTime:time.etime,
                base64Img:UploadImg
            }).then(res=>{
                if(res.msg === "success"){
                    setRlgj(true)
                    setSlist(res.data)
                    setSpinning(false)
                    if(res.data[0].time){
                        setTrack(false)
                    }else{
                        setTrack(true)
                    }
                }else{
                    setSpinning(false)
                }
            })
        }else{
            message.warning("参数不能为空")
        }
    }
    //人脸库条件查询
    const searchRen = ()=>{
        let renSelect_HH;
        if(!(renSelect.name === "" && renSelect.cardid === "")){
            renSelect_HH = renSelect;
        }
        businessFace(renSelect_HH).then(res=>{
            if(res.msg === "success"){
                if(res.data.length === 0){
                    setRenData([])
                }else{
                    renSupplement(res.data)
                    setRenSelect({name:"",cardid:""})
                }
            }
        })
    }

    //多个天数点击日期
    const moreTime = (ele,index)=>{
        Build.allShow(mp_light,true)
        Event.clearPatrolPath(mp_light)
        setRenImg(false)
        setrackClick(index)
        setrackClick2(true);
        setSlist2(ele.list)
        let trajectory =[]
        if(ele.list.length>0){
            ele.list.forEach((element)=>{
                let flString;
                flString = element.floor_id === null?"F1":element.floor_id.split("#")[1].replace("00","")
                trajectory.push({
                    id:element.id,
                    x: parseInt(element.center.x),
                    y: parseInt(element.center.y),
                    z: parseInt(element.center.z),
                    floor:flString
                })
            })
        }
        let goTrajectory = {
            "style": "sim_arraw_Cyan",
            "width": 200,
            "speed": 20,
            "geom":trajectory
        }
        if(trajectory.length>1){
            //飞行
            // Common.mapFly(mp_light,ele.list[0])
            //路线经过掀层
            let minFloor = parseInt(ele.list[0].floor_id.split("#")[1].replace("F00",""));
            ele.list.forEach((element)=>{
                if(parseInt(element.floor_id.split("#")[1].replace("F00","")) < minFloor) {
                    minFloor = element.floor_id.split("#")[1].replace("F00","")
                }
            })

            buildList().then(res=>{
                if(res.msg === "success"){
                    res.data.forEach((element)=>{
                        labelList({build_id:element.build_id}).then(res2=>{
                            if(res2.msg === "success"){
                                var flistList = [];
                                res2.data[0].floor_name.forEach(element2 => {flistList.push(element2.floor_id.split("#")[1])});
                                Build.showFloor(mp_light,element.build_id,"F00"+minFloor,flistList)
                            }
                        })
                    })
                }
            })
            //人脸轨迹方法
            Event.createRoute(mp_light,goTrajectory,false,luwangName,"http://"+luWang+"/api/route/shortestpath4",10)
        }else{
            message.warning("没有轨迹路线")
        }
    }
    //打开视频控件
    const goVideo = (item)=>{
        if(item.detail_info){
            videoPlay(item)
        }
    }
    //选择人脸库图片
    const handleImg = (item)=>{
        setIchoose(true)
        setImg(item.faceUrl)
    }
    //相机列表-飞行
    const flyToCarmea = (item)=>{
        Common.mapFly(mp_light,item)
    }
    const style2 = { 
        cursor:"not-allowed",
        opacity:.5
    }
    return(
        <div id="FaceApplication" className="animate_speed animate__animated animate__fadeInLeft">
            <div className="fl_header">
                <h1>人脸应用</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={()=>{props.close();Event.clearPatrolPath(mp_light);Build.allShow(mp_light,true)}} />
            </div>
            <div className="fl_content">
                <div className="tabChange">
                    <ul>
                        {tabs.map((item, index) => {
                            return (
                                <li className={tabCount === index?"tabActive":null} key={index} onClick={()=>tabClick(index)}>{item}</li>
                            )
                        })}
                    </ul>
                </div>
                <div className="fl_r_content">
                    {
                        left?<div className="cameraList">
                            <ul>
                                {cameraList.length>0?cameraList.map((item, index) => {
                                    return (
                                        <li key={index} onClick={()=>setVideo(true)}>
                                            <img src={require("../../../assets/images/camera_icon.png").default} alt=""/>
                                            <span>{item.device_name}</span>
                                        </li>
                                    )
                                }):<Empty style={{marginTop:"200px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
                            </ul>
                        </div>:<div className="faceSearch">
                            <div className="upload">
                                <input type="file" id='optUrl' ref={inputRef} hidden accept=".jpg,.jpeg,.png,.mp4" onChange={(e)=>chooseImg(e)}/>
                                <div className="imgBox">
                                    {
                                        isChoose?<img className="img2" src={UploadImg} alt="" />:<Fragment>
                                            <img className="img1" src={updataImg} alt="" />
                                        </Fragment>
                                    }
                                </div>
                            </div>
                            <div className="imgType">
                                <ul>
                                    {imgTabs.map((item, index) => {
                                        return (
                                            <li className={imgtabCount === index?"tabActive":null} key={index} onClick={()=>imgTabChange(index)}>{item}</li>
                                        )
                                    })}
                                </ul>
                                <div className="time">
                                    <div className="time_start">
                                        <Space><span>起始时间：</span><DatePicker onChange={timeChange1} format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" locale={locale} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/></Space>
                                    </div>
                                    <div className="time_end">
                                        <Space><span>结束时间：</span><DatePicker onChange={timeChange2} format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" locale={locale} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/></Space>
                                    </div>
                                    <div className="slider" >
                                        <span>相似度：</span><Slider  style={style} defaultValue={baifenbi} tipFormatter={formatter} onChange={handleSlider}/><span style={{marginLeft:"5px"}}>{baifenbi}%</span>
                                    </div>
                                </div>
                                <div className="seach_button">
                                    <span className="button" onClick={()=>spinning?null:searchButton()} style={spinning?style2:null}>搜索</span>
                                </div>
                            </div>
                            
                                <div className="renTrack">
                                    {/* 当天的 */}
                                    {
                                        cameraListS.length>0?null:<div style={{width:"300px",height:"90px"}}></div>
                                    }
                                    <Spin spinning={spinning} tip="数据加载量大 请耐心等待...">
                                        {
                                            isRlgj?<div>
                                                    {
                                                        whoTrack?<div className="trackOneDay">
                                                            <h3>人脸相机列表</h3>
                                                            <ul>
                                                                {cameraListS.length>0?cameraListS.map((item, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <div className="ondayLeft">
                                                                                <img src={require("../../../assets/images/camera_icon.png").default} alt=""/>
                                                                                <span>{item.device_name}</span>
                                                                            </div>
                                                                            <img className="playVideo" src={require("../../../assets/images/play_video1.png").default} alt="" onClick={()=>imgTabChange(index)}/>
                                                                        </li>
                                                                    )
                                                                }):<Empty style={{marginTop:"50px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
                                                            </ul>
                                                            {/* 多天的 */}
                                                        </div>:<div className="moreDay"> 
                                                            <table>
                                                                <thead><tr><td>序号</td><td>日期</td><td>统计</td></tr></thead>
                                                                <tbody>
                                                                    {cameraListS.length>0?cameraListS.map((ele, index) => {
                                                                            return(
                                                                                <tr key={index} className={trackClick === index?"active":""} onClick={()=>moreTime(ele,index)}>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{ele.time}</td>
                                                                                    <td>{ele.list.length}</td>
                                                                                </tr>
                                                                            )
                                                                    }):<Empty style={{marginTop:"50px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    }
                                            </div>:null 
                                        }
                                    </Spin>
                                </div>
                        </div>
                    }
                </div>
            </div>
            {
                videoShow?<div className="fl_video animate_speed animate__animated animate__fadeIn">
                    <div className="video_header">
                        <h1>人脸相机抓拍</h1>
                        <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>setVideo(false)}/>
                    </div>
                    <div className="video_content"></div>
                    <div className="rlzp_list">
                        <ul>
                            {rlzpList.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <img src={item.img} alt=""/>
                                        <span className="address">{item.address}</span>
                                        <span>{item.time}</span>
                                        <p  className={rlzpCount === index?"active_p" :null} onClick={()=>setTabRlzpCount(index)}>人脸检索</p>
                                    </li>
                                )
                            })}  
                        </ul>
                    </div>
                </div>:null
            }
            {
                renImg? <div className="renData animate_speed animate__animated animate__fadeInDown">
                    <div className="renData_header">
                        <h1>人脸相机抓拍</h1>
                        <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>setRenImg(false)}/>
                    </div>
                    <div className="condition">
                        <div className="seach_name"><span>姓名：</span><input type="text" value={renSelect.name} onChange={(e)=>setRenSelect({...renSelect,name:e.target.value})}/></div>
                        <div className="seach_id"><span>证件号：</span><input type="text" value={renSelect.cardid} onChange={(e)=>setRenSelect({...renSelect,cardid:e.target.value})}/></div>
                        <div className="seach_button" onClick={()=>searchRen()}>搜索</div>
                    </div>
                    <div className="dataList">
                        <ul>
                            {renData.map((item, index) => {
                                return (
                                    <li key={index} onClick={()=>handleImg(item)}>
                                        {
                                            item.name!== "zw"?<Fragment>
                                                <img src={item.faceUrl} alt=""/>
                                                <div className="itemRight">
                                                    <div className="itemName"><span>姓名：</span><span className="white">{item.name}</span></div>
                                                    <span>证件号：</span>
                                                    <br/>
                                                    <span className="white">{item.cardid}</span>
                                                    <div className="itemmsg"><span>备注：</span><span className="white">{item.cardtypeStr}</span></div>
                                                </div>
                                            </Fragment>:null
                                        }
                                    </li>
                                )
                            })} 
                        </ul>
                    </div>
                </div>:null
            }
            {
                trackClick2?<div className="RenClist">
                    <div className="ren_header">
                        <h1>人脸相机列表</h1>
                        <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>{setrackClick2(false);Build.allShow(mp_light,true);Event.clearPatrolPath(mp_light)}}/>
                    </div>
                    <ul>
                        {cameraListS2.length>0?cameraListS2.map((item, index) => {
                            return (
                                <li key={index} onClick={()=>flyToCarmea(item)}>
                                    <div className="ondayLeft">
                                        <img src={require("../../../assets/images/camera_icon.png").default} alt=""/>
                                        <span>{item.device_name}</span>
                                    </div>
                                    <img className="playVideo" src={require("../../../assets/images/play_video1.png").default} alt="" onClick={()=>goVideo(item)}/>
                                </li>
                            )
                        }):<Empty style={{marginTop:"50px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
                    </ul>
                </div>:null
            }
            {
                !sliderBottom?<div className="sb_ren">
                    <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={()=>setrackClick2(false)}/>
                    {/* <ul>
                        {renData.map((item, index) => {
                            return (
                                <li key={index}>
                                    <img src={item.img} alt=""/>
                                    <span>2号楼一楼大厅</span>
                                    <p><span>相似度：</span><span>10%</span></p>
                                    <span>2021-09-30 20:88:55</span>
                                </li>
                            )
                        })} 
                    </ul> */}
                </div>:null
            }
        </div>
    )
}

export default FaceApplication;