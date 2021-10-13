import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
//引入eharts
import * as echarts from 'echarts';
import "./style.scss"
const EleCtrlLeft = () => {

  const [allElevatorDatas, setAllDatas] = useState([
    { name: "运行里程", num: 3, unit: "千米" },
    { name: "载人数量", num: 2, unit: "千人次" },
    { name: "开关门次数", num: 840, unit: "次" },
    { name: "高峰等电梯时间", num: 45.7, unit: "秒" },
    { name: "故障次数", num: 28, unit: "次" },
    { name: "检查次数", num: 367, unit: "次" }
  ])
  const [pieNums, setPienum] = useState({ keti: 0, huoti: 0 })
  const [healths, setHealth] = useState(["客梯", "货梯"])
  useEffect(() => {
    getEcharts_percent(echarts.init(document.getElementById('percentChart1')),80,"#8AFFF9","#00FFF1")
    getEcharts_percent(echarts.init(document.getElementById('percentChart2')),80,"#FFF124","#FFFAB1")
    var mockNum = setInterval(() => {
      setAllDatas(allElevatorDatas.map((item, index) => item.name === "运行里程" || item.name === "载人数量" ? { ...item, num: Math.floor(Math.random() * 10 + 1) } : item))
    }, 10000);
    getEcharts_Bar()
    setTimeout(() => {
      setPienum({ keti: 80, huoti: 100 })
    }, 2000);
    return () => {
      clearInterval(mockNum);
    }
  }, [])

  //柱状图
  const getEcharts_Bar = () => {
    var myChart = echarts.init(document.getElementById('BarChart'));
    let yList = [67, 75, 78, 50, 60, 78, 67];
    let maxData = [97, 97, 97, 97, 97, 97, 97];
    let xList = [6.20, 6.21, 6.22, 6.23, 6.24, 6.22, 6.20];
    let xData = xList.map((item, index) => {
      return {
        value: item,
        textStyle: {
          color: "#ffff",
        },
      };
    });
    let barWidth = 230 / 10;
    let colors = [
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#00daff',
          },
          {
            offset: 1,
            color: '#007e8b',
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#00daff',
          },
          {
            offset: 1,
            color: '#007e8b',
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#00daff',
          },
          {
            offset: 1,
            color: '#007e8b',
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#00daff',
          },
          {
            offset: 1,
            color: '#007e8b',
          },
        ],
      },
    ];
    let colors1 = [
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0.3,
            color: '#5CFEE0',
          },
          {
            offset: 1,
            color: '#5CFEE0',
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0.3,
            color: '#5CFEE0',
          },
          {
            offset: 1,
            color: '#5CFEE0',
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0.3,
            color: '#5CFEE0',
          },
          {
            offset: 1,
            color: '#5CFEE0',
          },
        ],
      },
      {
        type: 'linear',
        x: 0,
        x2: 0,
        y: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0.3,
            color: '#5CFEE0',
          },
          {
            offset: 1,
            color: '#5CFEE0',
          },
        ],
      }
    ];
    myChart.setOption({
      /**区域位置*/
      //   grid: {
      //       left: '10%',
      //       right: '10%',
      //       top: 80,
      //       bottom: 40,
      //     },
      /**图例大小*/
      //  legend: {
      //   type: 'plain',
      //   left: 0,
      //   top: 20,
      //   itemGap: 20,
      //   itemWidth: 35,
      //   itemHeight: 20
      // },
      //X轴
      xAxis: {
        data: xData,
        show: true,
        offset: 5,
        type: 'category',
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,1)',
          },
          symbol: ['none', 'arrow'],
          symbolOffset: [0, 25],
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          },
        },
        axisLabel: {
          fontSize: 13,
          formatter: function (params) {
            if (params.length === 3) {
              return params + "0";
            } else {
              return params;
            }
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        show: true,
        splitNumber: 5,
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#5BA19F',
          },
        },
        axisLabel: {
          color: '#FFFFFF',
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: barWidth,
          itemStyle: {
            normal: {
              color: function (params) {
                return colors[params.dataIndex % 4];
              },
            }
          },
          label: {
            show: true,
            position: [barWidth / 2, -(barWidth + 0)],
            color: '#ffffff',
            fontSize: 12,
            fontStyle: 'bold',
            align: 'center',
          },
          data: yList,
        },
        {
          data: maxData,
          type: 'bar',
          barMaxWidth: 'auto',
          barWidth: barWidth,
          barGap: '-100%',
          zlevel: -1,
          itemStyle: {
            color: 'rgba(0,255,252,0.1)',
          },
        },
        {
          z: 2,
          type: 'pictorialBar',
          data: yList,
          symbol: 'diamond',
          symbolOffset: [0, '50%'],
          symbolSize: [barWidth, barWidth * 0],
          itemStyle: {
            normal: {
              color: function (params) {
                return colors1[params.dataIndex % 4];
              },
            },
          },
        },
        {
          z: 3,
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: yList,
          symbol: 'diamond',
          symbolOffset: [0, '-50%'],
          symbolSize: [barWidth, barWidth * 0.5],
          itemStyle: {
            normal: {
              borderWidth: 0,
              color: function (params) {
                return colors1[params.dataIndex % 4];
              },
            },
          },
        },
        {
          z: 3,
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: maxData,
          symbol: 'diamond',
          symbolOffset: [0, '-50%'],
          symbolSize: [barWidth, barWidth * 0.5],
          itemStyle: {
            color: function (params) {
              return '#5BA19F';
            },
          },
        },
        // {
        //     z: 4,
        //     type: 'pictorialBar',
        //     symbolPosition: 'end',
        //     data: yLists,
        //     symbol: 'diamond',
        //     symbolOffset: [0, "100%"],
        //     symbolSize: [barWidth, barWidth * 0.5],
        //     itemStyle: {
        //         normal: {
        //             borderWidth: 0,
        //             color: function (params) {
        //                 return colors1[params.dataIndex % 4];
        //             },
        //         },
        //     },
        // },
      ],
    });
  }

  //百分比进度条
  const getEcharts_percent = (obj, percentNum, color1, color2) => {
    var getvalue = [percentNum];
    let option = {
      title: {
        text: getvalue + '%',
        textStyle: {
          color: '#ffff',
          fontSize: 20,
          fontWeight: 'normal',
        },
        left: 'center',
        top: '35%',
      },
      angleAxis: {
        max: 100,
        clockwise: true, // 逆时针
        show: false  // 隐藏刻度线
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,

        },
        axisTick: {
          show: false
        },
      },
      polar: {
        center: ['50%', '50%'],
        radius: '175%' //图形大小
      },
      series: [{
        type: 'bar',
        data: getvalue,
        showBackground: true,
        backgroundStyle: {
          color: 'none',
        },
        coordinateSystem: 'polar',
        roundCap: false,
        barWidth: 10,
        itemStyle: {
          normal: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: color1
            }, {
              offset: 1,
              color: color2
            }]),
            shadowBlur: 5,
            shadowColor: '#2A95F9',
          }
        },
      }]
    };
    obj.setOption(option, true)
  }


  return (
    <div id="ele_ctrl_left" className="animate_speed animate__animated animate__fadeInLeft">
      <div className="content_top">
        <div className="top_title"><h1>累计运行数据</h1></div>
        <div className="top_datas">
          <ul>
            {
              allElevatorDatas.map((item, index) => {
                return (
                  <li key={index}>
                    <div className="title_name_bg">
                      <span>{item.name}</span>
                    </div>
                    <div className="title_num">
                      <span className="num">{item.num}</span>
                      <span>{item.unit}</span>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className="content_mid">
        <div className="mid_title"><h1>近7天电梯运行次数</h1></div>
        <div className="mid_echarts">
          <div id="BarChart"></div>
        </div>
      </div>
      <div className="content_btm">
        <div className="btm_title"><h1>电梯健康指数</h1></div>
        <div className="btm_echarts">
          {
            healths.map((item, index) => {
              return (
                <div key={index} className="health_item">
                  <div className="health_item_title">{item}</div>
                  <div className="healthChart" id={"health_pieChart" + index}>
                    {
                      item === "客梯" ? <div id="percentChart1"></div> : <div id="percentChart2"></div>
                    }
                  </div>
                  <h3>健康指数</h3>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default EleCtrlLeft;