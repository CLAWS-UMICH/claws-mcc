// SidebarMenu.tsx
import React from 'react';
import SearchBox from '../common/SearchBox/SearchBox.tsx';

interface SidebarMenuProps {
    dropdownMenus: JSX.Element[]; // Array of DropdownMenu components as JSX elements
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ dropdownMenus }) => {
    return (
        <div>
            {dropdownMenus.map((menu, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    {menu}
                </div>
            ))}
        </div>
    );
};

export default SidebarMenu;
