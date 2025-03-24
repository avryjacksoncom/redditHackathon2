'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerView } from "./Timer"

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
    let inputArr: string[] = [];

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
      
      const handleInputChange = (e: any) => 
        {
          let pointTracker = 0;
          let newPoints = points;
          let inputText = e.target.value;
          let i = 0
          let s = 0

          console.log(e.target.value)
          setText(e.target.value)
          const key = e.target.value;

          if (key.length === 1) 
          {
            inputArr.push(key); // Append the letter to the array
            console.log(inputArr); // Output the array after each key press
          }
        
            setText(e.target.value)
            
            //   // let inputTexted = inputElement.value;

            //   if (key.length === 1) 
            //     {
            //     inputArr.push(key); // Append the letter to the array
            //     console.log(inputArr); // Output the array after each key press
            //   }
            //   inputArr.push(inputText)
            //   console.log(inputArr)
            //   const lengthOfSenetence = inputText.length - 1

            //   if (event.key === "Backspace" && sample) {
            //     if (sample[i] === inputArr[i]) 
            //       {
            //         event.preventDefault();
            //         console.log("Backspace prevented - Correct character");
            //     } else 
            //     { 
            //           i -= 1
            //           s -= 1
            //         console.log("Able to delete cause input is wrong");
            //     }
                    
            //   }else if (event.key === " ")
            //     {
            //         if (sample[i] === inputArr[i]) 
            //         {
            //           event.preventDefault();
            //           console.log("Space prevented - Correct character");
                      
            //         } else 
            //         {
            //           i -= 1
            //           s -= 1
            //             console.log("Able to input space cause input is wrong");
            //         }
            //   }

            //   if (inputArr[i] !== sample[i]) 
            //   {
            //     pointTracker -= 100; 
            //   } else 
            //   {
            //     pointTracker += 100; 
            //   }
            
        
            // setPoints(newPoints + pointTracker);
            // setText(e.target.value)
            // logic(e);
    
        
      };
      
    
    return(
        <>
        <input id = "inputID"type="text" placeholder="Enter text here" value={currentLetter}  style={{width:100,height:100, fontSize: '1rem', backgroundColor:"white"}}  onChange={(e)=>handleInputChange(e)}/>
                <p> Typing Follow {inputArr}</p>
                <p>Text Typing: {textInput}</p>
                <p>Point tracking {points}</p>

        </>
    )
}


