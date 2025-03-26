'use client'
import { Stats } from "@/components/Stats";
import styles from "./page.module.css";
import { Display } from "@/components/Display";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export type PageHandler={
    setPage?:  Dispatch<SetStateAction<string>>,
}
export const PageContext =  createContext<PageHandler>({}) 

export default function Home() {
  const [page,setPage]= useState("stats")
  const pageValue = {setPage:setPage}
  return (
    <div className={styles.page}>
      <PageContext.Provider value={pageValue}>
      <main className={styles.main}>
        {page=="stats"&&<Stats correct={20} incorrect={30} highestConsecutive={10}/>}
        {page=="game" &&<Display/> }
      </main>
      </PageContext.Provider>
    </div>
  );
}
