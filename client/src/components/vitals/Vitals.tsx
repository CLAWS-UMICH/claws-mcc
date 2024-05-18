import React, { useEffect, useReducer, useState } from "react";
import { Dropdown, Option, Divider } from "@fluentui/react-components";
import './Vitals.css'
import VitalsScreen from "./VitalsScreen.tsx";
import useDynamicWebSocket from "../../hooks/useWebSocket.tsx";
import { ManagerAction, ManagerState } from "./VitalsTypes.tsx";

export const vitalsReducer = (state: ManagerState, action: ManagerAction): ManagerState => {
  switch (action.type) {
    case 'set':
      return {
          vitals: action.payload
      }
  }
}

const VitalsManager: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  const {sendMessage, lastMessage, readyState} = useDynamicWebSocket({
    onOpen: () => sendMessage(JSON.stringify({type: 'VITALS'}))
  })

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage.data));
    }
  }, [lastMessage, setMessageHistory]);

  return (
    <div>
      <div>
        <h4 style={{paddingLeft:'1.5rem', paddingRight:'1.5rem', display:'flex', justifyContent: 'start', marginTop: "11px", marginBottom: "11px"}}>
          <Dropdown appearance="filled-lighter">
            <Option text="Steve's Vitals">
              Steve's Vitals
            </Option>
          </Dropdown>  
        </h4>
        <Divider></Divider>
      </div>
      <VitalsScreen/>
    </div>
  );
}

export default VitalsManager;