import React from 'react';

interface ButtonProps {
  label: string;           // Text to display inside the button
  onClick: () => void;     // Click event handler
  backgroundColor?: string; // Optional background color
  color?: string;           // Optional text color
  fontSize?: string;        // Optional font size
  fontWeight?:number;
  width?: string;           // Optional width
}

export function Button({ 
    label, 
    onClick, 
    backgroundColor = '#007BFF', // Default background color
    color = '#fff',               // Default text color
    fontSize = '16px',            // Default font size
    width = 'auto',                // Default width.
    fontWeight = 300
  }:ButtonProps) {
    const buttonStyle: React.CSSProperties = {
      backgroundColor,
      color,
      fontSize,
      width,
      height:40,
      fontWeight,
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    };
    return(
        <button style={buttonStyle} onClick={onClick}>
        {label}
        </button>
    )
}