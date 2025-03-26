"use client";
import React, { useContext, useState } from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import { defaultBrightColor, defaultDarkColor, defaultFontSize, incorrectColor, yellowColor, correctColor } from "@/styles";
import { PageContext } from "@/app/page";
// Define the interface for the props
interface StatsProps {
  correct: number;
  incorrect: number;
  highestConsecutive: number;
}

// Stats component that accepts props
export function Stats({ correct, incorrect, highestConsecutive }: StatsProps) {
  const statsContainerStyle: React.CSSProperties = {
    backgroundColor: "#33AAAA",
    padding: "30px",
    width: "60vw",
    maxWidth: "800px", // Set maximum width to 800px (or any desired value)
    minWidth: "300px",
    margin: "10px auto",
    textAlign: "center",
    borderRadius: 10,
  };

  const statsItemStyle: React.CSSProperties = {
    paddingLeft: "10px",
    paddingRight: "10px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    marginBottom: "10px",
  };
  const [modal,setModal]=useState(false)
  const page = useContext(PageContext);

  return (
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
            Incorrect{" "}
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
            Total Score{" "}
          </span>
          <span style={{ ...correctColor, ...defaultFontSize }}>{correct}</span>
        </div>
      </div>
      <div style={{ ...statsItemStyle, marginTop: 40, borderBottom: "" }}>
        <Button
          onClick={() => {page?.setPage && page.setPage("game")}}
          color={defaultBrightColor.color}
          backgroundColor={correctColor.color}
          fontWeight={600}
          label="Play Again"
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
        <p style={{color:defaultDarkColor.color}}>nhjk</p>
      </Modal>
    </div>
  );
}
