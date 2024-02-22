// Geosamples.tsx
import React from 'react';
import SidebarMenu from '../SidebarMenu/SidebarMenu.tsx';
import DropdownMenu from '../DropdownMenu/Dropdownmenu.tsx';

const GeosampleManager: React.FC = () => {
    const dropdownMenus = [
        <DropdownMenu header="Header 1" samples={['Link 1.1', 'Link 1.2', 'Link 1.3']} />,
        <DropdownMenu header="Header 2" samples={['Link 2.1', 'Link 2.2']} />,
    ];

    return (
        <SidebarMenu dropdownMenus={dropdownMenus} />
    );
};

export default GeosampleManager;
