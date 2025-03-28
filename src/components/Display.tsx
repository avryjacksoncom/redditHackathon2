'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerViewLights, TimerViewMeta } from "./Timer"
import {  PageContext } from "@/app/page"
import './styles.css';
import { Button } from "./Button"
export type IOHandler={
    text?: RefObject<Map<number, Dispatch<SetStateAction<string>>>|null>,
    slider?: RefObject<HTMLDivElement | null>
    timerColor?: RefObject<string | null>
}
export const IOContext =  createContext<IOHandler>({}) 


export function Display(){
    const text = new Map<number,Dispatch<SetStateAction<string>>>()
    const textRef = useRef(text)
    const slider =  useRef<HTMLDivElement | null>(null);
    const timerColor = useRef("red") //only use refs at this level bc useStates will cause re-renders
    const IO:IOHandler = {text:textRef,slider,timerColor}
    const sample = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente maxime accusantium, laboriosam quia deleniti blanditiis? Ipsam aut laudantium omnis, mollitia voluptatibus labore. Odio illo magnam ut esse iure, exercitationem dolore?"
    const [restart, setRestart]=useState(false)
   return(
        <IOContext.Provider value={IO}>
          <div color={restart==true? "":""} style={{alignContent:'center',marginTop:30,justifyContent:'center',alignItems: 'center',width:"100%",display: 'flex',flexDirection:'column'}}>
            <TimerViewLights></TimerViewLights>
            <div style={{marginTop:20}}></div>
            <TimerViewMeta></TimerViewMeta>
            <GenerateText text={sample}/>
            <TextInput text ={sample}></TextInput>
            <Button onClick={()=>{setRestart(true)}} label="restart"></Button>
          </div>
        </IOContext.Provider>
    )
}
function Character({id,value}:{id:number,value:string}){
    const io = useContext(IOContext);
    const [backgroundColor,setBackground]=useState("grey")
    useEffect(()=>{
        console.log("setting context vals")
        if(io.text?.current){
            io.text.current.set(id,setBackground)
        }
    },[])
    return(
        <div style={{backgroundColor, 
            display: 'inline-block', // Ensures the text stays inline horizontally
            whiteSpace:'break-spaces',
            width:'30px',height:'30px',
            fontSize: '24px',
            borderWidth:1,
            borderStyle:'solid',
            borderColor:''
        }}>
                {value}
        </div>
    )
}
function GenerateText({text}:{text:string}){
    let characters= text.split('')
    let [elements,setElements]=useState<Array<JSX.Element>>([])
    let [loading,setLoading]=useState(true)
    async function rendering(){ //kinda went overkill with this setup but it makes it efficient for large texts
        let elem = []
        for(let i= 0;i<5;i++){
          elem.push(<Character id={-10} value={" "} ></Character>)
        }
        for(let i=0; i<characters.length;i++){
            elem.push(<Character id={i} value={characters[i]} ></Character>)
        }
        setElements(elem)
        setLoading(false)
    }
    useEffect(()=>{
        if(loading){
            rendering()
        }
    },[loading])

    if(loading){
        return <></>
    }
    
    return <HorizontalScroll>
        {elements}
    </HorizontalScroll>
}
type tracker={
  correct:number,
  incorrect:number,
  streak:number
}
function TextInput({text}:{text:string})
{
    const io = useContext(IOContext);
    const [points, setPoints] = useState<number>(0)
    const [userOutput,setUserOutput] = useState("")
    const currentUserOutput = useRef("") //no waiting for state to update
    const currentIndex = useRef(0)
    const page = useContext(PageContext);
    const textInputRef = useRef<HTMLInputElement | null> (null);

    useEffect(() => {//handling text input focus lock
      if(!textInputRef.current){
        return
      }
      // Focus the input element when the component mounts
      textInputRef.current.focus();
  
      // Prevent focus from leaving the input by blocking mousedown events on other elements
      const handleMouseDown = (event:MouseEvent) => {
        if(!textInputRef.current){
          return
        }
        if (event.target !== textInputRef.current) {
          event.preventDefault();  // Prevent focus from shifting
          textInputRef.current.focus();  // Keep focus on the input
        }
      };
      if(!textInputRef.current){
        return
      }
      // Attach the event listener
      document.addEventListener('mousedown', handleMouseDown);
  
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
      };
    }, []);

      function handleBack(){
        if(!(currentIndex.current>0)){
          return
        }
        currentIndex.current-- //make sure points aren't double counted
        let previousTextMatch = text[currentIndex.current]===currentUserOutput.current[currentIndex.current]
        if(previousTextMatch){
          subtractPoints()
        }
        moveBackOne()
      }
      function handleForward(){
        if(currentIndex.current>=text.length){
          return
        }
        console.log(currentUserOutput.current)
        let currentTextMatch = text[currentIndex.current]===currentUserOutput.current[currentIndex.current]
        if(currentTextMatch){
          addPoints()
        }
        moveForwardOne({correct:currentTextMatch})
        currentIndex.current++
      }
      function moveForwardOne({correct}:{correct:boolean}){
        if(!io.text?.current){
          return
        }
        let colorSetter = io.text.current.get(currentIndex.current);
        if (colorSetter==undefined) {
          return
        }
        
        if (correct==false ||(io.timerColor && io.timerColor.current === "red")) {
          console.log("changing color to red")
          colorSetter("red");
        }else if (correct==true &&io.timerColor && io.timerColor.current === "green") {
          console.log("changing color to green")
          colorSetter("green");
        }
        if (io.slider && io.slider.current) {
          const scrollPosition = 30*(currentIndex.current);
          io.slider.current.scrollLeft = scrollPosition;
        }
      }
      function moveBackOne(){
        if(!io.text?.current){
          return
        }
        let colorSetter = io.text.current.get(currentIndex.current);
        if (colorSetter==undefined) {
          return
        }
        colorSetter("grey");
        if (io.slider && io.slider.current) {
          const scrollPosition = 30*(currentIndex.current-1);
          io.slider.current.scrollLeft = scrollPosition;
        }
      }
      function subtractPoints(){

      }
      function addPoints(){

      }


      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Backspace") 
        {
          console.log("Key pressed:", e.key);
          currentUserOutput.current = currentUserOutput.current.slice(0,-1)
          handleBack()
          setUserOutput( currentUserOutput.current)
          if(page && page.setStats && page.stats){
            page.setStats({...page.stats,correct:points, text:currentUserOutput.current})
          }
        }
        else if( /^[a-zA-Z0-9]$/.test(e.key) || /^[\W_]$/.test(e.key)){//all other characters
          if(currentIndex.current>=text.length){
            return
          }
          console.log("Key pressed:", e.key);
          currentUserOutput.current += e.key
          handleForward()
          setUserOutput(currentUserOutput.current)
          if(page && page.setStats && page.stats){
            page.setStats({...page.stats,correct:points, text:currentUserOutput.current})
          }
        }
        
    };
    

    return(
        <>
        
        <div className ="point-click-container">
          <p className = "point-tracking">Points: {points}</p>
        </div>
       
        <div>
            <p className = "paragraph-follow">{userOutput}</p>
        </div>
       
        <div className = "container">
            <div className = "button-container">
                <input ref={textInputRef}  onKeyDown={handleKeyDown} id = "inputID" type="text"  style={{width:100,height:100,fontSize: '1rem', opacity:0}} />
            </div>
        </div>
        
        </>
    )
}



