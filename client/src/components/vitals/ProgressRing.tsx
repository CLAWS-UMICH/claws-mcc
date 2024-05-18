import { log } from "console";
import React, { useEffect, useReducer, useState } from "react";

function ProgressRingComponent({ id, percentage, text }) {
  console.log("I'm being called");

  const [endDegree, setEndDegree] = useState(0);

  useEffect(() => {
    // const progress = document.getElementById('progress');
    // const background = document.getElementById('background');
    // const bbox = document.getElementById('box');

    const progress = document.getElementById(`progress-${id}`);
    const background = document.getElementById(`background-${id}`);
    const bbox = document.getElementById(`box-${id}`);

    if (bbox) {
      var box = bbox.getBoundingClientRect();
      if (progress) {
        const newEndDegree = (percentage / 100) * (360 + 80);
        setEndDegree(newEndDegree);
        progress.setAttribute(
          "d",
          describeArc(
            box.width / 2,
            box.height / 2,
            box.height / 4,
            80,
            newEndDegree
          )
        );
      }
      if (background) {
        console.log(box);
        background.setAttribute(
          "d",
          describeArc(box.width / 2, box.height / 2, box.height / 4, 80, 359)
        );
      }
    }
  }, []);

  function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    console.log(start, end);
    var d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");

    return d;
  }
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }
  return (
    <div
      id={`box-${id}`}
      style={{ display: "flex", width: "8rem", height: "8rem" }}
    >
      <svg
        style={{
          display: "flex",
          transform: "rotate(140deg)",
          width: "8rem",
          height: "8rem",
        }}
      >
        <path
          id={`background-${id}`}
          fill="none"
          stroke="grey"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          id={`progress-${id}`}
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <p style={{ position: "relative", left:'-54.5%', top:'55%'}}>
        {text}
      </p>
    </div>

    // <div  id="box">
    // <svg  style={{ zIndex:500, border:'1px solid blue',display:'flex',transform:'rotate(0deg)',width: '200px', height: '200px' }}>
    //     <path id="background" fill="none" stroke="grey" strokeWidth="20" />
    //     <path id="progress" fill="none" stroke="#446688" strokeWidth="20" />
    //   </svg>
    // </div>
  );
}

export default ProgressRingComponent;
