import * as React from "react";

import {
  Menu,
  MenuList,
  MenuItem,
  MenuItemCheckbox,
  MenuPopover,
  MenuDivider,
} from "@fluentui/react-components";
import { Send20Regular } from "@fluentui/react-icons";
import "./DropDown.css";
import useDynamicWebSocket from "../../../hooks/useWebSocket";

interface Astronaut {
  id: number;
  name: string;
  color: string;
}

const sendButtonHighlightRequest = (buttonId, astronautId) => {
  fetch('/api/highlightbutton', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      data: {
        buttonID: buttonId,
        astronautID: astronautId,
      }
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Button highlight request sent successfully:', data);
  })
  .catch((error) => {
    console.error('Error sending button highlight request:', error);
  });
};

const sendSendImageRequest = (imageId, astronautId) => {
  fetch('/api/sendimage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      data: {
        imageID: imageId,
        astronautID: astronautId,
      }
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Send image request sent successfully:', data);
  })
  .catch((error) => {
    console.error('Error sending send image request:', error);
  });
};

export const DropDown = ({ open, onOpenChange, positioningRef, activeObjectId, isButton }) => {
  const [selectedAstronauts, setSelectedAstronauts] = React.useState<string[]>([]);
  const [astronauts, setAstronauts] = React.useState<Astronaut[]>([])

  const { sendMessage, lastMessage } = useDynamicWebSocket({
    onOpen: () => {
      sendMessage(JSON.stringify({ type: 'GET_ASTRONAUTS' }));
    },
    type: 'ASTRONAUTS'
  });

  React.useEffect(() => {
    if (lastMessage) {
      let astronautData: Astronaut[] = [];
      try {
        astronautData = JSON.parse(lastMessage.data).data;
      } catch (error) {
        console.error(error);
      }

      if (astronautData) {
        astronautData = astronautData.filter((astronaut, index, self) =>
          index === self.findIndex((t) => (
            t.id === astronaut.id
          ))
        );
      }

      setAstronauts(astronautData);
    }
  }, [lastMessage]);

  const handleAstronautSelection = (value) => {
    if (selectedAstronauts.includes(value)) {
      setSelectedAstronauts(selectedAstronauts.filter(id => id !== value));
    } else {
      setSelectedAstronauts([...selectedAstronauts, value]);
    }
  };

  const handleSendClick = () => {
    console.log({ selectedAstronauts, activeObjectId, isButton })
    if (isButton){
      selectedAstronauts.forEach(astronautId => {
        sendButtonHighlightRequest(activeObjectId, astronautId);
      });
    } else {
      selectedAstronauts.forEach(astronautId => {
        sendSendImageRequest(activeObjectId, astronautId);
      });
    }
  };
  
  const [key, setKey] = React.useState(0);  // Used to force re-render

  return (
    <Menu open={open} onOpenChange={(e, data) => {
      setSelectedAstronauts([]);
      onOpenChange(e, data);
      if (!data.open) {
        setKey((prevKey) => prevKey + 1);
      }
      }} positioning={{ target: positioningRef }} key={key}>

      <MenuPopover className="dropdown-popover">
        <MenuList>
          {astronauts.map((astronaut) => (
            <MenuItemCheckbox className="dropdown-text" name="Astronaut" value={astronaut.id.toString()} onClick={() => handleAstronautSelection(astronaut.id.toString())}>
              {astronaut.name}
            </MenuItemCheckbox>
          ))}
          <MenuDivider />
          <MenuItem className="dropdown-send" icon={<Send20Regular />} onClick={() => handleSendClick()} >Send</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};


export default DropDown;