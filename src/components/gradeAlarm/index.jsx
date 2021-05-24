import React,{ useState,useEffect } from 'react';
import { Select,Empty } from 'antd';
import './style.scss'
import { timeFormat } from '../../utils/untils'
import { CaretDownOutlined  } from '@ant-design/icons';
import { Model } from '../../utils/map3d'
import { useMappedState } from 'redux-react-hook';
import { infoUpdate,cameraList_S,cameraRegion } from '../../api/mainApi';
import { Common } from '../../utils/mapMethods'


const { Option } = Select;
const GradeAlarm = (props) => {
    const mapDark = useMappedState(state => state.map3d_dark);
    const alarmPolygons = useMappedState(state => state.alarmMsg);
    const [threeM,setThree] = useState([])
    const [fiveM,setFive] = useState([])
    const [tenM,setTen] = useState([])
    const [fifteenM,setFifteen] = useState([])
    const [alarmEventlist,setAlist] = useState([])
    useEffect(()=>{
        let array = [...alarmEventlist]
        array.unshift(props.datas)
        setAlist(array)
        setTimeout(()=>{
            let arrayt = [...threeM]
            arrayt.push(props.datas)
            setThree(arrayt)
        },180000)

        setTimeout(()=>{
            let arrayfiveM = [...fiveM]
            arrayfiveM.push(props.datas)
            setFive(arrayfiveM)
        },300000)

        setTimeout(()=>{
            let arraytenM = [...tenM]
            arraytenM.push(props.datas)
            setTen(arraytenM)
        },600000)

        setTimeout(()=>{
            let arrayff = [...fifteenM]
            arrayff.push(props.datas)
            setFifteen(arrayff)
        },900000)

        // eslint-disable-next-line
    },[props.datas])
    const [problems ] = useState([
        {id:3,name:"3分钟有效报警信息"},
        {id:5,name:"5分钟有效报警信息"},
        {id:10,name:"10分钟有效报警信息"},
        {id:15,name:"15分钟有效报警信息"}
    ])

    const handleEquipment=(value)=>{
        if(value === 3){
            setAlist(threeM)
        }else if(value ===5){
            setAlist(fiveM)
        }else if(value ===10){
            setAlist(tenM)
        }else if(value ===15){
            setAlist(fifteenM)
        }
    }
    
    //忽略||确认
    const handleAlarm = (type,ele)=>{
        infoUpdate({id:ele.event_info[0].id,handle:type})
        let result = []
        let array = [...alarmEventlist]
        array.forEach(element=>{
            if(element.event_info[0].id !== ele.event_info[0].id){
                result.push(element)
            }
        })
        setAlist(result)

        cameraList_S({device_code:ele.event_info[0].device_code}).then(res=>{
            if(res.msg === "success"){
                let results = res.data[0]
                var pos = {
                    x:Common.filter(results.center.x)/100,
                    y:Common.filter(results.center.y)/100
                }
                cameraRegion({positions:pos}).then(res=>{
                    if(res.msg === "success"){
                        //清除文字和线
                        Model.removeGid(mapDark,"BjZ_" + res.data[0][0].real_name)
                        Model.removeGid(mapDark,"BjX_" + res.data[0][0].real_name)

                        //清除面
                        alarmPolygons.forEach(element=>{
                            if(element.gid === res.data[0][0].real_name){
                                Model.updatePolygon(mapDark,element,element.style)
                            }
                        })
                    }
                })

            }
        })
    }

    return (
        <div id="gradeAlarm" className="">
            <div className="gradeAlarm_content">
                <img className="closeImg" src={require("../../assets/images/closeBtn.png").default} alt="" onClick={()=>props.alarmclose(false)}/>
                <div className="gradeAlarm_select">
                    <Select
                        onChange={handleEquipment} 
                        placeholder="请选择类别" 
                        defaultValue="3分钟有效报警信息"
                        suffixIcon={<CaretDownOutlined/>}
                        showArrow={true}
                    >
                    {
                        problems.map((item, index) => {
                            return(
                                <Option key={index} value={item.id}>{item.name}</Option>
                            )
                        })
                    }
                    </Select>
                </div>
                <img className="line" src={require("../../assets/images/line.png").default} alt=""/>
                <div className="gradeAlarm_table">
                    <table>
                        <thead><tr><td>报警时间</td><td>报警位置</td><td>报警描述</td><td>操作</td></tr></thead>
                        <tbody>
                            {
                                alarmEventlist.length > 0?alarmEventlist.map((ele,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td title={timeFormat(ele.event_info[0].start_time)}>{timeFormat(ele.event_info[0].start_time)}</td>
                                            <td title={ele.event_info[0].device_name}>{ele.event_info[0].device_name}</td>
                                            <td title={ele.event_info[0].event_name}>{ele.event_info[0].event_name}</td>
                                            <td className="button">
                                                <div className="queren" onClick={()=>handleAlarm("1",ele)}>确认</div>
                                                <div className="hulue" onClick={()=>handleAlarm("2",ele)}>忽略</div>
                                            </td>
                                        </tr>
                                    )
                                }):<Empty style={{marginTop:"100px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> 
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="gradeAlarm_footer"></div>
        </div>
    )
}
export default GradeAlarm;