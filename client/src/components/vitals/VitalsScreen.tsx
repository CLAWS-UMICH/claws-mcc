import React, { useEffect, useReducer, useState } from "react";
import Ring from "./ProgressRing.tsx";
import { Subtitle2, Card, Caption1Strong, Caption2Strong, Body1Strong, Body1 } from "@fluentui/react-components";
import { Battery10Regular, Battery9Filled, Battery9Regular, BatteryChargeRegular, Drop12Filled, Drop16Filled, Drop16Regular, Heart12Filled, Heart16Filled, Temperature16Filled, VoteRegular } from "@fluentui/react-icons";
import './Vitals.css'
import VitalsGauge from "./VitalsGauge.tsx";
import fanWhite from "../../assets/fanWhite.png"
import fanOutline from "../../assets/fanOutline.png"
import temperatureIcon from "../../assets/temperatureIcon.png"
import { VitalsData } from "./VitalsTypes.tsx";

interface VitalsScreenProps {
    vitals: VitalsData
}

const VitalsScreen: React.FC<VitalsScreenProps> = ({vitals}) => {
    const secondsToHours = (seconds: number) => {
        if (!seconds) {
            return "N/A";
        }

        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        let timeString = (hours > 0) ? (hours.toString() + " hr ") : "";
        timeString += (minutes > 0) ? (minutes.toString() + " min") : "";

        return timeString || "0 min";
    }
    
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
                        <VitalsGauge id="battery" text="min" name={vitals.battery_time_left/60} value={vitals.battery_time_left/10800*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>O<sub>2</sub>  Pri Storage</Caption2Strong>
                        <VitalsGauge id="pri-storage" text="%" name={vitals.primary_oxygen_storage} value={vitals.primary_oxygen_storage}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>O<sub>2</sub>  Sec Storage</Caption2Strong>
                        <VitalsGauge id="sec-storage" text="%" name={vitals.secondary_oxygen_storage} value={vitals.secondary_oxygen_storage}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>O<sub>2</sub>  Pri Pressure</Caption2Strong>
                        <VitalsGauge id="pri-pressure" text="PSI" name={vitals.primary_oxygen_pressure} value={vitals.primary_oxygen_pressure/3000*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>O<sub>2</sub>  Sec Pressure</Caption2Strong>
                        <VitalsGauge id="sec-pressure" text="PSI" name={vitals.secondary_oxygen_pressure} value={vitals.secondary_oxygen_pressure/3000*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <Drop12Filled></Drop12Filled>
                            <Caption2Strong><sub></sub>Coolant</Caption2Strong>
                        </div>
                        {/* TODO: figure out what to do with coolant shit */}
                        <VitalsGauge id="coolant" text="%" name={vitals.coolant_ml} value={vitals.coolant_ml}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="time">
                <Body1Strong>Time Remaining<sub></sub></Body1Strong>
                <div className="time-block" style={{justifyContent: "space-around"}}>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Oxygen</Caption1Strong>
                        <div className="card"><Body1Strong>{secondsToHours(vitals.oxygen_time_left)}</Body1Strong></div>
                    </div>
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <Battery9Regular></Battery9Regular>
                            <Caption1Strong><sub></sub>Battery</Caption1Strong>
                        </div>
                        <div className="card"><Body1Strong>{secondsToHours(vitals.battery_time_left)}</Body1Strong></div>
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
                        <VitalsGauge id="heart-rate" text="BPM" name={vitals.heart_rate} value={vitals.heart_rate/160*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>O<sub>2</sub>  Consumption</Caption2Strong>
                        <VitalsGauge id="oxy-consumption" text="PSI/m" name={vitals.oxygen_consumption} value={vitals.oxygen_consumption/.15*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>CO<sub>2</sub>  Production</Caption2Strong>
                        <VitalsGauge id="co2-production" text="PSI/m" name={vitals.co2_production} value={vitals.co2_production/.15*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>O<sub>2</sub>  Suit Pressure</Caption2Strong>
                        <VitalsGauge id="oxy-suit" text="PSI" name={vitals.suit_oxygen_pressure} value={vitals.suit_oxygen_pressure/4.1*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>CO<sub>2</sub>  Suit Pressure</Caption2Strong>
                        <VitalsGauge id="co2-suit" text="PSI" name={vitals.suit_cO2_pressure} value={vitals.suit_cO2_pressure/0.1*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong><sub></sub>Other Suit Pressure</Caption2Strong>
                        <VitalsGauge id="other-suit" text="PSI" name={vitals.suit_other_pressure} value={vitals.suit_other_pressure/0.5*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong><sub></sub>Suit Total Pressure</Caption2Strong>
                        <VitalsGauge id="total-suit" text="PSI" name={vitals.suit_total_pressure} value={vitals.suit_total_pressure/4.5*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong>Helmet CO<sub>2</sub> Pressure</Caption2Strong>
                        <VitalsGauge id="helmet-co2" text="PSI" name={vitals.helmet_co2_pressure} value={vitals.helmet_co2_pressure/0.1*100}></VitalsGauge>
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
                        <VitalsGauge id="temp" text="˚F" name={vitals.temperature} value={vitals.temperature/90*100}></VitalsGauge>
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
                        <VitalsGauge id="fan-pri" text="RPM" name={vitals.primary_fan_rpm} value={vitals.primary_fan_rpm/30000*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <img src={fanOutline} height={12} width={12}></img>
                            <Caption2Strong><sub></sub>Fan Sec</Caption2Strong>
                        </div>
                        <VitalsGauge id="fan-sec" text="RPM" name={vitals.secondary_fan_rpm} value={vitals.secondary_fan_rpm/30000*100}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="co2Scrubbers">
            <Body1Strong>Suit CO<sub>2</sub> Scrubbers</Body1Strong>
                <div className="rings-row">
                    <div className="ring">
                        <Caption2Strong><sub></sub>Scrubber A</Caption2Strong>
                        <VitalsGauge id="scrubber-a" text="%" name={vitals.scrubber_a_co2_capacity} value={vitals.scrubber_a_co2_capacity/700*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption2Strong><sub></sub>Scrubber B</Caption2Strong>
                        <VitalsGauge id="scrubber-b" text="%" name={vitals.scrubber_b_co2_capacity} value={vitals.scrubber_b_co2_capacity/700*100}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="dcu">
            <Body1Strong>Display & Control Unit<sub></sub></Body1Strong>
                <div className="dcu-row">
                    <div style={{display: "flex", flexDirection: "column", justifyItems: "space-evenly", gap: "30px"}}>
                        <div className="ring">
                            <Caption1Strong>Fan<sub></sub></Caption1Strong>
                            <div className="switch"><Body1Strong>{vitals.dcu?.fan ? "PRI" : "SEC"}</Body1Strong></div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>Battery<sub></sub></Caption1Strong>
                            <div className="switch"><Body1Strong>{vitals.dcu?.batt ? "LOCAL" : "BACKUP"}</Body1Strong></div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>Comms<sub></sub></Caption1Strong>
                            <div className="switch"><Body1Strong>{vitals.dcu?.comm ? "A" : "B"}</Body1Strong></div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyItems: "space-around", gap: "30px"}}>
                        <div className="ring">
                            <Caption1Strong>Oxygen<sub></sub></Caption1Strong>
                            <div className="switch"><Body1Strong>{vitals.dcu?.oxy ? "PRI" : "SEC"}</Body1Strong></div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>CO<sub>2</sub></Caption1Strong>
                            <div className="switch"><Body1Strong>{vitals.dcu?.co2 ? "A": "B"}</Body1Strong></div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>Pump<sub></sub></Caption1Strong>
                            <div className="switch"><Body1Strong>{vitals.dcu?.pump ? "OPEN" : "CLOSED"}</Body1Strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default VitalsScreen;