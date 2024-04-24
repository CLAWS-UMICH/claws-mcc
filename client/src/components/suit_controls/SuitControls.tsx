import React, { useEffect, useReducer, useState } from "react";
import Ring from "./ProgressRing.tsx";

function SuitControls() {
  return (
    <div style={{ display: "grid",columnGap:'2rem', rowGap: "2rem",padding:'2rem'}}>
        <div className='row' style={{ display: "inline-flex", justifyContent:'flex-start', alignContent:'space-around'}}>
      <div style={{ background: 'rgba(255, 255, 255, 0.10', border: "1px solid grey", display: "inline-flex" }}>
        <Ring id="resources-1" percentage="20" text="%" ></Ring>
        <Ring id="resources-2" percentage="30" text="PSI" ></Ring>
        <Ring id="resources-3" percentage="40" text="%" ></Ring>
        <Ring id="resources-4" percentage="50" text="%" ></Ring>
        <Ring id="resources-5" percentage="60" text="%" ></Ring>
        <Ring id="resources-6" percentage="70" text="%" ></Ring>
      </div>
      <div style={{ background: 'rgba(255, 255, 255, 0.10', border: "1px solid grey", display: "inline-flex" }}>
        <Ring id="resources-1" percentage="20" text=" " ></Ring>
        {/* <Ring id="resources-2" percentage="30" text="PSI" ></Ring> */}
      </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.10',border: "1px solid grey", display: "inline-flex" }}>
        <Ring id="atmosphere-1" percentage="20" text="%" ></Ring>
        <Ring id="atmosphere-2" percentage="30" text="%" ></Ring>
        <Ring id="atmosphere-3" percentage="40" text="%" ></Ring>
        <Ring id="atmosphere-4" percentage="50" text="%" ></Ring>
        <Ring id="atmosphere-5" percentage="60" text="%" ></Ring>
        <Ring id="atmosphere-6" percentage="70" text="%" ></Ring>
        <Ring id="atmosphere-7" percentage="70" text="%" ></Ring>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.10',border: "1px solid grey", display: "inline-flex" }}>
        <Ring id="temperature-1" percentage="20" text="%" ></Ring>
        <Ring id="temperature-2" percentage="30" text="%" ></Ring>
        <Ring id="temperature-3" percentage="40" text="%" ></Ring>
      </div>

      <div className='row' style={{ display: "inline-flex", justifyContent: 'space-around', alignContent:'flex-start'}}>
        <div style={{ background: 'rgba(255, 255, 255, 0.10',border: "1px solid grey", display: "inline-flex" }}>
          <Ring id="helmet_fan-1" percentage="20" text="%" ></Ring>
          <Ring id="helmet_fan-2" percentage="30" text="%" ></Ring>
        </div>
        <div style={{background: 'rgba(255, 255, 255, 0.10', border: "1px solid grey", display: "inline-flex" }}>
          <Ring id="scrubbers-1" percentage="20" text="%" ></Ring>
          <Ring id="scrubbers-2" percentage="30" text="%" ></Ring>
        </div>
      </div>
    </div>
  );
}
export default SuitControls;
