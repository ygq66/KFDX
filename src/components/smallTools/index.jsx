import React,{ useState,useCallback } from 'react';
import { Common } from '../../utils/mapMethods';
import { useMappedState } from 'redux-react-hook';
import './style.scss'
 const SmallTools = () => {
    const iconList = [{icon:"fuwei",name:"复位"},{icon:"changjing",name:"场景"},{icon:"zhibeizhen",name:"指北"},{icon:"tuceng",name:"图层"}]
    const [show,setShow] = useState(false)
    const mp_light = useMappedState(state => state.map3d_light);
    const mp_dark = useMappedState(state => state.map3d_dark);
    const handleTool= useCallback((index)=>{
        switch(index){
            case 0 :
                Common.initializationPosition(mp_light)
                if(!(JSON.stringify(mp_dark) === "{}")){
                    Common.initializationPosition(mp_dark)
                }   
                break;
            default:
                console.log(iconList[index].name)
        }
        //eslint-disable-next-line
    },[mp_light,mp_dark])
    return (
        <div id="smallTools">
            {
                show?<div className="st_iconlist animate_speed animate__animated animate__fadeInRight">
                    <ul>
                        {iconList.map((item,index) => {
                            return (
                                <li key={index} onClick={()=>handleTool(index)}>
                                    <img className="img_active" src={require('../../assets/images/'+item.icon+'.png').default} alt="icon"/>
                                    <span>{item.name}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>:null
            }
            <div className="st_button" onClick={()=>setShow(!show)}>
                <img src={require('../../assets/images/gongju-icon.png').default} alt="icon"/>
                <span>小工具</span>
            </div>

        </div>
    )
}

export default SmallTools;