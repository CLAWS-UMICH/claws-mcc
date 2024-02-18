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

const ButtonRow = () => {
  return (
    <div className="button-row">
      <button className="row-button">
        <ClipboardTaskListLtr24Regular />
        Tasks
      </button>
      <button className="row-button">
        <BookPulse24Regular />
        Vitals
      </button>
      <button className="row-button">
        <Hexagon24Regular />
        Samples
      </button>
      <button className="row-button">
        <Chat24Regular />
        Messages
      </button>
      <button className="row-button">
        <Location24Regular />
        Navigation
      </button>
      <button className="row-button">
        <GridCircles24Regular />
        Modes
      </button>
    </div>
  );
};

export default ButtonRow;