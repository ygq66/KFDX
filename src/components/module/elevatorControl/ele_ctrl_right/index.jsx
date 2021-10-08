import React, { useState, useEffect } from 'react';
//引入图标eharts
import * as echarts from 'echarts';
import "./style.scss"
const EleCtrlRight = () => {
    const [eleTypeNums,setTypeNums] = useState([{type:"正常量",num:64},{type:"异常量",num:8},{type:"检修量",num:0},{type:"停梯量",num:3}])
    const [tabs,setTab] = useState(["全部电梯","在线电梯","故障电梯","离线电梯"])
    const [count,setCount] = useState(0)
    const [elevatorList,setElevatorlist] = useState([{num:"L-105567",floor:"3F",status:"检测正常"},{num:"R-223423",floor:"2F",status:"检测异常"}])
    useEffect(() => {
        // getEcharts_custom()
        getEcharts_line()
    },[])

    const getEcharts_custom = ()=>{
        var myChart1 = echarts.init(document.getElementById('dtChart'));
        let angle = 0;//角度，用来做简单的动画效果的
        let value = 100;
        let option1 =""
        myChart1.setOption(option1, true)
    }

    const getEcharts_line = ()=>{
        var myChart2 = echarts.init(document.getElementById('lineChart'));
        myChart2.setOption({
            xAxis: {
                type: 'category',
            	offset:5,	
                boundaryGap:false,
                data: ['0','2','3','4','6','8','10','12','14','16','18','20','22','24'],
                axisLine:{
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 12,
                    color:"#fff"
                },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: '#5BA19F',
                    },
                },
                axisLabel: {
                    fontSize: 12,
                    color:"#fff"
                },
            },
            series: [
                {
                    data: [17,35,60,95,54,74,46,84,13,45,91,66,25,14],
                    type: 'line',
                    smooth:true,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{
                                offset: 1, color: '#5CFEE0' // 100% 处的颜色
                            }, {
                                offset: .5, color: '#00D2FF' // 100% 处的颜色
                            }]
                        )
                    }
                }
            ]
        })
    }
    return (
        <div id="ele_ctrl_right" className="animate_speed animate__animated animate__fadeInRight">
            <div className="content_top">
                <div className="top_title"><h1>电梯状态</h1></div>
                <div className="top_content">
                    <div className="tc_left">
                        <div id="dtChart"></div>
                        <h3>安全指数</h3>
                    </div>
                    <div className="tc_right">
                        <ul>
                            {
                                eleTypeNums.map((item, index) => {
                                    return (
                                        <li key={index}>
                                           <div className="card_top">
                                               {item.type}
                                               <span>（台）</span>
                                           </div>
                                           <div className="card_num">
                                               <span>{item.num}</span>
                                           </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="content_mid">
                <div className="mid_title"><h1>电梯运行频率</h1></div>
                <div className="mid_echarts">
                    <div id="lineChart"></div>
                </div>
            </div>
            <div className="content_btm">
                <div className="btm_title"><h1>电梯运行频率</h1></div>
                <div className="btm_content">
                    <div className="tabTitle">
                        <ul>
                            {
                                tabs.map((item, index) => {
                                    return (
                                        <li key={index} onClick={()=>setCount(index)} className={index === count?"active":""}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="tabCotents">
                        <ul>
                            {
                                elevatorList.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <div className="picture"><img src="" alt="" /></div>
                                            <div className="ele_details">
                                                <span className="suoyin">电梯编号</span>
                                                <span className="ele_d_num">{item.num}</span>
                                                <div className="line"></div>
                                                <div className="ele_d_floorOrstatus">
                                                    <div className="ele_d_floor">
                                                        <img src={require("../../../../assets/elevator/totop.png").default} alt="" />
                                                        <span>{item.floor}</span>
                                                    </div>
                                                    {
                                                        item.status === "检测正常"?<span id="status"className="green">{item.status}</span>:<span id="status"className="red">{item.status}</span>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EleCtrlRight;