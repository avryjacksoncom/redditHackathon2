'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerView } from "./Timer"
import { handleClientScriptLoad } from "next/script"
import { eventNames } from "process"

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
    const sample = "The quick brown fox jumps over the lazy dog."
   return(
        <IOContext.Provider value={IO}>
            <TimerView></TimerView>
            <GenerateText text={sample}/>
            <TextInput text ={sample}></TextInput>
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
    // const intervalRef = useRef(0);
    // const [keyPress, setKeyPress] = useState("");

    const inputRef = useRef<string[]>([]);
    const pressKeyRef = useRef("");
    // const handleKeyDown = (b: React.KeyboardEvent) => 
    // {
    //     console.log("THIS IS MY FUNC  " + checkKeyPress(b.key))
    //     pressKeyRef.current = b.key
    //     console.log("Key pressed: ", b.key); // Capture the key that is pressed
    //     if(b.key == "Backspace")
    //         {
    //             pressKeyRef.current = b.key
    //             console.log("TRUE")
              
    //         }
    //         else
    //         {
    //             console.log("FALSEEE")
    //         }

    // };

    // console.log("Outside the handle key down" + keyPress)

    // let textIn = 0
    // let textS = 0


    // second method
    // const [score, setScore] = useState(0);
    // const [words, setWords] = useState(0);
    // const [textLetter, setText] = useState({
    
    //   highlighted: "",
    //   default: "",
    // });

    const sample = "The quick brown fox jumps over the lazy dog."
    let count = 3


    const logic = (event:React.ChangeEvent<HTMLInputElement>) => 
      {
        //console.log(event.target.value)
        if(!io.text?.current){
            return
        }
          let colorSetter = io.text.current.get(count);
          console.log(count)
          console.log(colorSetter)
          if (colorSetter) {
            if (io.timerColor && io.timerColor.current === "red") {
                console.log("changing color to red")

              colorSetter("red");
            } else if (io.timerColor && io.timerColor.current === "green") {
                console.log("changing color to green")

              colorSetter("green");
            }
          }
      
          if (io.slider && io.slider.current) {
            const scrollPosition = 30*count;
            io.slider.current.scrollLeft = scrollPosition;
            count++;
          }
          
      };

      // seconod method
      // const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>
      //   {
      //     logic(e)
      //     let x = 0;
          
      //     if (points === 0) 
      //       {
            
      //     }
      
      //     if (sample.charAt(points) === " ")
      //     {
      //           setWords(words + 1);
      //     }
      
      //     setPoints(points + 1);
      
      //     setText({
      //       highlighted: sample.slice(0, score),
      //       default: sample.slice(score, sample.length),
      //     });

      //     setVisibleText(e.target.value)

      //   };

      //first method
      // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => 
      //   {
      //     let pointTracker = 0;
      //     let newPoints = points;
      //     let inputText = e.target.value;

      //     const inputElement = document.getElementById('inputID') as HTMLInputElement;
      //     inputElement.addEventListener("keydown", (event: KeyboardEvent) => 
      //     {
      //       const inputText = inputElement.value;
      //       const i = inputText.length - 1;
      //       for (let i = 0; i < inputText.length; i++) 
      //       {
      //         if (event.key === "Backspace") {
      //             if (sample[i] === inputText[i]) 
      //               {
      //                 event.preventDefault();
      //                 console.log("Backspace prevented - Correct character");
      //             } else 
                  
      //             {
      //                 console.log("Able to delete cause input is wrong");
      //                 break;
      //             }
      //           } else if (event.key === " ")    
      //               if (sample[i] === inputText[i]) 
      //               {
      //                 event.preventDefault();
      //                 console.log("Space prevented - Correct character");
      //               } else {
      //                 console.log("Able to input space cause input is wrong");
      //                 break;
      //             }

      //         if (inputText[i] !== sample[i]) 
      //         {
      //           pointTracker -= 100; 
      //         } else 
      //         {
      //           pointTracker += 100; 
      //         }
      //       }
        
      //       setPoints(newPoints + pointTracker);
      //       setText(e.target.value)
      //       logic(e);

      //     })
          
        
        
      // };
         // Handle key down events (e.g., detecting Backspace)

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
              setTextS((prev) => prev + 1);
              setTextIn((prev) => prev + 1);

              console.log("Sample Index:", textS + 1);
              console.log("Input Index:", textIn + 1);

              logic(e)

      };


      const handleKeyDown = (e: React.KeyboardEvent) => {
        pressKeyRef.current = e.key; // Store the key pressed in the ref
        console.log("Key pressed:", e.key);

        // Detect if the Backspace key was pressed
        if (e.key === "Backspace") 
        {
            console.log("Backspace key was pressed");
        }
        else
        {
            
        }

        
        //     // Handle the logic when Backspace is pressed (e.g., removing from input)
        //     if (inputText.length > 0) {
        //         // Update state to reflect the deletion of the last character
        //         setInputText(inputText.slice(0, -1));
        //         setTextIn((prev) => prev - 1); // Decrease the input text index
        //     }
        // }
    };

    return(
        <>
        <input onKeyDown={handleKeyDown} id = "inputID"type="text" placeholder="Enter text here" value={currentLetter}  style={{width:100,height:100, fontSize: '1rem', backgroundColor:"white"}}  onChange={(e)=>handleInputChange(e)}/>
                <p> Typing Follow {inputArr}</p>
                <p>Text Typing: {textInput}</p>
                <p>Point tracking {points}</p>

        </>
    )
}



