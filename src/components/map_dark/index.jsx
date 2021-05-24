import React,{ useEffect } from 'react';
import {createMap} from '../../utils/map3d'
import virtualization from '../../utils/virtualization'
import { useMappedState,useDispatch } from 'redux-react-hook';
import { api2 as ApiUrl2} from '../../api/address';
import './style.scss'

 const Map = (props) => {
    let view3d = '';
    const dispatch = useDispatch();
    const mapUrl = useMappedState(state => state.mapDark_url);
    useEffect(() => {
        if(mapUrl){createMapsss("http://"+mapUrl)}
        setTimeout(()=>{
            virtualization.getPolygon({view3d:view3d,url:ApiUrl2+'/digitalize/map'})
        },500)
        // eslint-disable-next-line
    },[mapUrl])
    const createMapsss =(url)=>{
        view3d = createMap.createMap({
            id: "mapv3dContainer_dark",
            url:url,
            projectId: "5nbmjsdljf785208",
            token: "rt2d645ty3eadaed32268mdta6"
        },()=>{})
        dispatch({type:"mp_dark",map3d_dark:view3d});
    }

    return (
        <div id="mapv3dContainer_dark" style={{width:props.setWidth}}></div>
    )
}
export default Map;