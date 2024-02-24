import * as React from "react";

import {
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuItemCheckbox,
  MenuPopover,
} from "@fluentui/react-components";
import { Send24Regular } from "@fluentui/react-icons";

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
      <MenuTrigger>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItemCheckbox name="Astronaut" value="1">
            Akira
          </MenuItemCheckbox>
          <MenuItemCheckbox name="Astronaut" value="2">
            Emma
          </MenuItemCheckbox>
          <MenuItemCheckbox name="Astronaut" value="3">
            Jamie
          </MenuItemCheckbox>
          <MenuItemCheckbox name="Astronaut" value="4">
            Jenny
          </MenuItemCheckbox>
          <MenuItemCheckbox name="Astronaut" value="5">
            Sohavni
          </MenuItemCheckbox>
          <MenuItem icon={<Send24Regular />}>Send</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};


export default DropDown;