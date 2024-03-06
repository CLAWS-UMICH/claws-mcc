import React, { useState } from 'react';
import { CardSelectable } from "../Card/Card.tsx";

const CustomComponent = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [combinedPosition, setCombinedPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isCombined, setIsCombined] = useState(false);
  const [selectedAstronaut, setSelectedAstronaut] = useState("")

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default right-click behavior
    setPosition({ x: e.clientX, y: e.clientY });
    if(!isCombined && isVisible) {
      setCombinedPosition({ x: e.clientX, y: e.clientY });
    } // FIXME doesn't have intended effect of making "Sent to" appear where Astronaut 1 was 
    if (isVisible) {
        setIsCombined(true);
        setTimeout(() => {
          setIsCombined(false); // Reset isCombined after 2 seconds
          setIsVisible(false);
        }, 2000);
    }
    else{
        setIsVisible(!isVisible); // Toggle visibility
        setIsCombined(false);
    }
  };

  const handleClick = (e) => {
    if (e.button === 0) { // Left mouse button
        if(isVisible){
          setPosition({ x: e.clientX, y: e.clientY });
          if(!isCombined && isVisible) {
            setCombinedPosition({ x: e.clientX, y: e.clientY });
          } // FIXME
          if (isVisible) {
              setIsCombined(true);
              setTimeout(() => {
                setIsCombined(false); // Reset isCombined after 2 seconds
                setIsVisible(false);
              }, 2000);
          }
          else{
              setIsVisible(!isVisible); // Toggle visibility
              setIsCombined(false);
          }
        }
    }
  };


  const handleOutsideClick = () => {
    setIsVisible(false);
    setIsCombined(false);
  };

  console.log("isCombined", isCombined)
  console.log("isVisible", isVisible)

  return (
    <div>
      {!isCombined && isVisible && (
        <div>
          <div
            onMouseEnter={() => setSelectedAstronaut("Astronaut 1")}
            onMouseLeave={() => setSelectedAstronaut("")}
            onClick={handleClick}
            style={{
              position: 'fixed',
          top: position.y,
          left: position.x,
          padding: '20px',
          zIndex: 9999,
              width: "150px",
              background: selectedAstronaut === "Astronaut 1" ? "blue" : "white",
              color: selectedAstronaut === "Astronaut 1" ? "white" : "black",
              border: "1px solid black",
              textAlign: "center",
              lineHeight: "50px",
              cursor: "pointer",
            }}
          >
            Astronaut 1
          </div>
          <div
            onMouseEnter={() => setSelectedAstronaut("Astronaut 2")}
            onMouseLeave={() => setSelectedAstronaut("")}
            onClick={handleClick}
            style={{
              position: 'fixed',
          top: position.y+90,
          left: position.x,
          padding: '20px',
          zIndex: 9999,
              width: "150px",
              background: selectedAstronaut === "Astronaut 2" ? "blue" : "white",
              color: selectedAstronaut === "Astronaut 2" ? "white" : "black",
              border: "1px solid black",
              textAlign: "center",
              lineHeight: "50px",
              cursor: "pointer",
            }}
          >
            Astronaut 2
          </div>
        </div>
      )}
      {isCombined && isVisible && (
        <div
        style={{
          position: 'fixed',
          top: combinedPosition.y,
          left: combinedPosition.x,
          background: 'white',
          border: '1px solid black',
          padding: '20px',
          zIndex: 9999,
        // width: "150px",
        // height: "30px",
          color: 'black',
          textAlign: "center",
          lineHeight: "50px",
        }}
        onClick={handleOutsideClick}
      >
          Sent to {selectedAstronaut}
        </div>
      )}
      <div
        onContextMenu={handleContextMenu}
        onMouseDown={handleClick}
        style={{ height: '100vh', width: '100%'}}
      >
      <CardSelectable></CardSelectable>
    
      </div>
    </div>
  );
};

// TODO fix style and find exact number for position.y + __
// TODO detect what image clicking on, and make a visual indicator of selection appear on the image card (ie graying out)

export default CustomComponent;