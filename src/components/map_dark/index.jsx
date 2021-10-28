import React,{ useEffect } from 'react';
import {createMap} from '../../utils/map3d'
// import virtualization from '../../utils/virtualization'
import { useMappedState,useDispatch } from 'redux-react-hook';
// import { api2 as ApiUrl2} from '../../api/address';
import { pjectid2 as projectId2, tk2 as token2} from '../../api/address';
import './style.scss'

 const Map = (props) => {
    let view3d = '';
    const dispatch = useDispatch();
    const mapUrl = useMappedState(state => state.mapDark_url);
    useEffect(() => {
        if(mapUrl){createMapsss("http://"+mapUrl)}
        // setTimeout(()=>{
        //     virtualization.getPolygon({view3d:view3d,url:ApiUrl2+'/digitalize/map'})
        // },500)
        // eslint-disable-next-line
    },[mapUrl])
    const createMapsss =(url)=>{
        view3d = createMap.createMap({
            id: "mapv3dContainer_dark",
            url:url,
            projectId: projectId2,
            token: token2
        },()=>{})
        dispatch({type:"mp_dark",map3d_dark:view3d});
    }

    return (
        <div id="mapv3dContainer_dark" style={{width:props.setWidth}}></div>
    )
}
export default Map;