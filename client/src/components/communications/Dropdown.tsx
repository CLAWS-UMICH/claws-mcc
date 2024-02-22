import * as React from "react";

import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuItemCheckbox,
  MenuPopover,
} from "@fluentui/react-components";
import type {
  MenuProps,
  MenuTriggerChildProps,
} from "@fluentui/react-components";
import { Send24Regular } from "@fluentui/react-icons";


export const DropDown = () => {
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState(0); // Add a key state to force re-render

  const onOpenChange: MenuProps["onOpenChange"] = (e, data) => {
    setOpen(data.open);
    if (!data.open) {
      // Reset key to force re-render of MenuItemCheckbox components when menu is closed
      setKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <Menu open={open} onOpenChange={onOpenChange} key={key}>
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