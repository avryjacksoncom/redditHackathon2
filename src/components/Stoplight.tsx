import { useEffect, useState } from "react";

export const StopLight = () => {
    // State to hold the color of the lights
    const [color,setColor]=useState("red")
    const [greenLight, setGreenLight] = useState('#006600'); // default green
    const [yellowLight, setYellowLight] = useState('#808000'); // default yellow
    const [redLight, setRedLight] = useState('#660000'); // default red
    function setDefault(){
        setGreenLight("#006600")
        setYellowLight("#808000")
        setRedLight("#660000")
    }
    function setColorRed(){
        setDefault()
        setRedLight("#FF0000")
        setColor("red")
    }
    function setColorYellow(){
        setDefault()
        setYellowLight("#F0F000")
        setColor("yellow")
    }
    function setColorGreen(){
        setDefault()
        setGreenLight("#00FF00")
        setColor("green")
    }
    useEffect(()=>{toggleLights()},[])
    // Function to toggle lights (for example, changing colors)
    const toggleLights = () => {
        if(color=="red"){
            setColorGreen()
        }
        if(color=="green"){
            setColorYellow()
        }
        if(color=="yellow"){
            setColorRed()
        }
    };
    return(
            <svg onClick={toggleLights} strokeMiterlimit="10" style={{ display: 'block', height:'auto', margin: '0 auto' , fillRule: 'nonzero', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round' }} version="1.1" viewBox="118.825 204.208 246.991 767.281"  xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs/>
            <g id="Layer-1">
            <path d="M194.383 866.49L283.5 865.248L283.5 567L200.899 567L194.383 866.49Z" fill="#26273d" fillRule="nonzero" opacity="1" stroke="#53555a" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="7"/>
            <path d="M129.416 234.112C117.61 263.592 126.424 542.454 138.085 555.495C149.745 568.535 329.14 571.261 345.942 552.512C362.745 533.763 365.728 262.77 352.76 230.719C339.793 198.667 141.223 204.632 129.416 234.112Z" fill="#26273d" fillRule="nonzero" opacity="1" stroke="#53555a" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="7"/>
            <path fill={redLight} d="M217.642 277.827C206.746 303.511 205.371 320.905 241.702 318.899C278.033 316.894 279.463 302.606 265.762 273.602C252.061 244.599 228.538 252.142 217.642 277.827Z"  opacity="1" stroke="#999999" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="5"/>
            <path fill={yellowLight} d="M240.126 361.325C212.247 362.402 195.923 368.564 213.207 400.583C230.491 432.602 244.027 427.812 264.437 403.066C284.847 378.32 268.006 360.248 240.126 361.325Z"  opacity="1" stroke="#999999" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="5"/>
            <path fill={greenLight} d="M222.157 510.612C242.838 529.34 258.815 536.353 268.854 501.379C278.894 466.405 265.868 460.361 233.974 463.775C202.079 467.188 201.477 491.884 222.157 510.612Z"  opacity="1" stroke="#999999" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="5"/>
            </g>
            </svg>
    )
}
export function StopLightHead ({initialColor}:{initialColor:string}){
    // State to hold the color of the lights
    const [color,setColor]=useState(initialColor)
    const [greenLight, setGreenLight] = useState('#006600'); // default green
    const [yellowLight, setYellowLight] = useState('#808000'); // default yellow
    const [redLight, setRedLight] = useState('#660000'); // default red
    function setDefault(){
        setGreenLight("#006600")
        setYellowLight("#808000")
        setRedLight("#660000")
    }
    function setColorRed(){
        setDefault()
        setRedLight("#FF0000")
        setColor("red")
    }
    function setColorYellow(){
        setDefault()
        setYellowLight("#F0F000")
        setColor("yellow")
    }
    function setColorGreen(){
        setDefault()
        setGreenLight("#00FF00")
        setColor("green")
    }
    useEffect(()=>{
        toggleLights()
    },[initialColor])
    // Function to toggle lights (for example, changing colors)
    const toggleLights = () => {
        if(initialColor=="red"){
            setColorRed()
        }
        if(initialColor=="green"){
            setColorGreen()
        }
        if(initialColor=="yellow"){
            setColorYellow()
        }
    };
    return(
            <svg style={{  margin: '0 auto' ,width:'350%',height:'250%', fillRule: 'nonzero', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round',objectFit: 'contain' }} version="1.1" viewBox="240.825 204.208 490.991 367.281"  xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs/>
            <g id="Layer-1" transform="scale(2, 1)">
            <path fill={redLight} d="M217.642 277.827C206.746 303.511 205.371 320.905 241.702 318.899C278.033 316.894 279.463 302.606 265.762 273.602C252.061 244.599 228.538 252.142 217.642 277.827Z"  opacity="1" stroke="#999999" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="5"/>
            <path fill={yellowLight} d="M240.126 361.325C212.247 362.402 195.923 368.564 213.207 400.583C230.491 432.602 244.027 427.812 264.437 403.066C284.847 378.32 268.006 360.248 240.126 361.325Z"  opacity="1" stroke="#999999" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="5"/>
            <path fill={greenLight}  d="M222.157 510.612C242.838 529.34 258.815 536.353 268.854 501.379C278.894 466.405 265.868 460.361 233.974 463.775C202.079 467.188 201.477 491.884 222.157 510.612Z"  opacity="1" stroke="#999999" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="5"/>
            </g>
            </svg>
    )
}