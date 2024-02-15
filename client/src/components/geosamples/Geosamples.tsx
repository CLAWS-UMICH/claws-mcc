import React from 'react';
import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import Geosamples from '../common/Geosamples/Geosamples.tsx';
import SearchBox from '../common/SearchBox/SearchBox.tsx';

import DropdownElt from '../common/Dropdown/Dropdown.tsx';
import Label from '../common/Label/Label.tsx';
import Description from '../common/Description/Description.tsx';

import { Button } from '@fluentui/react-components';
import axios from 'axios';

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
        {/* <SearchBox /> */}
            <div style={{display:'flex', alignContent:'center', position:'absolute', left: '225px', right: '0px', background: '#f3f2f1', padding: '10px', top: '55px'}}>
                <h4><b>Zone A: Geo Sample 1</b></h4>
                <div style={{position:'relative', left:'10px', display:'flex', alignContent:'center', height: '35px', width:'5px', top:'10px'}}>
                    <Button>☆</Button>
                </div>
                <div className="rightBtns" style={{position:'relative', left:'53%', display:'flex', alignContent:'center', top:'10px', height:'35px'}}>
                    <Button style={{}}>View on map</Button>
                    <Button style={{}}>Edit</Button>
                    <Button style={{}}>Delete</Button>
                </div>
            </div>
            <div style={{position:'relative', background: '#eeeeee', top:'-10px', left:'225px', width:'1270px', padding: '20px',}}>
                <div style={{display:"flex", justifyContent:'space-between', width:'1260px'}}>
                    <DropdownElt title="Shape" options={["Hexagon"]}/>
                    <DropdownElt title="Color" options={["Brown"]}/>
                    <Label title="Rock Type" text="Basalt"/>
                    <Label title="ID" text="000000000" />
                </div>
                <div style={{position:'relative', right:'500px', left:'0px'}}>
                    <Description text="Description"/>
                </div>
                <div style={{display:"flex", justifyContent:'space-between', width:'1260px', position:'relative', left:'0px', right:'500px',}}>
                    <Label title="SiO2" text="40.58"/>
                    <Label title="TiO2" text="12.83" />
                    <Label title="Ai2O3" text="10.91" />
                    <Label title="FeO" text="13.8" />
                    <Label title="MnO" text="40.58" />
                    <Label title="MgO" text="12.83" />
                    <Label title="CaO" text="10.91" />
                    <Label title="K2O" text="13.8" />
                    <Label title="P2O3" text="12.8" />
                </div>
                <div style={{display:"flex", justifyContent:'space-between', width:'1260px', position:'relative', left:'0px', right:'500px',}}>
                    <Label title="Location" text="40.58"/>
                    <Label title="Time" text="12.83" />
                    <Label title="Date" text="10.91" />
                    <Label title="Zone" text="13.8" />
                </div>
            </div>

        </div>
    );
}
export default GeosampleManager;