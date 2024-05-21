import React, { useEffect, useReducer, useState } from "react";
import { Dropdown, Option, Divider } from "@fluentui/react-components";
import './Vitals.css'
import VitalsScreen from "./VitalsScreen.tsx";
import useDynamicWebSocket from "../../hooks/useWebSocket.tsx";
import { ManagerAction, ManagerState, VitalsData } from "./VitalsTypes.tsx";
import { initial } from "lodash";

export const vitalsReducer = (state: ManagerState, action: ManagerAction): ManagerState => {
  switch (action.type) {
    case 'set':
      return {
          vitals: action.payload
      }
  }
}

const initialState: ManagerState = { vitals: {
  eva_time: 0,
  tss_data: {
    batt_time_left: 0,
    oxy_pri_storage: 0,
    oxy_sec_storage: 0,
    oxy_pri_pressure: 0,
    oxy_sec_pressure: 0,
    oxy_time_left: 0,
    heart_rate: 0,
    oxy_consumption: 0,
    co2_production: 0,
    suit_pressure_oxy: 0,
    suit_pressure_co2: 0,
    suit_pressure_other: 0,
    suit_pressure_total: 0,
    fan_pri_rpm: 0,
    fan_sec_rpm: 0,
    helmet_pressure_co2: 0,
    scrubber_a_co2_storage: 0,
    scrubber_b_co2_storage: 0,
    temperature: 0,
    coolant_ml: 0,
    coolant_gas_pressure: 0,
    coolant_liquid_pressure: 0
  },
  dcu: {
    batt: false,
    oxy: false,
    comm: false,
    fan: false,
    pump: false,
    co2: false
  }
}}

const VitalsManager: React.FC = () => {
  // const [state, dispatch] = useReducer(vitalsReducer, initialState);
  const [vitals, setVitals] = useState(initialState.vitals)
  const [messageHistory, setMessageHistory] = useState<VitalsData[]>([]);

  const {sendMessage, lastMessage, readyState} = useDynamicWebSocket({
    onOpen: () => sendMessage(JSON.stringify({type: 'GET_VITALS'})),
    type: 'VITALS'
  });

  useEffect(() => {
    if (lastMessage !== null) {
      // setMessageHistory((prev) => prev.concat(JSON.parse(lastMessage.data)));
      const data = JSON.parse(lastMessage.data);

      setVitals(data.data);
    }
  }, [lastMessage]);

  // Determine which eva sequence is being initiated
  var eva_seq = "eva_1"
  
  return (
    <div>
      <div style={{background: "#141414"}}>
        <h4 style={{paddingLeft:'1.5rem', paddingRight:'1.5rem', display:'flex', justifyContent: 'start', height: "53.111px", marginTop: '0px', marginBottom: '0px', alignItems: 'center'}}>
          <div className="circle">S</div>
          <Dropdown style={{background: "#141414"}} appearance="filled-lighter" defaultValue="Steve's Vitals" defaultSelectedOptions={["steve"]}>
            <Option text="Steve's Vitals" value="steve">
              Steve's Vitals
            </Option>
          </Dropdown>  
        </h4>
        <Divider></Divider>
      </div>
      <VitalsScreen vitals={vitals}/>
    </div>
  );
}

export default VitalsManager;