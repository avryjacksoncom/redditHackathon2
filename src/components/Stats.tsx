"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import { defaultBrightColor, defaultDarkColor, defaultFontSize, incorrectColor, yellowColor, correctColor } from "@/styles";
import {  PageContext } from "@/app/page";
import { StopLight } from "./Stoplight";
import { StatsType } from "@/app/page";

// Define the interface for the props

// Stats component that accepts props
export function Stats({ correct, incorrect, highestConsecutive,text, points }: StatsType) {
  const statsContainerStyle: React.CSSProperties = {
    backgroundColor: "#33AAAA",
    padding: "18px",
    width: "60vw",
    maxWidth: "800px", // Set maximum width to 800px (or any desired value)
    minWidth: "200px",
    margin: "10px auto",
    textAlign: "center",
    borderRadius: 10,
  };

  const statsItemStyle: React.CSSProperties = {
    paddingLeft: "8px",
    paddingRight: "8px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    marginBottom: "10px",
  };
  const [modal,setModal]=useState(false)
  const page = useContext(PageContext);
  function totalScore(){
    if(correct===0){
        return incorrect*-1
    }
    return Math.floor(points*(1-(incorrect/(correct+highestConsecutive))))
  }
  return (
    <div style={{alignContent:'center',justifyContent:'center',alignItems: 'center',width:"100%",display: "flex", padding:"10%"}}>
        <div style={{width:"10%"}}>
            <StopLight></StopLight>
        </div>
        
        <div style={statsContainerStyle}>
        <h2
            style={{ color: defaultBrightColor.color, textDecoration: "underline" }}
        >
            Results
        </h2>
        <div
            style={{
            borderStyle: "solid",
            margin: 20,
            borderWidth: 0,
            borderColor: defaultDarkColor.color,
            borderRadius: 10,
            }}
        >
            <div style={statsItemStyle}>
            <span style={{ ...defaultBrightColor, ...defaultFontSize }}>
                Errors{" "}
            </span>
            <span style={{ ...incorrectColor, ...defaultFontSize }}>
                {incorrect}
            </span>
            </div>
            <div style={statsItemStyle}>
            <span style={{ ...defaultBrightColor, ...defaultFontSize }}>
                Best Streak
            </span>
            <span style={{ ...yellowColor, ...defaultFontSize }}>
                {highestConsecutive}
            </span>
            </div>
            <div style={statsItemStyle}>
            <span style={{ ...defaultBrightColor, ...defaultFontSize }}>
                Correct{" "}
            </span>
            <span style={{ ...correctColor, ...defaultFontSize }}>{correct}</span>
            </div>
            <div style={statsItemStyle}>
            <span style={{ ...defaultBrightColor, ...defaultFontSize }}>
                Points{" "}
            </span>
            <span style={{ ...correctColor, ...defaultFontSize }}>{points}</span>
            </div>
            <div style={statsItemStyle}>
            <span style={{ ...defaultBrightColor, ...defaultFontSize }}>
                Output Text{" "}
            </span>
            <Button
                onClick={() => setModal(true)}
                color={defaultDarkColor.color}
                backgroundColor={yellowColor.color}
                fontWeight={600}
                label="->"
            />
            </div>
            <div
            style={{
                ...statsItemStyle,
                borderBottom: "",
                borderStyle: "solid",
                marginTop: 40,
                borderWidth: 2,
            }}
            >
            <span style={{ ...defaultBrightColor, ...defaultFontSize }}>
                Overall Score{" "}
            </span>
            <span style={{ ...defaultFontSize, color:(totalScore())<0?incorrectColor.color:correctColor.color }}>{totalScore()}</span>
            </div>
        </div>
        <div style={{ ...statsItemStyle, marginTop: 40, borderBottom: "" }}>
        <Button
            onClick={() => {
                if(page && page.setPage && page.setStats && page.stats){
                    page.setStats({correct:0,incorrect:0,highestConsecutive:0,text:"",currentConsecutive:0,points:0,startingIndex:0,currentIndex:0,multiplier:1})
                    page?.setPage && page.setPage("game")
                }

            }}
            color={defaultBrightColor.color}
            backgroundColor={correctColor.color}
            fontWeight={600}
            label="New Game"
            />
            <Button
            onClick={() => {
                if(page && page.setPage && page.setStats && page.stats){
                    let newStartingIndex = page.stats.currentIndex+page.stats.startingIndex
                    page.setStats({correct:0,incorrect:0,highestConsecutive:0,text:"",currentConsecutive:0,points:0,startingIndex:newStartingIndex,currentIndex:0, multiplier:page.stats.multiplier})
                    page?.setPage && page.setPage("game")
                }

            }}
            color={defaultBrightColor.color}
            backgroundColor={correctColor.color}
            fontWeight={600}
            label="Continue"
            />
            <Button
            onClick={() => {}}
            color={defaultDarkColor.color}
            backgroundColor={yellowColor.color}
            fontWeight={600}
            label="Return"
            />
        </div>
        <Modal
            isOpen={modal}
            onClose={()=>{
                setModal(false)
            }}
        >
            <h2 style={{color:defaultDarkColor.color}}>Your output</h2>
            <p style={{color:defaultDarkColor.color}}>{text}</p>
        </Modal>
        </div>
        <div style={{width:"10%"}}>
            <StopLight></StopLight>
        </div>
    </div>
  );
}
