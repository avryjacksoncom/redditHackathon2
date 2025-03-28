'use client'
import { Stats } from "@/components/Stats";
import styles from "./page.module.css";
import { Display } from "@/components/Display";
import { createContext, Dispatch, SetStateAction, useState } from "react";


export type StatsType ={
  correct: number;
  incorrect: number;
  highestConsecutive: number;
  text:string,
  currentConsecutive:number
  points:number
}

export type PageHandler={
    setPage?:  Dispatch<SetStateAction<string>>,
    stats?:StatsType,
    setStats?: Dispatch<SetStateAction<StatsType>>
}


export const PageContext =  createContext<PageHandler>({}) 

export default function Home() {
  const [page,setPage]= useState("game")
  const [stats,setStats] = useState<StatsType>({correct:0,incorrect:0,highestConsecutive:0,currentConsecutive:0,points:0,text:""})
  const pageValue = {setPage:setPage,stats:stats,setStats:setStats }
  return (
    <div >
      <PageContext.Provider value={pageValue}>
      <main >
        {page=="stats"&&<Stats {...stats}/>}
        {page=="game" &&<Display/> }
      </main>
      </PageContext.Provider>
    </div>
  );
}
