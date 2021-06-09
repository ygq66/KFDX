import React,{ useState,useEffect } from 'react';
import { intercomPlay } from '../../../utils/untils';
import { infoList } from '../../../api/mainApi';
import { Checkbox,message } from 'antd';
import './style.scss'

const InterphonePopup = (props) => {
    const [show,setShow] = useState(false)
    const [msgdata,setMSG] = useState({device_name:"111111",category_name:"22222222"})
    const [duijianglist,setList] = useState([])
    useEffect(() => {
        if(props.msgdata){
            console.log(props.msgdata,'对讲窗口接收到的数据')
            setMSG(props.msgdata)
            infoList({category_id:"10004"}).then(res=>{
                if(res.msg === "success"){
                    let results = res.data
                    //当前对讲机能呼叫的对讲机数据处理
                    let duijiang_after = []
                    if(props.msgdata.category_name === "对讲主机"){
                        results.forEach((ele)=>{
                            if(ele.device_code.slice(0,2) === props.msgdata.device_code.slice(0,2) && ele.category_name !== "对讲主机"){
                                ele.enable = false
                                duijiang_after.push(ele)
                            }
                        })
                    }else{
                        results.forEach((ele)=>{
                            if(ele.device_code.slice(0,2) === props.msgdata.device_code.slice(0,2) && ele.category_name === "对讲主机"){
                                ele.enable = false
                                duijiang_after.push(ele)
                            }
                        })
                    }
                    duijiang_after.push({
                        device_name:"总主机",
                        device_code:"1000",
                        enable:false
                    })
                    setList(duijiang_after)
                }
            })
            setShow(true)
        }
        // eslint-disable-next-line
    },[props])

    //操作
    const handleDJ = (IsRead)=>{
        let sion = []
        duijianglist.forEach(element => {
            if(element.enable){
                sion.push(Number(element.device_code))
            }
        });

        let dj_data;
        if(msgdata.category_name === "对讲主机"){
            if(sion[0] === 1000){
                dj_data = {
                    "soin": [msgdata.device_code],
                    "host": sion[0],
                    "IsRead": IsRead
                }
            }else{
                dj_data = {
                    "soin": sion,
                    "host": msgdata.device_code,
                    "IsRead": IsRead
                }
            }
        }else{
            dj_data = {
                "soin": [msgdata.device_code],
                "host": sion[0],
                "IsRead": IsRead
            }
        }
        intercomPlay(dj_data)
    }
    //多选
    const checkChange = (e,index)=>{
        if(msgdata.category_name !== "对讲主机"){
            let ccount = 0;
            duijianglist.forEach(element => {
                if(element.enable){
                    ccount++;
                }
            });
            if(ccount>1){
                message.success("最多一个")
            }else{
                const selectlist=[...duijianglist]
                selectlist[index].enable=e.target.checked;
                setList(selectlist)
            }
        }else{
            let iszong;
            duijianglist.forEach(element => {
                if(element.device_code === "1000"){
                    iszong = element.enable
                }
            });
            if(!iszong){
                const selectlist=[...duijianglist]
                selectlist[index].enable=e.target.checked;
                setList(selectlist)
            }else{
                message.success("已经选择总主机")
            }
        }
    }
    return (
        <>
            {
                show?<div className={`${"animate_speed animate__animated"} ${"animate__zoomIn"}`} id="InterphonePopup">
                    <div className="cp_title">
                        <span>对讲</span>
                        <img src={require('../../../assets/images/closeBtn.png').default} alt="close" onClick={()=>{setShow(false)}}/>
                    </div>
                    <div className="cp_content">
                        <div className="titleName">
                            <div className="content_item"><span>设备名称：</span><span>{msgdata.device_name}</span></div>
                            <div className="content_item"><span>设备类型：</span><span>{msgdata.category_name}</span></div>
                        </div>
                        <div className="cp_list">
                            <ul>
                            {
                                duijianglist.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Checkbox checked={item.enable} onChange={(e) =>checkChange(e,index)}>{item.device_name}</Checkbox>
                                    </li>
                                );
                            })}
                            </ul>
                        </div>
                    </div>
                    {
                        msgdata.category_name === "对讲主机"?
                        <div className="cp_button">
                            <span onClick={()=>{handleDJ(1)}}>呼叫</span>
                            <span onClick={()=>{handleDJ(2)}}>挂断</span>
                            <span onClick={()=>{handleDJ(3)}}>多人通话</span>
                            <span onClick={()=>{handleDJ(4)}}>多人挂断</span>
                        </div>:
                        <div className="cp_button">
                            <span onClick={()=>{handleDJ(1)}}>呼叫</span>
                            <span onClick={()=>{handleDJ(2)}}>挂断</span>
                        </div>
                    }
                </div>:null
            }
        </>

    )
}

export default React.memo(InterphonePopup);