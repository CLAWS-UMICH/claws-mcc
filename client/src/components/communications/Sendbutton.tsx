import React from "react";
import "./ButtonRow.css";
import {
  bundleIcon,
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
      </button>{" "}
      {/* Replace SampleIcon with the correct icon */}
      <button className="row-button">
        <Location24Regular />
        Navigation
      </button>{" "}
      {/* Replace VitalIcon with the correct icon */}
      <button className="row-button">
        <GridCircles24Regular />
        Modes
      </button>{" "}
      {/* Replace ModeIcon with the correct icon */}
    </div>
  );
};

export default ButtonRow;