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

export const DropDown = ({open, onOpenChange, positioningRef}) => {
  const [key, setKey] = React.useState(0); // Add a key state to force re-render

  return (
    <Menu open={open} onOpenChange={(e, data) => {
      onOpenChange(e, data);
      if (!data.open) {
        // Reset key to force re-render of MenuItemCheckbox components when menu is closed
        setKey((prevKey) => prevKey + 1);
      }
      }} positioning={{ target: positioningRef }} key={key}>

      <MenuPopover className="dropdown-popover">
        <MenuList>
          <MenuItemCheckbox className = "dropdown-text" name="Astronaut" value="1">
            Akira
          </MenuItemCheckbox>
          <MenuItemCheckbox className = "dropdown-text" name="Astronaut" value="2">
            Emma
          </MenuItemCheckbox>
          <MenuItemCheckbox className = "dropdown-text" name="Astronaut" value="3">
            Jamie
          </MenuItemCheckbox>
          <MenuItemCheckbox className = "dropdown-text" name="Astronaut" value="4">
            Jenny
          </MenuItemCheckbox>
          <MenuItemCheckbox className = "dropdown-text" name="Astronaut" value="5">
            Sohavni
          </MenuItemCheckbox>
          <MenuDivider />
          <MenuItem icon={<Send20Regular />} style={{fontSize: 15}} >Send</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};


export default DropDown;