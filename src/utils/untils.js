import { vSocekt as videoS, iSocket as intercomS } from '../api/address';
import { message } from 'antd';


//打开视频控件
export function videoPlay(data,wm) {
    const webSocket = new WebSocket(videoS)
    webSocket.onopen = function (e) {
        console.log('%c video websocket is open:',"color: red;font-size:13px")
        /* _大华_汉中_赵猛 */
        // var json ={
        //     "type": "play",
        //     "cameraCode":data.device_code
        // }
        /* _海康_呼和浩特_卫录屏 */
        var json ={
            "type": "PlayVideo",
            "winNumber": wm || "1",
            "detailInfo": data.detail_info
        }
        webSocket.send(JSON.stringify(json))
    }
}

//对讲功能
export function intercomPlay(data) {
    const webSocket = new WebSocket(intercomS)
    webSocket.onopen = function (e) {
        console.log('%c intercom websocket is open:',"color: red;font-size:13px")
        var json ={
            "host": data.host,
            "soin": data.soin,
            "IsRead": data.IsRead
        }
        webSocket.send(JSON.stringify(json))
    }
    webSocket.onmessage = function (e) {
        let datamsg = "操作成功"
        if(data.IsRead === 1){
            datamsg = "呼叫成功"
        }else if(data.IsRead === 2){
            datamsg = "挂断成功"
        }else if(data.IsRead === 3){
            datamsg = "多人呼叫成功"
        }else if(data.IsRead === 4){
            datamsg = "多人挂断成功"
        }
        if(e.data){message.success(datamsg)}
    }
}

//格式化时间
export function timeFormat(date) {
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}