import React, { useState, useEffect } from 'react';
import { Tree, Spin, Empty, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './style.scss';
import { useMappedState } from 'redux-react-hook';
import { regionList, infoListS, labelList, SPCC_doControl, SPCC_DoorState, SPCC_DoorList } from '../../../api/mainApi';
import { timeFormat } from '../../../utils/untils'
import { Build } from '../../../utils/map3d'
import { Common } from '../../../utils/mapMethods';

const TreeNode = Tree.TreeNode;
const DoorApply = (props) => {
    const mp_light = useMappedState(state => state.map3d_light);
    const [doorList, setDoorlist] = useState([]);
    const [doorHistorylist, setDoorHistory] = useState([])
    const [doorVislib, DoorVislib] = useState(false)
    const [doorHistory, DoorHistoryVislib] = useState(false)
    const [expandedKeys, setExpandedKeys] = useState([])
    const [spinning, setSpinning] = useState(true)
    const [count, setCount] = useState()
    const [dooState, setDoorState] = useState('暂无')//门禁状态
    const [doorDatas, setDoorData] = useState({})
    const [doorName, setDoorName] = useState("暂无名称")

    useEffect(() => {
        getDoorList()
    }, [])

    function doorqpVisble() {
        DoorVislib(!doorVislib)
    }
    function doorHistoryvisble() {
        DoorHistoryVislib(!doorHistory)
    }
    //查询门禁记录
    function doorHistoryList() {
        doorHistoryvisble();
        SPCC_DoorList({ doorIndexCodes: [doorDatas.device_code] }).then(res => {
            if (res.msg === "success") {
                setDoorHistory(res.data.list)
            }
        })
    }

    const onSelect = (selectedKeys, info) => {
        if (!info.node.children && info.node.item.device_code) {
            console.log(info.node.item, '门禁详情信息')
            
            setDoorName(info.node.item.device_name)
            setDoorData(info.node.item)
            DoorVislib(true)
            SPCC_DoorState({ doorIndexCodes: [info.node.item.device_code] }).then(res => {
                if (res.msg === "success") {
                    let resState = res.data.authDoorList[0].doorState;
                    if (resState === 0) {
                        resState = "常开"
                    } else if (resState === 1) {
                        resState = "开门"
                    } else if (resState === 2) {
                        resState = "关门"
                    } else if (resState === 3) {
                        resState = "常闭"
                    }
                    setDoorState(resState)
                }
            })

            infoListS({ 
                category_id:info.node.item.category_id,
                device_code:info.node.item.device_code
            }).then(res => {
                if (res.msg === "success") {
                    let doorResults = res.data[0]
                    //飞行定位
                    Common.mapFly(mp_light, doorResults)
                    Build.allShow(mp_light, true)
                    //分层
                    if (doorResults.build_id) {
                        labelList({ build_id: doorResults.build_id }).then(res2 => {
                            if (res2.msg === "success") {
                                let floorList_s = res2.data[0].floor_name;
                                let nfloor = [];
                                floorList_s.forEach(element => {
                                    nfloor.push(element.floor_id.split("#")[1])
                                });
                                Build.showFloor(mp_light, doorResults.build_id, doorResults.floor_id.split("#")[1], nfloor)

                                //弹出楼层列表
                                let messageData = {
                                    switchName: 'buildLable',
                                    SPJK: false,
                                    Personnel: doorResults.build_id,
                                    index: Number(doorResults.floor_id.charAt(doorResults.floor_id.length - 1))
                                }
                                window.parent.postMessage(messageData, '*')
                            }
                        })
                    }
                }
            })
        }
    };
    //获取门禁列表
    const getDoorList = () => {
        regionList({ category_id: "10002", onmap: true }).then(res => {
            if (res.msg === "success") {
                setDoorlist(res.data)
                console.log(res.data, '门禁列表')
                setExpandedKeys([res.data[0].key, res.data[0].children[0].key])//默认展开
                setSpinning(false)
            }
        })
    }

    const getToTal = (arr) => {
        let num = 0;
        arr.forEach(element => {
            if (element.children) {
                num += getToTal(element.children)
                getToTal(element.children)
            } else {
                num += 1;
            }
        });
        return num;
    }

    const getTreeOptions = (nodeData) => {
        return nodeData && Array.isArray(nodeData)
            ? nodeData.map((list) => {
                if (list.children && Array.isArray(list.children) && list.children.length > 0) {
                    return (
                        <TreeNode key={list.id} title={
                            <>
                                <span>{list.title}</span>
                                {
                                    getToTal(list.children) > 0 ? <span style={{ color: "yellow" }}> (总数：{getToTal(list.children)})</span> : <span style={{ color: "yellow" }}> (总数：{list.children.length})</span>
                                }
                            </>
                        } item={list}>
                            {getTreeOptions(list.children)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        title={
                            <>
                                <span >{list.title}</span>
                            </>
                        }
                        key={list.id}
                        item={list}
                    />
                );
            })
            : [];
    }

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys)
    };

    const caozuo = (type) => {
        SPCC_doControl({ doorIndexCodes: [doorDatas.device_code], controlType: type }).then(res => {
            if (res.msg === "success") {
                if (res.data[0].controlResultCode === 0) {
                    message.success("操作成功");
                    setCount(type.toString())
                } else {
                    message.warning("操作失败", res.data[0]);
                }
            }
        })
    }
    return (
        <div id="DoorApply" className="DoorApply animate_speed animate__animated animate__fadeInLeft">
            <div className="DoorApply_top">
                <h1>门禁应用</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => props.close()} />
            </div>
            <div className="DoorApply_list">
                <div className="Treelist">
                    <p>门禁列表 </p>
                    <Spin spinning={spinning} tip="加载中...">
                        {
                            doorList ? doorList.length > 0 ? <Tree
                                className="doorTree"
                                showLine={{
                                    showLeafIcon: false,
                                }}
                                switcherIcon={<DownOutlined />}
                                expandedKeys={expandedKeys}
                                onSelect={onSelect}
                                onExpand={onExpand}
                            >
                                {getTreeOptions(doorList)}
                            </Tree> : null : <Empty style={{ marginTop: "200px" }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                        }
                    </Spin>
                </div>
            </div>
            {doorVislib ? <div className="doorapp-pop">
                <span className="doorapp-pop-tit">({doorName})&nbsp;&nbsp;<br />门禁状态 : {dooState}</span>
                <img className="doorapp-pop-cls" src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => doorqpVisble()} />
                <ul>
                    <li onClick={() => caozuo(1)} className={count === "1" ? "active" : null}><img src={require("../../../assets/images/km.png").default} alt=""></img><span>开门</span><span></span></li>
                    <li onClick={() => caozuo(2)} className={count === "2" ? "active" : null}><img src={require("../../../assets/images/gb.png").default} alt=""></img><span>关门</span><span></span></li>
                    <li onClick={() => caozuo(0)} className={count === "0" ? "active" : null}><img src={require("../../../assets/images/ck.png").default} alt=""></img><span>常开</span><span></span></li>
                    <li onClick={() => caozuo(3)} className={count === "3" ? "active" : null}><img src={require("../../../assets/images/door-cb.png").default} alt=""></img><span>常关</span><span></span></li>
                </ul>
                <span className="doorapp-pop-record" onClick={() => doorHistoryList()}>历史记录</span>
            </div> : ""}
            {doorHistory ? <div className="doorHistory-pop">
                <p><span className="doorHistory-pop-tit">历史记录</span><img className="doorHistory-pop-cls" src={require("../../../assets/images/backr.png").default} alt="" onClick={() => doorHistoryvisble()}></img></p>
                <ul>
                    <li><span>事件类型</span><span>卡号</span><span>发生时间</span><span>人号名称</span></li>
                    {doorHistorylist.map((item, key) => {
                        return (
                            <li>
                                <span title={item.eventType}>{item.eventType}</span>
                                <span title={item.eventId}>{item.eventId}</span>
                                <span title={timeFormat(item.eventTime)}>{timeFormat(item.eventTime)}</span>
                                <span title={item.personName}>{item.personName}</span>
                            </li>
                        )
                    })}
                </ul>
            </div> : ""}
        </div>
    )
}

export default DoorApply;