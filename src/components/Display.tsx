'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerView } from "./Timer"
import { handleClientScriptLoad } from "next/script"
import { eventNames } from "process"
import { Button } from "./Button"
import { PageContext } from "@/app/page"
import { log } from "console"
import './styles.css';
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
   return(
        <IOContext.Provider value={IO}>
          <div style={{alignContent:'center',justifyContent:'center',alignItems: 'center',width:"100%",display: 'flex',flexDirection:'column'}}>
            <TimerView></TimerView>
            <GenerateText text={sample}/>
            <TextInput text ={sample}></TextInput>
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
function TextInput({text}:{text:string})
{
    const io = useContext(IOContext);
    // first method variables
    // const [textInput, setVisibleText] = useState<string>('');
    const [textInput, setText] = useState<string>('');
    const [points, setPoints] = useState<number>(0)
    const [currentLetter, setCurrentLetter] = useState<string>('');
    const [inputArr, setInputArr] = useState<string[]>([]);
    const [textS, setTextS] = useState(0);
    const [textIn, setTextIn] = useState(0);
    const page = useContext(PageContext);
    // const intervalRef = useRef(0);
    // const [keyPress, setKeyPress] = useState("");

    const inputRef = useRef<string[]>([]);
    const pressKeyRef = useRef("");

    const sample = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum et nam reprehenderit rerum dolorum sed temporibus, illum iste praesentium, dignissimos corrupti doloremque? Dolorem, corrupti provident aut illum error nulla deleniti!"
    let count = 3


    const logic = (back:boolean) => 
      {
        //console.log(event.target.value)
        if(!io.text?.current){
            return
        }
          let colorSetter = io.text.current.get(textS);
          console.log(textS)
          console.log(colorSetter)
          if (colorSetter) {
            if(!back){
              if (io.timerColor && io.timerColor.current === "red") {
                  console.log("changing color to red")

                colorSetter("red");
              } else if (io.timerColor && io.timerColor.current === "green") {
                  console.log("changing color to green")

                colorSetter("green");
              }
            }else{
              colorSetter("grey");
            }
          }
          if (io.slider && io.slider.current) {
            const scrollPosition = 30*textS;
            io.slider.current.scrollLeft = scrollPosition;
            count++;
          }
          
      };

      const handleInputChange = (e: any) => 
        {
          let newPoints = points;
          let inputText = e.target.value;
          let pointTracker = 0;
          console.log(e.target.value)
          const key = e.target.value;
            if (key) 
            {
                setInputArr((prev) => [...prev, key]); // add single letter
                inputRef.current.push(key); //ref for check
                console.log("Input Array:", [...inputArr, key]);
                console.log("sample text arr " +  sample[textS]);
            }

            console.log(inputArr)
            console.log("Input : " + inputArr[textIn-1] + " VS SAMPLE: " + sample[textS])

            // Ensure input is correctly reflected in the state
            setText(inputText); // Update the state with the current input value
            console.log("Current Input:", inputText)

           
            if (inputRef.current[textIn] === sample[textS]) 
            {
                newPoints += 100; 
            }
             else 
            {
                newPoints -= 100;
            }
              
              setPoints(newPoints + pointTracker);
              setTextS(textS+1);
              setTextIn((prev) => prev + 1);

              console.log("Sample Index:", textS + 1);
              console.log("Input Index:", textIn + 1);

              logic(false)

      };


      const handleKeyDown = (e: React.KeyboardEvent) => {
        pressKeyRef.current = e.key; // Store the key pressed in the ref
        console.log("Key pressed:", e.key);

        // Detect if the Backspace key was pressed
        if (e.key === "Backspace") 
        {
          setTextS(textS - 1);
          inputArr.pop()
          setInputArr([...inputArr])
          console.log("Backspace key was pressed");
          logic(true)
        }
        else
        {
            
        }

    };

    return(
        <>
        <div className = "point-click-container">
            <header className = "header"> Click in the box to start typing</header>
           
        </div>
        
        <div className ="point-click-container">
          <p className = "point-tracking">Points: {points}</p>
        </div>
       
        <div>
            <p className = "paragraph-follow">{inputArr}</p>

        </div>
       
        <div className = "container">
            <div className = "button-container">
                <input onKeyDown={handleKeyDown} id = "inputID" type="text" placeholder="Enter text here" value={currentLetter}  style={{width:100,height:100, fontSize: '1rem', backgroundColor:"white"}}  onChange={(e)=>handleInputChange(e)}/>
            <div className = "button-right">
                <Button label={"Back Button"} onClick={()=>{
              if(page.setPage &&  page.setStats){
                page.setStats({correct:20,highestConsecutive:10,text:inputArr.join(''),incorrect:30})
                page.setPage("stats")
              }
                } } ></Button>
               
            </div>
            </div>
               
        </div>
   
  
    
             
               
        
        </>
    )
}



