import React, {useRef,useState} from 'react';
import "./style.scss"
export default function Details(){
    const [aa,setaa] = useState(0)
    const testRef = useRef(0)
    const test =()=>{
        setaa(100)
        console.log(aa,'55555')
        testRef.current  = 100;
        console.log(testRef.current,'55555')
    }
    return(
        <div id="details">
            <button onClick={()=>test()}></button>
        </div>
    )
}