'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerViewLights, TimerViewMeta } from "./Timer"
import {  PageContext } from "@/app/page"
import './styles.css';
import { secondaryBackgroundColor, correctColor, yellowColor, incorrectColor } from "@/styles" 
import GameMenu from "./sideMenue"
export type IOHandler={
    text?: RefObject<Map<number,characterColor>|null>,
    slider?: RefObject<HTMLDivElement | null>
    timerColor?: RefObject<string | null>

}
export const IOContext =  createContext<IOHandler>({}) 

type characterColor = {backgroundColor:string,setBackground:Dispatch<SetStateAction<string>>, setBorder:Dispatch<SetStateAction<number>>}
export function Display(){
    const text = new Map<number,characterColor>()
    const textRef = useRef(text)
    const slider =  useRef<HTMLDivElement | null>(null);
    const timerColor = useRef("red") //only use refs at this level bc useStates will cause re-renders
    const IO:IOHandler = {text:textRef,slider,timerColor}
    const page = useContext(PageContext);
    const [sample,setSample]=useState<string>("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente maxime accusantium, laboriosam quia deleniti blanditiis? Ipsam aut laudantium omnis, mollitia voluptatibus labore. Odio illo magnam ut esse iure, exercitationem dolore?".slice(page.stats?.startingIndex))
   return(
        <IOContext.Provider value={IO}>
          <div style={{alignContent:'center',marginTop:30,justifyContent:'center',alignItems: 'center',width:"100%",display: 'flex',flexDirection:'column'}}>
            <div style={{ display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  justifyContent: 'space-between', // Distribute items horizontally with space between
  alignItems: 'center', // Vertically center the items in the container
  width: '100%', // Full width of the container
  padding: '10px',}}>
    <div style={{
       display: 'flex',
       justifyContent: 'center', // Centers the content horizontally within the left div
       alignItems: 'center',}}><GameMenu totalPoints={100} multiplier={1}></GameMenu></div>
 
 <div >
 <TimerViewLights></TimerViewLights>
 </div>
  </div>
           
            <div style={{marginTop:20}}></div>
            <GenerateText text={sample}/>
            <TextInput text ={sample}></TextInput>
          </div>
        </IOContext.Provider>
    )
}
function Character({id,value}:{id:number,value:string}){
    const io = useContext(IOContext);
    const [backgroundColor,setBackground]=useState("#778888")
    const [border,setBorder]=useState(0)
    const color = useRef("grey").current
    useEffect(()=>{
        if(io.text?.current){
            io.text.current.set(id,{backgroundColor:color,setBackground: setBackground, setBorder:setBorder})
        }
        if(id==0){
            setBorder(2)
        }
    },[])
    return(
        <div style={{backgroundColor, 
            display: 'inline-block', // Ensures the text stays inline horizontally
            whiteSpace:'break-spaces',
            width:'30px',height:'30px',
            fontSize: '24px',
            borderWidth:border,
            borderStyle:'solid',
            borderColor:'yellow',
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
  bestStreak:number,
  currentStreak:number
}
function TextInput({text}:{text:string})
{
    const io = useContext(IOContext);
    const [points, setPoints] = useState<tracker>({correct:0,incorrect:0,bestStreak:0,currentStreak:0})
    const currentUserOutput = useRef("") //no waiting for state to update
    const currentIndex = useRef(0)
    const tracking = useRef<tracker>({correct:0,incorrect:0,bestStreak:0,currentStreak:0})
    const page = useContext(PageContext);
    const textInputRef = useRef<HTMLInputElement | null> (null);
    let [startingMult,setStartingMult]=useState(page.stats?.multiplier?page.stats.multiplier:1)

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
        if(!io.text?.current){
          return
        }
        currentIndex.current-- //make sure points aren't double counted
        let color = io.text.current.get(currentIndex.current)?.backgroundColor;
        if( color==="green"){
          tracking.current.correct--
        }
        moveBackOne()
      }
      function handleForward(){
        let scored = false
        if(currentIndex.current>=text.length){
          return false
        }
        let currentTextMatch = (text[currentIndex.current].toLowerCase()===currentUserOutput.current[currentIndex.current].toLowerCase() )
        if(currentTextMatch){
          tracking.current.currentStreak++
          if(tracking.current.currentStreak>tracking.current.bestStreak){
            tracking.current.bestStreak = tracking.current.currentStreak
          }
        }
        scored = moveForwardOne({correct:currentTextMatch})
        currentIndex.current++
        return scored
      }
      function moveForwardOne({correct}:{correct:boolean}){
        let scored = false
        if(!io.text?.current){
          return false
        }
        let colorSetter = io.text.current.get(currentIndex.current);
        let colorSetterNext = io.text.current.get(currentIndex.current+1);
        if (colorSetter==undefined) {
          return false
        }
        colorSetterNext?.setBorder(3);
        if (correct==false ||(io.timerColor && io.timerColor.current === "red")) {
          tracking.current.incorrect+=1
          tracking.current.currentStreak =0
          colorSetter.setBackground("#CC2222");
          colorSetter.setBorder(0);
          colorSetter.backgroundColor = "red"
        }else if (correct==true && io.timerColor && io.timerColor.current === "green") {
          tracking.current.correct+=1
          colorSetter.setBackground("#669922");
          colorSetter.setBorder(0);
          colorSetter.backgroundColor = "green"
          scored = true
        }
        if (io.slider && io.slider.current) {
          const scrollPosition = 30*(currentIndex.current);
          io.slider.current.scrollLeft = scrollPosition;
        }
        return scored
      }
      function moveBackOne(){
        if(!io.text?.current){
          return
        }
        let colorSetter = io.text.current.get(currentIndex.current);
        let colorSetterPrev = io.text.current.get(currentIndex.current+1);
        if (colorSetter==undefined) {
          return
        }
        colorSetterPrev?.setBorder(0);
        colorSetter.setBackground("grey");
        colorSetter.setBorder(3);
        colorSetter.backgroundColor = "grey"
        if (io.slider && io.slider.current) {
          const scrollPosition = 30*(currentIndex.current-1);
          io.slider.current.scrollLeft = scrollPosition;
        }
      }


      const handleKeyDown = (e: React.KeyboardEvent) => {
        let scored = false
        if (e.key === "Backspace") 
        {
          currentUserOutput.current = currentUserOutput.current.slice(0,-1)
          handleBack()
          scored = false
        }
        else if( /^[a-zA-Z0-9]$/.test(e.key) || /^[\W_]$/.test(e.key)){//all other characters
          if(currentIndex.current>=text.length){
            return
          }
          currentUserOutput.current += e.key
          scored = handleForward()
        }
        if(page && page.setStats && page.stats){
          page.stats.multiplier = scored?(startingMult+(Math.floor(page.stats.currentConsecutive/5))):1
          scored==false?startingMult=1:null
          page.setStats({startingIndex:page.stats.startingIndex,currentIndex:currentIndex.current,text:currentUserOutput.current,correct:tracking.current.correct,incorrect:tracking.current.incorrect,highestConsecutive:tracking.current.bestStreak,points:page.stats.points+(scored?page.stats.multiplier:0),multiplier:page.stats.multiplier, currentConsecutive:tracking.current.currentStreak})
        }
        setPoints(tracking.current)

    };
    

    return(
        <>
       
        <div className = "container">
            <div className = "button-container">
              <input ref={textInputRef} type="text" spellCheck="false"  autoComplete="off" autoCorrect='off' autoCapitalize="off" onKeyDown={handleKeyDown} id = "inputID" style={{width:100,height:100,fontSize: '1rem', opacity:0}} />
            </div>
        </div>
        
        </>
    )
}



