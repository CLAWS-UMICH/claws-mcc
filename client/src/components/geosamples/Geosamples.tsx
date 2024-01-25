import React from 'react';
import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import SidebarMenu from '../common/SidebarMenu/SidebarMenu.tsx'
import DropdownMenu from '../common/DropdownMenu/Dropdownmenu.tsx'
import Geosamples from '../common/Geosamples/Geosamples.tsx'
import SearchBox from '../common/SearchBox/SearchBox.tsx'
const GeosampleManager: React.FC = () => 
{
    const menuData = [
        {
            header: 'Header 1',
            samples: ['Link 1.1', 'Link 1.2', 'Link 1.3'],
        },
        {
            header: 'Header 2',
            samples: ['Link 2.1', 'Link 2.2'],
        },
    ];
    const dropdownTest = {
        header: 'test drop',
        samples: ['1', '2', '3'],
    };
    return (
        <div>
        <Geosamples />
        {/* <DropdownMenu header={dropdownTest.header} samples={dropdownTest.samples} /> */}
        <SearchBox />
        </div>
    );
}
export default GeosampleManager;