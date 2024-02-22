import React from "react";
import "./SendButtons.css";
import {
  ClipboardTaskListLtr24Regular,
  BookPulse24Regular,
  Hexagon24Regular,
  Chat24Regular,
  Location24Regular,
  GridCircles24Regular,
} from "@fluentui/react-icons";

const ButtonRow = ({ onButtonClick }) => {
  return (
    <div className="button-row">
      <button className="row-button">
        <ClipboardTaskListLtr24Regular />
        Tasks
      </button>
      <button className="row-button" onClick={() => onButtonClick('Tasks')}>
        <BookPulse24Regular />
        Vitals
      </button>
      <button className="row-button" onClick={() => onButtonClick('Vitals')}>
        <Hexagon24Regular />
        Samples
      </button>
      <button className="row-button" onClick={() => onButtonClick('Messages')}>
        <Chat24Regular />
        Messages
      </button>
      <button className="row-button" onClick={() => onButtonClick('Navigation')}>
        <Location24Regular />
        Navigation
      </button>
      <button className="row-button" onClick={() => onButtonClick('Modes')}>
        <GridCircles24Regular />
        Modes
      </button>
    </div>
  );
};

export default ButtonRow;