import React, { useState, useEffect } from 'react';
import { Tree, Input, Button, Spin } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { regionList, cameraList_S, labelList } from '../../../api/mainApi';
import { Common } from '../../../utils/mapMethods';
import { videoPlay } from '../../../utils/untils'
import { useMappedState } from 'redux-react-hook';
import { Model, Build } from '../../../utils/map3d'
import { message } from 'antd';
import './style.scss';

const VideoSurveillance = (props) => {
    // eslint-disable-next-line
    const mp_light = useMappedState(state => state.map3d_light);
    const [carmealist, setlist] = useState([]);
    const [Dotlinelist, setlinelist] = useState([]);
    const [DotlineVislib, DlVislib] = useState(false)
    const [spinning, setSpinning] = useState(true)
    const [allPolygonObj, setapj] = useState([])
    const [isPolygon, setPolygon] = useState(true)

    let array_list = null
    let list = { name: "点追查", children: ["上枪机", "上枪机", "上枪机", "上枪机", "上枪机"] }
    //Compiled with warnings
    useEffect(() => {
        regionList({ category_id: "10001" }).then(res => {
            if (res.msg === "success") {
                let listarry = []
                antdTree(res.data, listarry)
                setlist(res.data)//视频列表
                setExpandedKeys([res.data[0].key, res.data[0].children[0].key])//默认展开
                setSpinning(false)
            }
        })
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

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

    function Dotlineselect(ort) {
        array_list = [...Dotlinelist]
        switch (ort) {
            case 1:
                list.name = "点追查";
                array_list.push(list)
                setlinelist(array_list)
                DlVislib(true)
                break;
            case 2:
                list.name = "线追查";
                array_list.push(list)
                DlVislib(true)
                setlinelist(array_list)
                break;
            case 3:
                if (isPolygon) {
                    Common.initializationPosition(mp_light)
                    cameraList_S({ device_code: "" }).then(res => {
                        let neendObj = []
                        if (res.msg === "success") {
                            res.data.forEach(element => {
                                if (!(JSON.stringify(element.position) === "{}") && !(element.position === null) && element.position.points !== null) {
                                    Model.createPolygon(mp_light, element.position.points, ((msg) => {
                                        neendObj.push(JSON.parse(msg))
                                    }))
                                }
                            });
                            setapj(neendObj)
                        }
                    })
                    setPolygon(false)
                } else {
                    closePolygon()
                }
                break;
            default:
                break;
        }
    }

    //antd树菜单
    function antdTree(list, objstr) {
        if (Array.isArray(list) && list.length > 0) {
            list.forEach(function (v, i) {
                objstr[i] = {};
                objstr[i].title = v.title;
                objstr[i].key = v.id;
                let arr = [];
                antdTree(v.children, arr)
                objstr[i].children = arr;
            });
        }
    }
    function dotLineclose() {
        DlVislib(!DotlineVislib)
    }
    function dotLinedelete(index) {
        index--;
        array_list = [...Dotlinelist]
        array_list.remove(index)
        setlinelist(array_list)
    }
    // eslint-disable-next-line
    Array.prototype.remove = function (obj) {
        for (var i = 0; i < this.length; i++) {
            var temp = this[i];
            if (!isNaN(obj)) {
                temp = i;
            }
            if (temp === obj) {
                for (var j = i; j < this.length; j++) {
                    this[j] = this[j + 1];
                }
                this.length = this.length - 1;
            }
        }
    }
    const onSelect = (selectedKeys, info) => {
        if (!info.node.children) {
            if (info.node.title.props.item.detail_info) {
                videoPlay(info.node.title.props.item)
            } else {
                message.warning("缺少_detail_info");
            }
            cameraList_S({ device_code: info.node.title.props.item.device_code }).then(res => {
                if (res.msg === "success") {
                    if (res.data.length > 0) {
                        var results = res.data[0]
                        console.log(results)
                        //飞行

                        Common.mapFly(mp_light, results)
                        Build.allShow(mp_light, true)

                        //分层
                        if (results.build_id) {
                            labelList({ build_id: results.build_id }).then(res2 => {
                                if (res2.msg === "success") {
                                    let floorList_s = res2.data[0].floor_name;
                                    let nfloor = [];
                                    floorList_s.forEach(element => {
                                        nfloor.push(element.floor_id.split("#")[1])
                                    });
                                    Build.showFloor(mp_light, results.build_id, results.floor_id.split("#")[1], nfloor)

                                    //弹出楼层列表
                                    let messageData = {
                                        switchName: 'buildLable',
                                        SPJK: false,
                                        Personnel: results.build_id,
                                        index: Number(results.floor_id.charAt(results.floor_id.length - 1))
                                    }
                                    window.parent.postMessage(messageData, '*')
                                }
                            })
                        }

                    } else {
                        message.warning("暂未上图");
                    }
                }
            })
        }
    }
    //删除可视区域面
    const closePolygon = () => {
        allPolygonObj.forEach(element => {
            Model.removeGid(mp_light, element.gid)
        });
        setPolygon(true)
    }

    //树结构搜索格式化
    const dataList = [];
    const generateList = data => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key, title } = node;
            dataList.push({ key, title: title });
            if (node.children) {
                generateList(node.children);
            }
        }
    };
    generateList(carmealist);

    //递归1
    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    const [expandedKeys, setExpandedKeys] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [autoExpandParent, setAutoExpandParent] = useState(true)

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys)
        setAutoExpandParent(false)
    };

    const OnSearch = (e) => {

        var nvalue = e.target.value
        const expandedKeysd = dataList.map(item => {
            if (item.title.indexOf(nvalue) > -1) {
                return getParentKey(item.key, carmealist);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(expandedKeysd)
        setSearchValue(nvalue)
        setAutoExpandParent(true)
    }
    const loop = data => data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
            index > -1 ? (
                <span item={item}>
                    {beforeStr}
                    <span className="site-tree-search-value">{searchValue}</span>
                    {
                        item.children ? <span>{afterStr}<span style={{ color: "yellow" }}>&nbsp;(总数：{getToTal(item.children)})</span></span> : <span>{afterStr}</span>
                    }
                </span>
            ) : (
                <span>
                    {
                        item.children ? <span>{item.title}<span style={{ color: "yellow" }}>&nbsp;(总数：{getToTal(item.children)})</span></span> : <span>{item.title}</span>
                    }
                </span>
            );
        if (item.children) {
            return { title, key: item.key, children: loop(item.children) };
        }
        return { title, key: item.key };
    });
    return (
        <div id="VideoSurveillance" className="VideoSurveillance animate_speed animate__animated animate__fadeInLeft">
            <div className="VideoSurveillance_top">
                <h1>视频列表</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => { props.close(); closePolygon(); Build.allShow(mp_light, true) }} />
            </div>

            <div className="VideoSurveillance_list">
                <div className="VideoSurveillance_title">
                    <span onClick={() => Dotlineselect(1)}>点查</span>
                    <span onClick={() => Dotlineselect(2)}>线查</span>
                    <span className={isPolygon ? null : "span_active"} onClick={() => { Dotlineselect(3) }}>可视区域</span>
                </div>
                <div className="Treelist">
                    <p>视频列表 </p>
                    <Input placeholder="输入名称" className="Basic-txt" onChange={(e) => OnSearch(e)} /><Button icon={<SearchOutlined />} ></Button>
                    <div className="treeDiv">
                        <Spin spinning={spinning} tip="加载中...">
                            {
                                carmealist.length > 0 ? <Tree
                                    className="carmeTree"
                                    showLine={{ showLeafIcon: false }}
                                    switcherIcon={<DownOutlined />}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    onSelect={onSelect}
                                    onExpand={onExpand}
                                    treeData={loop(carmealist)}
                                >
                                </Tree> : null
                            }
                        </Spin>
                    </div>
                </div>
            </div>

            {DotlineVislib ?
                <div className="Dotline">
                    <div className="Dotline-tit"><span>追查过程</span><img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => dotLineclose()}></img></div>
                    {
                        Dotlinelist.map((item, index) => {
                            return (index++, console.log("INDEX", index),
                                item.name === "点追查" ? <div className="Dotline-Nr">
                                    <p><span className="Dotline-Nr-tit">{index}.{item.name}</span><img src={require("../../../assets/images/shanchu-3.png").default} alt="" onClick={() => dotLinedelete(index)}></img></p>
                                    {
                                        item.children.map((str, key) => {
                                            return (key++, <span>{key}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{str}</span>)
                                        })
                                    }
                                </div> :
                                    <div className="Dotline-Nd">
                                        <p><span className="Dotline-Nr-tit">{index}.{item.name}</span><img src={require("../../../assets/images/shanchu-3.png").default} alt="" onClick={() => dotLinedelete(index)}></img></p>
                                        {
                                            item.children.map((str, key) => {
                                                return (key++, <span>{key}&nbsp;{str}</span>)
                                            })
                                        }
                                    </div>
                            )
                        })
                    }
                    <div className="Dotline-exp">导出报告</div>
                </div> : ""}
        </div>
    )

}
export default VideoSurveillance;