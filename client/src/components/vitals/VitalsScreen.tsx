import React, { useEffect, useReducer, useState } from "react";
import Ring from "./ProgressRing.tsx";
import { Subtitle2, Card, Caption1Strong, Body1Strong, Body1 } from "@fluentui/react-components";
import { Battery0Regular, Battery1016Regular, Battery10Filled, Battery10Regular, Battery9Filled, Battery9Regular, BatteryChargeRegular, Drop12Filled, Drop16Filled, Drop16Regular, Heart12Filled, Heart16Filled, Temperature16Filled, VoteRegular } from "@fluentui/react-icons";
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
        var hours = seconds / 3600;
        var minutes = Math.trunc(hours) * 60;
        var timeString = (hours < 1) ? ("") : (hours.toString() + " hr ") 
        timeString += (minutes.toString() + " min") 
        return timeString;
    }

    console.log({vitals})

    return (
        <div>
        <div className="root">
            <div className="resources">
                <Body1Strong>Suit Resources<sub></sub></Body1Strong>
                <div className="rings-row">
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <Battery10Regular></Battery10Regular>
                            <Caption1Strong><sub></sub>Battery</Caption1Strong>
                        </div>
                        <VitalsGauge id="battery" text="%" name={vitals.tss_data.batt_time_left/10800*100} value={vitals.tss_data.batt_time_left/10800*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Pri Storage</Caption1Strong>
                        <VitalsGauge id="pri-storage" text="%" name={vitals.tss_data.oxy_pri_storage} value={vitals.tss_data.oxy_pri_storage}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Sec Storage</Caption1Strong>
                        <VitalsGauge id="sec-storage" text="%" name={vitals.tss_data.oxy_sec_storage} value={vitals.tss_data.oxy_sec_storage}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Pri Pressure</Caption1Strong>
                        <VitalsGauge id="pri-pressure" text="PSI" name={vitals.tss_data.oxy_pri_pressure} value={vitals.tss_data.oxy_pri_pressure/3000*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Sec Pressure</Caption1Strong>
                        <VitalsGauge id="sec-pressure" text="PSI" name={vitals.tss_data.oxy_sec_pressure} value={vitals.tss_data.oxy_sec_pressure/3000*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <Drop12Filled></Drop12Filled>
                            <Caption1Strong><sub></sub>Coolant</Caption1Strong>
                        </div>
                        <VitalsGauge id="coolant" text="%" name={vitals.tss_data.coolant_ml} value={vitals.tss_data.coolant_ml}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="time">
                <Body1Strong>Time Remaining<sub></sub></Body1Strong>
                <div className="time-block" style={{justifyContent: "space-around"}}>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Oxygen</Caption1Strong>
                        <div className="card"><Body1Strong>{secondsToHours(vitals.tss_data.oxy_time_left)}</Body1Strong></div>
                    </div>
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <Battery9Regular></Battery9Regular>
                            <Caption1Strong><sub></sub>Battery</Caption1Strong>
                        </div>
                        <div className="card"><Body1Strong>{secondsToHours(vitals.tss_data.batt_time_left)}</Body1Strong></div>
                    </div>

                </div>
            </div>
            <div className="atmosphere">
                <Body1Strong>Suit Atmosphere<sub></sub></Body1Strong>
                <div className="rings-row">
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <Heart12Filled></Heart12Filled>
                            <Caption1Strong><sub></sub>Heart Rate</Caption1Strong>
                        </div>
                        <VitalsGauge id="heart-rate" text="BPM" name={vitals.tss_data.heart_rate} value={vitals.tss_data.heart_rate/160*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Consumption</Caption1Strong>
                        <VitalsGauge id="oxy-consumption" text="PSI/m" name={vitals.tss_data.oxy_consumption} value={vitals.tss_data.oxy_consumption/.15*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>CO<sub>2</sub>  Production</Caption1Strong>
                        <VitalsGauge id="co2-production" text="PSI/m" name={vitals.tss_data.co2_production} value={vitals.tss_data.co2_production/.15*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>O<sub>2</sub>  Suit Pressure</Caption1Strong>
                        <VitalsGauge id="oxy-suit" text="PSI" name={vitals.tss_data.suit_pressure_oxy} value={vitals.tss_data.suit_pressure_oxy/4.1*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>CO<sub>2</sub>  Suit Pressure</Caption1Strong>
                        <VitalsGauge id="co2-suit" text="PSI" name={vitals.tss_data.suit_pressure_co2} value={vitals.tss_data.suit_pressure_co2/0.1*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong><sub></sub>Other Suit Pressure</Caption1Strong>
                        <VitalsGauge id="other-suit" text="PSI" name={vitals.tss_data.suit_pressure_other} value={vitals.tss_data.suit_pressure_other/0.5*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong><sub></sub>Suit Total Pressure</Caption1Strong>
                        <VitalsGauge id="total-suit" text="PSI" name={vitals.tss_data.suit_pressure_total} value={vitals.tss_data.suit_pressure_total/4.5*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong>Helmet CO<sub>2</sub> Pressure</Caption1Strong>
                        <VitalsGauge id="helmet-co2" text="PSI" name={vitals.tss_data.helmet_pressure_co2} value={vitals.tss_data.helmet_pressure_co2/0.1*100}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="temperature">
                <Body1Strong>Suit Temperature<sub></sub></Body1Strong>
                <div className="rings-row">
                    <div className="ring">
                        <div style={{display: "flex", gap: "3px"}}>
                            <img src={temperatureIcon} height={14} width={14}></img>
                            <Caption1Strong><sub></sub>Temp</Caption1Strong>
                        </div>
                        <VitalsGauge id="temp" text="˚F" name={vitals.tss_data.temperature} value={vitals.tss_data.temperature/90*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong><sub></sub>Coolant Liquid Pressure</Caption1Strong>
                        <VitalsGauge id="coolant-liquid" text="PSI" name={vitals.tss_data.coolant_liquid_pressure} value={vitals.tss_data.coolant_liquid_pressure/700*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong><sub></sub>Coolant Gas Pressure</Caption1Strong>
                        <VitalsGauge id="coolant-gas" text="PSI" name={vitals.tss_data.coolant_gas_pressure} value={vitals.tss_data.coolant_gas_pressure/700*100}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="helmetFan">
                <Body1Strong>Suit Helmet Fan<sub></sub></Body1Strong>
                <div className="rings-row">
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <img src={fanWhite} height={12} width={12}></img>
                            <Caption1Strong><sub></sub>Fan Pri</Caption1Strong>
                        </div>
                        <VitalsGauge id="fan-pri" text="RPM" name={vitals.tss_data.fan_pri_rpm} value={vitals.tss_data.fan_pri_rpm/30000*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <div style={{display: "flex", gap: "3.5px"}}>
                            <img src={fanOutline} height={12} width={12}></img>
                            <Caption1Strong><sub></sub>Fan Sec</Caption1Strong>
                        </div>
                        <VitalsGauge id="fan-sec" text="RPM" name={vitals.tss_data.fan_sec_rpm} value={vitals.tss_data.fan_sec_rpm/30000*100}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="co2Scrubbers">
            <Body1Strong>Suit CO<sub>2</sub> Scrubbers</Body1Strong>
                <div className="rings-row">
                    <div className="ring">
                        <Caption1Strong><sub></sub>Scrubber A</Caption1Strong>
                        <VitalsGauge id="scrubber-a" text="%" name={vitals.tss_data.scrubber_a_co2_storage} value={vitals.tss_data.scrubber_a_co2_storage/700*100}></VitalsGauge>
                    </div>
                    <div className="ring">
                        <Caption1Strong><sub></sub>Scrubber B</Caption1Strong>
                        <VitalsGauge id="scrubber-b" text="%" name={vitals.tss_data.scrubber_b_co2_storage} value={vitals.tss_data.scrubber_b_co2_storage/700*100}></VitalsGauge>
                    </div>
                </div>
            </div>
            <div className="dcu">
            <Body1Strong>Display & Control Unit<sub></sub></Body1Strong>
                <div className="dcu-row">
                    <div style={{display: "flex", flexDirection: "column", justifyItems: "space-evenly", gap: "30px"}}>
                        <div className="ring">
                            <Caption1Strong>Fan<sub></sub></Caption1Strong>
                            <div className="switch" style={{borderTop: vitals.dcu.fan ? "3px solid #adadad" : "", borderBottom: !vitals.dcu.fan ? "3px solid #adadad" : ""}}>
                                <Body1Strong>{vitals.dcu.fan ? "PRI" : "SEC"}</Body1Strong>
                            </div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>Battery<sub></sub></Caption1Strong>
                            <div className="switch" style={{borderTop: vitals.dcu.batt ? "3px solid #adadad" : "", borderBottom: !vitals.dcu.batt ? "3px solid #adadad" : ""}}>
                                <Body1Strong>{vitals.dcu.batt ? "LOCAL" : "UMB"}</Body1Strong>
                            </div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>Comms<sub></sub></Caption1Strong>
                            <div className="switch" style={{borderTop: vitals.dcu.comm ? "3px solid #adadad" : "", borderBottom: !vitals.dcu.comm ? "3px solid #adadad" : ""}}>
                                <Body1Strong>{vitals.dcu.comm ? "A" : "B"}</Body1Strong>
                            </div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyItems: "space-around", gap: "30px"}}>
                        <div className="ring">
                            <Caption1Strong>Oxygen<sub></sub></Caption1Strong>
                            <div className="switch" style={{borderTop: vitals.dcu.oxy ? "3px solid #adadad" : "", borderBottom: !vitals.dcu.oxy ? "3px solid #adadad" : ""}}>
                                <Body1Strong>{vitals.dcu.oxy ? "PRI" : "SEC"}</Body1Strong>
                            </div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>CO<sub>2</sub></Caption1Strong>
                            <div className="switch" style={{borderTop: vitals.dcu.co2 ? "3px solid #adadad" : "", borderBottom: !vitals.dcu.co2 ? "3px solid #adadad" : ""}}>
                                <Body1Strong>{vitals.dcu.co2 ? "A": "B"}</Body1Strong>
                            </div>
                        </div>
                        <div className="ring">
                            <Caption1Strong>Pump<sub></sub></Caption1Strong>
                            <div className="switch" style={{borderTop: vitals.dcu.pump ? "3px solid #adadad" : "", borderBottom: !vitals.dcu.pump ? "3px solid #adadad" : ""}}>
                                <Body1Strong>{vitals.dcu.pump ? "OPEN" : "CLOSED"}</Body1Strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default VitalsScreen;