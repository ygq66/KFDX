import React,{ useState,useEffect ,useRef} from 'react';
 import { findResources } from '../../api/mainApi';
import './style.scss'

const DengPopup = (props) => {
    const [show,setShow] = useState(false)
    const [msgdata,setMSG] = useState({device_name:"111111",category_name:"22222222",deviceStatus:"33333333"})
    const [d_status,setStatus] = useState("关闭")
    const isSame = useRef(null) //防止重复点击
    useEffect(() => {
        if(props.msgdata){
            setShow(true)
            setMSG(props.msgdata)
           if(props.msgdata.type_name="智能电灯"){
            setStatus("开启")
           }
            findResources({
                resourceType:"ENCODE_DEVICE",
                indexCode:props.msgdata.device_code
            }).then(res => {
                if (res.msg === "SUCCESS") {
                console.log(res.data)
                var status=''
                if(res.data.status==='1'){
                    status="在线"
                    // 0离线，1在线
                }else{
                    status="离线"
                }
                // var valueInfo={
                //     device_name:res.data.name,
                //     category_name:props.msgdata.category_name,
                //     deviceStatus:status
                // }
                setStatus(status)
               // if(msg.attr.detail_info){ videoPlay(msg.attr)}
                }else{
                    console.log("请求接口报错")
                    setStatus("离线")
                }
            })
        }
        // eslint-disable-next-line
    },[props])
    return (
        <>
            {
                show?<div className={`${"animate_speed animate__animated"} ${"animate__zoomIn"}`} id="dengPopup">
                    <div className="cp_title">
                        <span>{msgdata.type_name}</span>
                        <img src={require('../../assets/images/closeBtn.png').default} alt="close" onClick={()=>{setShow(false)}}/>
                    </div>
                    <div className="cp_content">
                        <div className="titleName">
                            <p><span>设备名称:</span><span title={msgdata.device_name} className="hidden">{msgdata.device_name}</span></p>
                            <p><span>设备状态：</span><span>{d_status}</span></p>
                        </div>
                    </div>
                </div>:null
            }
        </>
    )
}

export default DengPopup;