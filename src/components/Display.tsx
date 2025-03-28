'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerView } from "./Timer"
import { handleClientScriptLoad } from "next/script"
import { eventNames } from "process"
import { Button } from "./Button"
import { PageContext } from "@/app/page"
import { log } from "console"
import { Stats } from './Stats';  // Import the child component
import './styles.css';

const typeraceTexts = [
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
  "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
  "My name is Sherlock Holmes. It is my business to know what other people do not know.",
  "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.",
  "I have a dream that one day every valley shall be exalted, every hill and mountain shall be made low, the rough places will be made plain, and the crooked places will be made straight.",
  "There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.",
  "You have power over your mind—not outside events. Realize this, and you will find strength.",
  "The hare was once boasting of his speed before the other animals. 'I have never yet been beaten,' said he, 'when I put forth my full speed. I challenge any one here to race with me.'",
  "Then she took Gretel by the hand and led her into a little house. And there they found a table spread with delicious food, and two little beds, white and clean, were waiting for them."
];
// Get a random index from the array
const randomIndex = getRandomInt(0, typeraceTexts.length - 1);
const sample = typeraceTexts[randomIndex];

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

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
    const [textIncorrect, setTextIncorrect] = useState(0);
    const [textCorrect, setTextCorrect] = useState(0);
    const [streak,setBestStreak] = useState(0);

    const page = useContext(PageContext);

    // const intervalRef = useRef(0);
    // const [keyPress, setKeyPress] = useState("");

    const inputRef = useRef<string[]>([]);
    const textRef = useRef("");
    const pressKeyRef = useRef("");


    // const sample = sampleRandom;
    let count = 3
    let temp = 0;


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
          let newStreak = streak;
          let streakTemp = 0;
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
                setTextCorrect(textCorrect + 1)
                setBestStreak(streak+1)
                
            }
             else 
            {
                newPoints -= 100;
                setTextIncorrect(textIncorrect + 1)
                temp = streak;
                setBestStreak(0)
            }

            if(temp > streak)
            {
              setBestStreak(streak+1)
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

        let str = "";  // Declare the string variable
        for (let i = 0; i < inputArr.length; i++) {
          str += inputArr[i];  // Concatenate each item in inputArr
        }

        console.log(str);   
        textRef.current= str;

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
            {/* <div>corect: {textCorrect}</div>
            <div>Incorect: {textIncorrect}</div>
            <div>best streak: {streak}</div>
            <div> str {textRef.current}</div> */}
            </div>

         <Stats 
                correct={textCorrect} 
                incorrect={textIncorrect} 
                highestConsecutive={streak}
                totalscore={points}
                text={textRef.current}
            />

               
        </div>
       
       
  
    
             
               
        
        </>
    )
}



