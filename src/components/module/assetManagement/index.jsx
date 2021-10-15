import React, { useState, useEffect } from 'react';
import "./style.scss"
//引入eharts
import * as echarts from 'echarts';

const AssetManagement = () => {

  const [areaStatistical, setAreas] = useState([{ name: "办公区域", percent: "85" }, { name: "会议室区域", percent: "34" }, { name: "其他区域", percent: "16" }])
  const [tableList, setTableList] = useState([
    {
      floorName: "一层", roomTotal: 9, roomList: [
        { roomNum: "1101", roomName: "杭州历历信息科技有限公司" },
        { roomNum: "1102", roomName: "米来依（杭州）科技有限公司" },
        { roomNum: "1103", roomName: "浙江一杭检测有限公司" },
        { roomNum: "1104", roomName: "杭州宇曜科技有限公司" },
        { roomNum: "1105", roomName: "杭州启迪东信孵化器有限公司" },
        { roomNum: "1106", roomName: "杭州启舰科技有限公司" },
        { roomNum: "1107", roomName: "胡庆余堂" }
      ]
    },
    {
      floorName: "一层", roomTotal: 9, roomList: [
        { roomNum: "1101", roomName: "杭州历历信息科技有限公司" },
        { roomNum: "1102", roomName: "米来依（杭州）科技有限公司" },
        { roomNum: "1103", roomName: "浙江一杭检测有限公司" },
        { roomNum: "1104", roomName: "杭州宇曜科技有限公司" },
        { roomNum: "1105", roomName: "杭州启迪东信孵化器有限公司" },
        { roomNum: "1106", roomName: "杭州启舰科技有限公司" },
        { roomNum: "1107", roomName: "胡庆余堂" }
      ]
    }
  ])

  useEffect(() => {
    const charts = ["pChart1", "pChart2", "pChart3"]
    charts.forEach(element => {
      let chartsDom = echarts.init(document.getElementById(element))
      if (chartsDom) {
        getEcharts_percent(chartsDom, 65)
      }
    });
  }, [])

  const getEcharts_percent = (obj, percentNum) => {
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
          color: '#004D5E',
        },
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: 10,
        itemStyle: {
          normal: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#01D3FE '
            }, {
              offset: 1,
              color: '#47FBFF'
            }]),
            shadowBlur: 5,
            shadowColor: '#2A95F9',
          }
        },
      }]
    };
    obj.setOption(option, true)
  }

  const TableBodyTrTemplate = (prop) => {
    const { item } = prop;
    return (
      <tr>
        <td rowSpan={item.roomList.length}>{item.floorName}</td>
        <td rowSpan={item.roomList.length}>{item.roomTotal}</td>
        <td>{item.roomList[0].roomNum}</td>
        <td>{item.roomList[0].roomName}</td>
      </tr>
    )
  };

  const TableBodyTrTemplate2 = (prop) => {
    const { item } = prop;
    if (item.roomList.length === 0) return null;
    return item.roomList.slice(1, item.roomList.length).map((son, index_) => {
      return (
        <tr key={index_ + 'index_'}>
          <td>{son.roomNum}</td>
          <td>{son.roomName}</td>
        </tr>
      )
    })
  };

  return (
    <div id="assetManagement">
      <div className="content_top">
        <div className="top_title"><h1>区域统计</h1></div>
        <div className="top_percent">
          <ul>
            {
              areaStatistical.map((itm, idx) => {
                return (
                  <li key={idx}>
                    <div className="percent_content">
                      <div className="percentChart" id={"pChart" + (++idx)}></div>
                      <div className="percent_name"><span>{itm.name}</span></div>
                    </div>
                    {
                      idx < areaStatistical.length ? <img src={require("../../../assets/elevator/line.png").default} alt="" /> : null
                    }
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className="content_bottom">
        <div className="mid_title"><h1>楼层使用详情</h1></div>
        <div className="search">
          <input type="text" name="" id="" placeholder="请输入楼层或公司名称" />
          <div className="icon">
            <img src={require("../../../assets/elevator/search.png").default} alt="" />
          </div>
        </div>
        <div className="tables">
          <table>
            <colgroup>
                <col style={{width: '377px'}}/>
            </colgroup>
            <thead>
              <tr>
                <th style={{flex:"1"}}>楼层</th>
                <th style={{flex:"2"}}>房间总数</th>
                <th style={{flex:"2"}}>房间号</th>
                <th style={{flex:"4"}}>租赁情况</th>
              </tr>
            </thead>
            <tbody>
              {
                tableList.map((itm, idx) => {
                  return (
                    [
                      <TableBodyTrTemplate item={itm} index={idx} key={'1-index-' + idx} />,
                      <TableBodyTrTemplate2 item={itm} index={idx} key={'2-index-' + idx}/>
                    ]
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AssetManagement;