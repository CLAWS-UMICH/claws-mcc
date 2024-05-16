// SidebarMenu.tsx
import React from 'react';
// import DropdownMenu from './Dropdownmenu'; // Ensure this is the correct path

interface SidebarMenuProps {
    dropdownMenus: JSX.Element[]; // Array of DropdownMenu components as JSX elements
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ dropdownMenus }) => {
    return (
        <div style={{ width: '200px', background: '#f3f2f1', padding: '10px' }}>
            {dropdownMenus.map((menu, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    {menu}
                </div>
            ))}
        </div>
    );
};

export default SidebarMenu;
