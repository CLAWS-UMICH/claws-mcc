// DropdownMenu.tsx
import React from 'react';
import { useContext } from 'react';

import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Button } from '@fluentui/react-components';

interface DropdownMenuProps {
    header: string;
    samples: string[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ header, samples }) => {
    return (
        <Menu>
            <MenuTrigger>
                <Button>{header}</Button>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    {samples.map((sample, index) => (
                        <MenuItem key={index}>{sample}</MenuItem>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
}

export default DropdownMenu;
