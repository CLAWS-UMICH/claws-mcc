import React, { useRef } from "react";
import "./ButtonRow.css";
import {
  ClipboardTaskListLtr24Regular,
  BookPulse24Regular,
  Hexagon24Regular,
  Chat24Regular,
  Location24Regular,
  GridCircles24Regular,
} from "@fluentui/react-icons";

const ButtonRow = ({ onButtonClick }) => {
  const refs = {
    tasks: useRef(null),
    vitals: useRef(null),
    samples: useRef(null),
    messages: useRef(null),
    navigation: useRef(null),
    modes: useRef(null),
  };

  return (
    <div className="button-row">
      <button className="row-button" ref={refs.tasks} onClick={() => onButtonClick('Tasks', refs.tasks)}>
        <ClipboardTaskListLtr24Regular />
        Tasks
      </button>
      <button className="row-button" ref={refs.vitals} onClick={() => onButtonClick('Vitals', refs.vitals)}>
        <BookPulse24Regular />
        Vitals
      </button>
      <button className="row-button" ref={refs.samples} onClick={() => onButtonClick('Messages', refs.samples)}>
        <Hexagon24Regular />
        Samples
      </button>
      <button className="row-button" ref={refs.messages} onClick={() => onButtonClick('Navigation', refs.messages)}>
        <Chat24Regular />
        Messages
      </button>
      <button className="row-button" ref={refs.navigation} onClick={() => onButtonClick('Navigation',refs.navigation)}>
        <Location24Regular />
        Navigation
      </button>
      <button className="row-button" ref={refs.modes} onClick={() => onButtonClick('Modes', refs.modes)}>
        <GridCircles24Regular />
        Modes
      </button>
    </div>
  );
};

export default ButtonRow;