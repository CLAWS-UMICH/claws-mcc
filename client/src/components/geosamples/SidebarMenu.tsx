// SidebarMenu.tsx
import React from 'react';
import SearchBox from '../common/SearchBox/SearchBox.tsx';

interface SidebarMenuProps {
    dropdownMenus: JSX.Element[]; // Array of DropdownMenu components as JSX elements
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ dropdownMenus }) => {
    return (
        <div style={{ width: '200px', background: '#f3f2f1', padding: '10px' }}>
            <SearchBox/>
            {dropdownMenus.map((menu, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    {menu}
                </div>
            ))}
        </div>
    );
};

export default SidebarMenu;
