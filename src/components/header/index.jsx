import React,{ useState,useEffect } from 'react';
import './style.scss'
import { getLogin,getConfig,layoutList } from '../../api/mainApi'
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Common } from '../../utils/mapMethods';

function Header(){
    const dispatch = useDispatch();
    const mp_light = useMappedState(state => state.map3d_light);
    const top_count = useMappedState(state => state.top_navigation_count);
    const [timeNow,setTime]  = useState()
    const [systemTitle,setST] = useState()
    const [titleModule,setTM] = useState([])
   
    useEffect(() => {
        showtime()
        login_user()
        // eslint-disable-next-line
    },[top_count])
    // move time
    const showtime=()=>{
        var date=new Date();
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        var day=date.getDate();
        var hours=date.getHours();
        var minutes=date.getMinutes();
        var seconds=date.getSeconds();
        if(month<10){month = "0"+month}
        if(day<10){day = "0"+day}
        if(hours<10){hours = "0"+hours}
        if(minutes<10){minutes = "0"+minutes}
        if(seconds<10){seconds = "0"+seconds}
        var time=year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
        setTime(time)
        setTimeout(showtime,1000)
    }
    // login
    const login_user = ()=>{
        getLogin({user_name:'admin',user_pwd:'admin'}).then(res=>{
            dispatch({type:"userData",userData:res.data})
            if(res.msg === "success"){
                getConfig().then(res=>{
                    if(res.msg ==="success"){
                        setST(res.data.sys_name)
                        get_layout_list(res.data.scenarios_id,res.data.versions_id)
                    }
                })
            }
        })
    }
    // header module list
    const get_layout_list = (sid,vid)=>{
        layoutList({scenarios_id:sid,versions_id:vid}).then(res=>{
            if(res.msg === "success"){
                setTM(res.data.top_navigation)
            }
        })
    }
    // handle top
    const handle_top = (item,index) =>{
        console.log(mp_light,'??????')
        if(mp_light){
            Common.navigationClose(mp_light)
        }
        dispatch({type:"handleTop",top_navigation_count:index});
        dispatch({type:"handleModule",top_navigation_module:item.page});
    }
    
    return (
        <div className="header">
            <div className="header_line"></div>
            <div className="header_content">
                <div className="fogemt">
                    <div className="header_c_title">
                        <div className="title_left">
                            <h1>{systemTitle}</h1>
                            <img src={require('../../assets/header_img/title_light.png').default} alt="light_bg"/>
                        </div>
                        <div className="title_right_img">
                            <img src={require('../../assets/header_img/title_point.png').default} alt=""/>
                        </div>
                    </div>
                    <div className="header_title_list">
                        <ul>
                            {titleModule.map((item, index) => {
                                return (
                                    <li key={index} className={top_count === index?"active_LI":null} onClick={()=>handle_top(item,index)}>{item.modules_name}</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="header_time_user">
                    <div className="line"></div>
                    <div className="time">
                        <span>{timeNow}</span>
                    </div>
                    <img src={require('../../assets/header_img/user.png').default} alt="user"/>
                </div>
            </div>
        </div>
    )
}
export default Header;