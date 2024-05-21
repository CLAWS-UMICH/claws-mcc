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

  const handleAstronautSelection = (value) => {
    if (selectedAstronauts.includes(value)) {
      setSelectedAstronauts(selectedAstronauts.filter(id => id !== value));
    } else {
      setSelectedAstronauts([...selectedAstronauts, value]);
    }
  };

  const handleSendClick = () => {
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
          <MenuItemCheckbox className="dropdown-text" name="Astronaut" value="0" onClick={() => handleAstronautSelection('0')}>
            Akira
          </MenuItemCheckbox>
          <MenuItemCheckbox className="dropdown-text" name="Astronaut" value="1" onClick={() => handleAstronautSelection('1')}>
            Emma
          </MenuItemCheckbox>
          <MenuItemCheckbox className="dropdown-text" name="Astronaut" value="2" onClick={() => handleAstronautSelection('2')}>
            Jamie
          </MenuItemCheckbox>
          <MenuItemCheckbox className="dropdown-text" name="Astronaut" value="3" onClick={() => handleAstronautSelection('3')}>
            Jenny
          </MenuItemCheckbox>
          <MenuItemCheckbox className="dropdown-text" name="Astronaut" value="4" onClick={() => handleAstronautSelection('4')}>
            Sohavni
          </MenuItemCheckbox>
          <MenuDivider />
          <MenuItem className="dropdown-send" icon={<Send20Regular />} onClick={() => handleSendClick()} >Send</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};


export default DropDown;