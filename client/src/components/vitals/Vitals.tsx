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
  id: 0,
  eva_time: 0,
  battery_time_left: 0,
  primary_oxygen_storage: 0,
  secondary_oxygen_storage: 0,
  primary_oxygen_pressure: 0,
  secondary_oxygen_pressure: 0,
  oxygen_time_left: 0,
  heart_rate: 0,
  oxygen_consumption: 0,
  co2_production: 0,
  suit_oxygen_pressure: 0,
  suit_cO2_pressure: 0,
  suit_other_pressure: 0,
  suit_total_pressure: 0,
  primary_fan_rpm: 0,
  secondary_fan_rpm: 0,
  helmet_co2_pressure: 0,
  scrubber_a_co2_capacity: 0,
  scrubber_b_co2_capacity: 0,
  temperature: 0,
  coolant_ml: 0,
  h2o_gas_pressure: 0,
  h2o_liquid_pressure: 0,
  alerts: [],
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
      <div>
        <h4 style={{paddingLeft:'1.5rem', paddingRight:'1.5rem', display:'flex', justifyContent: 'start', marginTop: "11px", marginBottom: "11px", alignItems: 'center'}}>
          <div className="circle">S</div>
          <Dropdown appearance="filled-lighter" defaultValue="Steve's Vitals" defaultSelectedOptions={["steve"]}>
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