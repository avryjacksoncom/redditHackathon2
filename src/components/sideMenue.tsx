import { PageContext } from '@/app/page';
import React, { useState, useEffect, useContext } from 'react';

interface GameMenuProps {
  multiplier: number;
  totalPoints: number;
}

const GameMenu: React.FC<GameMenuProps> = ({ multiplier, totalPoints }) => {
  const [timeLeft, setTimeLeft] = useState(9);
    const page = useContext(PageContext);
  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if(timeLeft===0){
        if(page.setPage){
            page.setPage("stats")
        }
    }
  }, [timeLeft]);

  // Inline styles
  const menuStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: "#778888",
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    fontFamily: "'Arial', sans-serif",
    fontSize: '16px',
  };

  const itemStyles: React.CSSProperties = {
    marginBottom: '12px',
  };

  const labelStyles: React.CSSProperties = {
    color: 'white',
    fontSize: '12px',
    opacity: 0.7,
  };

  const multiplierStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ffcc00', // Gold color to emphasize multiplier
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
  };

  const totalPointsStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#ff6666', // Red color for total points
  };

  const timeLeftStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#66ff66', // Green color for timer
  };

  return (
    <div style={menuStyles}>
      <div style={itemStyles}>
        <div style={labelStyles}>Multiplier:</div>
        <div style={multiplierStyles}>{page.stats!=undefined?Math.floor(page.stats.currentConsecutive/5)+1:1}x</div>
      </div>
      <div style={itemStyles}>
        <div style={labelStyles}>Points:</div>
        <div style={totalPointsStyles}>{page.stats?.points}</div>
      </div>
      <div style={itemStyles}>
        <div style={labelStyles}>Time Left:</div>
        <div style={timeLeftStyles}>{timeLeft}s</div>
      </div>
    </div>
  );
};

export default GameMenu;
