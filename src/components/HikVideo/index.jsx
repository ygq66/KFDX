import React, { useState, useEffect } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

import $ from 'jquery'
import "./style.scss"
var oWebControl = null;
var initCount = 0;

const HikVideo = () => {
    const dispatch = useDispatch()
    const videoUrl_http_flv = useMappedState(state => state.video_url);
    const [show, setShow] = useState(false)
    useEffect(() => {
        initPlugin()
        if (videoUrl_http_flv) {
            console.log("videoUrl_http_flv4144444")
            setShow(true)

            setTimeout(() => {
                // startPreview(videoUrl_http_flv)
                console.log(videoUrl_http_flv, "videoUrl_http_flv是什么玩意,")
                startPreview(videoUrl_http_flv)

            }, 1000);
        }
    }, [videoUrl_http_flv])
    debugger
    const initPlugin = () => {
        oWebControl = new window.WebControl({ // 创建 WebControl 实例
            szPluginContainer: "playWnd", // DIV 窗口识别
            iServicePortStart: 17010, // 开始端口号
            iServicePortEnd: 17019, // 结束端口号 
            // 用于通过 IE10 调用 ActiveX 控制的 CLSID 
            szClassId: "DD55D830-A127-49bd-944C-36AF7CCB245A ",
            cbConnectSuccess: function () {
                // 创建 WebControl 实例成功
                console.log("创建 WebControl 实例成功");
            },
            cbConnectError: function () {
                // 创建 WebControl 实例失败
                console.log("创建 WebControl 实例失败");
            },
            cbConnectClose: function (bNormalClose) {
                //插件使用过程中发生断开与插件服务连接时回调的 bNormalClose 的值："false"-异常断开， "true"-正常断开
            }
        });

        //启动插件
        oWebControl = new window.WebControl({ // 创建 WebControl 实例 
            szPluginContainer: "playWnd", // DIV 窗口识别
            iServicePortStart: 17010, // 开始端口号
            iServicePortEnd: 17019, // 结束端口号 
            // 用于通过 IE10 调用 ActiveX 控制的 CLSID 
            szClassId: "DD55D830-A127-49bd-944C-36AF7CCB245A ",
            cbConnectSuccess: function () {

                //创建 WebControl 实例成功
                // 启动插件服务 
                oWebControl.JS_StartService("window", {
                    dllPath: "./WebInterLayer.dll"
                }).then(function () { //启动插件服务成功
                    //设置消息回调 
                    setCallbacks();
                    //创建视频播放窗口并设置宽高 
                    oWebControl.JS_CreateWnd("playWnd", 500, 500).then(function () {
                        init(); // 创建播放实例后初始化 
                        console.log("创建播放实例后初始化成功");
                    });
                }, function () { // 启动插件服务失败 
                    console.log("启动插件服务失败 ");
                });
            },
            cbConnectError: function () { //创建 WebControl 实例失败
                oWebControl = null;
                $("#playWnd").html("正在启动插件， 请稍候。。。");
                // 程序未启动时执行 Error 函数，采用 JS_WakeUp 来启动程序 
                window.WebControl.JS_WakeUp("HCVideoSDKWebControl://");
                initCount++;
                if (initCount < 3) {
                    setTimeout(function () {
                        initPlugin();
                    }, 3000)
                } else {
                    $("#playWnd").html("插件启动失败， 请检查插件是否安装。");
                }
            },
            cbConnectClose: function (bNormalClose) { // bNormalClose 的值："false"-异常断开， "true"-正常断开
                console.log("cbConnectClose");
                oWebControl = null;
            }
        });

    }
    // Setting window control callback 设置窗口控件回调
    const setCallbacks = () => {
        oWebControl.JS_SetWindowControlCallback({
            cbIntegrationCallBack: cbIntegrationCallBack
        });
    }
    // Push message 推送消息
    const cbIntegrationCallBack = (oData) => {
        showCBInfo(JSON.stringify(oData.responseMsg));
    }

    //初始化插件
    const init = () => {
        var appkey = "22522673"; // 必填，OpenAPI 网关提供的 appkey
        var secret = "USzE2zSKbKZs57cSDoQl"; // 必填，“DuyWn2H7Qb7jB9rPArth”为 OpenAPI 网关提供的密钥
        var ip = "192.168.80.251"; // 必填，OpenAPI 网关的 IP 地址
        var playMode = 0; // 必填，初始播放模：0-预览，1-回放
        var port = 443; // 必填，OpenAPI 网关的端口号。若启用 HTTP 协议，默认端口号为 443
        var snapDir = "D:\\SnapDir"; // 可选，抓图存储路径 
        var layout = "1x1"; // 必填，播放窗口分屏布局 
        console.log({
            appkey: appkey,
            secret: secret,
            ip: ip,
            playMode: 0, // preview
            port: port,
            snapDir: snapDir,
            layout: layout
        });
        oWebControl.JS_RequestInterface({
            funcName: "init",
            argument: JSON.stringify({
                appkey: appkey,
                secret: secret,
                ip: ip,
                playMode: playMode,
                port: port,
                snapDir: snapDir,
                layout: layout
            })
        }).then(function (oData) {
            showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
        });
    }

    //开始实时预览
    const startPreview = (cameraCode) => {
        // var cameraIndexCode = cameraCode;
        console.log(cameraCode, "实时预览视频编码")
        var streamMode = 0;
        var transMode = 1;
        var gpuMode = 0;
        // if (!cameraCode) {
        //     // showCBInfo(msgObj.cameraNoIsEmpty, 'error');
        //     return
        // }
        oWebControl.JS_RequestInterface({
            funcName: "startPreview",
            argument: JSON.stringify({
                cameraIndexCode: cameraCode,
                streamMode: streamMode,
                transMode: transMode,
                gpuMode: transMode

            })
            // argument: {
            //     cameraIndexCode: cameraCode,
            //     streamMode: streamMode,
            //     transMode: transMode,
            //     gpuMode: transMode

            // }
        }).then(function (oData) {
            console.log(oData, "调取成功了撒")
            showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
        });
    }
    // 标签关闭
    // window.unload = function () {
    //     // 此处请勿调反初始化
    //     if (oWebControl != null) {
    //         oWebControl.JS_Disconnect().then(function () {
    //             console.log("断开与插件服务的连接成功");
    //         }, function () {
    //             console.log("断开与插件服务的连接成功");
    //         });
    //     }
    // };

    // 显示回调信息
    const showCBInfo = (szInfo, type) => {
        if (type === 'error') {
            szInfo = "<div style='color: red;'>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
        } else {
            szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
        }
        $("#cbInfo").html(szInfo + $("#cbInfo").html());
    }
    // Formatting time
    const dateFormat = (oDate, fmt) => {
        var o = {
            "M+": oDate.getMonth() + 1, //month
            "d+": oDate.getDate(), //day
            "h+": oDate.getHours(), //hour
            "m+": oDate.getMinutes(), //minute
            "s+": oDate.getSeconds(), //second
            "q+": Math.floor((oDate.getMonth() + 3) / 3), //quarter
            "S": oDate.getMilliseconds()//millisecond
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    const closeHikVideo = () => {
        dispatch({ type: "checkVideoUrl", video_url: null });
        setShow(false)
        // 断开与插件服务的连接 

        
        oWebControl.JS_HideWnd();// 隐藏插件窗口，避免插件窗口滞后于浏览器而消失的问题
    }

        return (
            <>
                {
                    show ?
                        <div className='HikVideo'>
                            <div className='video_header'>
                                <span>视频监控</span>
                                <div className='vh_right'>
                                    <img src={require("../../assets/images/closeBtn.png").default} alt="" onClick={() => closeHikVideo()} />
                                </div>
                            </div>
                            <div id="playWnd" class="playWnd"></div>
                        </div>

                        : null

                }

            </>


        )
    }

    export default HikVideo;