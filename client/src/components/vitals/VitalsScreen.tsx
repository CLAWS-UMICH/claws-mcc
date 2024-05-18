import React, { useEffect, useReducer, useState } from "react";
import Ring from "./ProgressRing.tsx";
import { Subtitle2, Card, Caption1Strong, Caption2Strong, Body1Strong, Body1 } from "@fluentui/react-components";
import { Battery0Regular, Battery1016Regular, Battery10Filled, Battery10Regular, Battery9Filled, Battery9Regular, BatteryChargeRegular, Drop12Filled, Drop16Filled, Drop16Regular, Heart12Filled, Heart16Filled, Temperature16Filled } from "@fluentui/react-icons";
import './Vitals.css'
import VitalsGauge from "./VitalsGauge.tsx";
import fanWhite from "../../assets/fanWhite.png"
import fanOutline from "../../assets/fanOutline.png"
import temperatureIcon from "../../assets/temperatureIcon.png"

const VitalsScreen: React.FC = () => {

  return (
    <div>
      <div className="root">
        <div className="resources">
            <Body1Strong>Suit Resources<sub></sub></Body1Strong>
            <div className="rings-row">
                <div className="ring">
                    <div style={{display: "flex", gap: "3.5px"}}>
                        <Battery10Regular></Battery10Regular>
                        <Caption2Strong><sub></sub>Battery</Caption2Strong>
                    </div>
                    <VitalsGauge id="battery" text="%" name={100} value={100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>O<sub>2</sub>  Pri Storage</Caption2Strong>
                    <VitalsGauge id="pri-storage" text="%" name={100} value={100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>O<sub>2</sub>  Sec Storage</Caption2Strong>
                    <VitalsGauge id="sec-storage" text="%" name={100} value={100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>O<sub>2</sub>  Pri Pressure</Caption2Strong>
                    <VitalsGauge id="pri-pressure" text="PSI" name={3000} value={3000/3000*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>O<sub>2</sub>  Sec Pressure</Caption2Strong>
                    <VitalsGauge id="sec-pressure" text="PSI" name={3000} value={3000/3000*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <div style={{display: "flex", gap: "3.5px"}}>
                        <Drop12Filled></Drop12Filled>
                        <Caption2Strong><sub></sub>Coolant</Caption2Strong>
                    </div>
                    <VitalsGauge id="coolant" text="%" name={100} value={100}></VitalsGauge>
                </div>
            </div>
        </div>
        <div className="time">
            <Body1Strong>Time Remaining<sub></sub></Body1Strong>
            <div className="time-block" style={{justifyContent: "space-around"}}>
                <div className="ring">
                    <Caption1Strong>O<sub>2</sub>  Oxygen</Caption1Strong>
                    <div className="card"><Body1Strong>1 hr 20 min</Body1Strong></div>
                </div>
                <div className="ring">
                    <div style={{display: "flex", gap: "3.5px"}}>
                        <Battery9Regular></Battery9Regular>
                        <Caption1Strong><sub></sub>Battery</Caption1Strong>
                    </div>
                    <div className="card"><Body1Strong>1 hr 20 min</Body1Strong></div>
                </div>
            </div>
        </div>
        <div className="atmosphere">
            <Body1Strong>Suit Atmosphere<sub></sub></Body1Strong>
            <div className="rings-row">
                <div className="ring">
                    <div style={{display: "flex", gap: "3.5px"}}>
                        <Heart12Filled></Heart12Filled>
                        <Caption2Strong><sub></sub>Heart Rate</Caption2Strong>
                    </div>
                    <VitalsGauge id="heart-rate" text="BPM" name={160} value={160/160*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>O<sub>2</sub>  Consumption</Caption2Strong>
                    <VitalsGauge id="oxy-consumption" text="PSI/m" name={.15} value={.15/.15*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>CO<sub>2</sub>  Production</Caption2Strong>
                    <VitalsGauge id="co2-production" text="PSI/m" name={.15} value={.15/.15*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>O<sub>2</sub>  Suit Pressure</Caption2Strong>
                    <VitalsGauge id="oxy-suit" text="PSI" name={4.1} value={4.1/4.1*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>CO<sub>2</sub>  Suit Pressure</Caption2Strong>
                    <VitalsGauge id="co2-suit" text="PSI" name={0.1} value={0.1/0.1*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong><sub></sub>Other Suit Pressure</Caption2Strong>
                    <VitalsGauge id="other-suit" text="PSI" name={0.5} value={0.5/0.5*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong><sub></sub>Suit Total Pressure</Caption2Strong>
                    <VitalsGauge id="total-suit" text="PSI" name={4.5} value={4.5/4.5*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong>Helmet CO<sub>2</sub> Pressure</Caption2Strong>
                    <VitalsGauge id="helmet-co2" text="PSI" name={0.1} value={0.1/0.1*100}></VitalsGauge>
                </div>
            </div>
        </div>
        <div className="temperature">
            <Body1Strong>Suit Temperature<sub></sub></Body1Strong>
            <div className="rings-row">
                <div className="ring">
                    <div style={{display: "flex", gap: "3px"}}>
                        <img src={temperatureIcon} height={14} width={14}></img>
                        <Caption2Strong><sub></sub>Temp</Caption2Strong>
                    </div>
                    <VitalsGauge id="temp" text="˚F" name={90} value={90/90*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong><sub></sub>Coolant Liquid Pressure</Caption2Strong>
                    <VitalsGauge id="coolant-liquid" text="PSI" name={700} value={700/700*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong><sub></sub>Coolant Gas Pressure</Caption2Strong>
                    <VitalsGauge id="coolant-gas" text="PSI" name={700} value={700/700*100}></VitalsGauge>
                </div>
            </div>
        </div>
        <div className="helmetFan">
            <Body1Strong>Suit Helmet Fan<sub></sub></Body1Strong>
            <div className="rings-row">
                <div className="ring">
                    <div style={{display: "flex", gap: "3.5px"}}>
                        <img src={fanWhite} height={12} width={12}></img>
                        <Caption2Strong><sub></sub>Fan Pri</Caption2Strong>
                    </div>
                    <VitalsGauge id="fan-pri" text="RPM" name={30000} value={30000/30000*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <div style={{display: "flex", gap: "3.5px"}}>
                        <img src={fanOutline} height={12} width={12}></img>
                        <Caption2Strong><sub></sub>Fan Sec</Caption2Strong>
                    </div>
                    <VitalsGauge id="fan-sec" text="RPM" name={30000} value={30000/30000*100}></VitalsGauge>
                </div>
            </div>
        </div>
        <div className="co2Scrubbers">
          <Body1Strong>Suit CO<sub>2</sub> Scrubbers</Body1Strong>
            <div className="rings-row">
                <div className="ring">
                    <Caption2Strong><sub></sub>Scrubber A</Caption2Strong>
                    <VitalsGauge id="scrubber-a" text="%" name={700} value={700/700*100}></VitalsGauge>
                </div>
                <div className="ring">
                    <Caption2Strong><sub></sub>Scrubber B</Caption2Strong>
                    <VitalsGauge id="scrubber-b" text="%" name={700} value={700/700*100}></VitalsGauge>
                </div>
            </div>
        </div>
        <div className="dcu">
          <Body1Strong>Display & Control Unit<sub></sub></Body1Strong>
            <div className="dcu-row">
                <div style={{display: "flex", flexDirection: "column", justifyItems: "space-evenly", gap: "30px"}}>
                    <div className="ring">
                        <Caption1Strong>Fan<sub></sub></Caption1Strong>
                        <div className="switch"><Body1Strong>SEC</Body1Strong></div>
                    </div>
                    <div className="ring">
                        <Caption1Strong>Battery<sub></sub></Caption1Strong>
                        <div className="switch"><Body1Strong>LOCAL</Body1Strong></div>
                    </div>
                    <div className="ring">
                        <Caption1Strong>Comms<sub></sub></Caption1Strong>
                        <div className="switch"><Body1Strong>A</Body1Strong></div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyItems: "space-around", gap: "30px"}}>
                    <div className="ring">
                        <Caption1Strong>Oxygen<sub></sub></Caption1Strong>
                        <div className="switch"><Body1Strong>SEC</Body1Strong></div>
                    </div>
                    <div className="ring">
                        <Caption1Strong>CO<sub>2</sub></Caption1Strong>
                        <div className="switch"><Body1Strong>A</Body1Strong></div>
                    </div>
                    <div className="ring">
                        <Caption1Strong>Pump<sub></sub></Caption1Strong>
                        <div className="switch"><Body1Strong>OPEN</Body1Strong></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default VitalsScreen;