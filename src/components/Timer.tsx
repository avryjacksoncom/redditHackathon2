import { useContext, useEffect, useRef, useState } from "react"
import { IOContext } from "./Display"
import { StopLightHead } from "./Stoplight"
import { PageContext } from "@/app/page"

interface TimerInterface{
    secondsCountDown: number
    setSeconds?:Function
    onTimerEnd?: Function
    visible: boolean
    isStopped: boolean
  }
  const formatSeconds=(seconds:number)=>{
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    // Pad the minutes and seconds with leading zeros if necessary
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');
    return(`${minutesStr}:${secondsStr}`)
  }
  
  export function Timer({secondsCountDown,setSeconds, onTimerEnd,visible,isStopped}:TimerInterface) {
    const secondsRef = useRef(secondsCountDown);
    const intervalIdRef = useRef< NodeJS.Timeout|null>(null);
    const [formattedTime, setFormattedTime]=useState(formatSeconds(secondsCountDown))
  
    const startTimer = () => {
      if (intervalIdRef.current != null) {
        return;
      }
      let temp = setInterval(() => {
        secondsRef.current -= 1;
        setFormattedTime(formatSeconds(secondsRef.current))
        if(setSeconds){
          setSeconds(formatSeconds(secondsRef.current))
        }
        if (secondsRef.current<=0){ //stops timer when it hits zero
          clearInterval(temp);
          if (onTimerEnd){
            onTimerEnd((seconds:number)=>{
              secondsRef.current=seconds
            })
          }
        }
      }, 1000);
      intervalIdRef.current=temp;
      
    };
  
    const stopTimer = () => {
      if(intervalIdRef.current==null){
        return
      }
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null
    };
    if (isStopped){
      stopTimer()
    }
    if (!isStopped){
      startTimer()
    }
    
    useEffect(()=>{
      startTimer()
      return()=>{
        stopTimer()
      }
    },[])
    return(<></>)
  }
export function TimerViewLights(){
    const [seconds,setSeconds]= useState<number>(2)//initial timer to start the game 
    const [formattedTime,setFormattedTime] = useState<string>("");
    const [rerenderTimer,setRerenderTimer]=useState<boolean>(true)
    const [color,setColor]=useState("red")
    const io = useContext(IOContext);
    const resetTimer=(start:number,end:number)=>{
        let randomTime =Math.floor( Math.random()*(end-start)+start)
        setSeconds(randomTime)
    }
    useEffect(()=>{
        if(rerenderTimer==false){
          console.log("changing color")
            setRerenderTimer(true)
            if(color=='green'){
                resetTimer(2,3)
                setColor("yellow")
            }
            else if(color=='yellow'){
              if(io.timerColor){
                  io.timerColor.current="red"
              }
              resetTimer(2,3)
              setColor("red")
          }
          else if(color=="red"){
                resetTimer(4,15)
                if(io.timerColor){
                    io.timerColor.current="green"
                }
                //io.timerColor?io.timerColor.current="green":null
                setColor("green")
            }
        }
    },[rerenderTimer])
    return(
        <>
            {rerenderTimer&&<Timer secondsCountDown={seconds} setSeconds={setFormattedTime} visible={true} onTimerEnd={()=>{setRerenderTimer(false)}} isStopped={false}/> 
            }
              <div style={{width:'20%'}}>
              <StopLightHead initialColor={color}></StopLightHead>
              </div>
        </>
    )
}
export function TimerViewMeta(){
  const [seconds,setSeconds]= useState<number>(10)//initial timer to start the game 
  const [formattedTime,setFormattedTime] = useState<string>("");
  const [rerenderTimer,setRerenderTimer]=useState<boolean>(true)
  const page = useContext(PageContext);
  useEffect(()=>{
      if(rerenderTimer==false){
        if(page.setPage ){
          page.setPage("stats")
        }
      }
  },[rerenderTimer])
  return(
      <>
          {rerenderTimer&&<Timer secondsCountDown={seconds} setSeconds={setFormattedTime} visible={true} onTimerEnd={()=>{setRerenderTimer(false)}} isStopped={false}/> 
          }
          <p>Game ends in: {formattedTime}</p>
      </>
  )
}