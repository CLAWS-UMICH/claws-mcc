import * as React from "react";
import { useState, useEffect } from 'react';
import { CardSelectable } from "./Card/Card.tsx";
import ButtonRow from "./ButtonRow/ButtonRow.tsx";
import DropDown from "./DropDown/DropDown.tsx";
import Header from "./Header/Header.tsx";
import SearchBar from "./SearchBar/SearchBar.tsx";
import axios from "axios";
import AntennaAlignment from './assets/Antenna_Alignment_and_Calibration .png';
import PowerSystem from './assets/Power_System_Troubleshooting_and_Repair.png';
import StructuralDamage from './assets/Structural_Damage_Repair .png';
import Transceiver from './assets/Transceiver_Module_Replacement .png';
import BatteryLocal from './assets/Battery_Local.png';
import BatteryUmbilical from './assets/Battery_Umbilical.png';
import CO2A from './assets/CO2_A.png';
import CO2B from './assets/CO2_B.png';
import CommunicationA from './assets/Communication_A.png';
import CommunicationB from './assets/Communication_B.png';
import FanPrimary from './assets/Fan_Primary.png';
import FanSecondary from './assets/Fan_Secondary.png';
import OxygenPrimary from './assets/Oxygen_Primary.png';
import OxygenSecondary from './assets/Oxygen_Secondary.png';
import PumpOpen from './assets/Pump_Open.png';
import PumpClose from './assets/Pump_Close.png';

interface ScreenInfo {
    title: string; // Format: type_descriptor_enumeration
    img_binary: string; // Good for handling binary data in Node.js!
    id: string; // ID representing the image
    height: number;
    width: number;
}

const presetScreens: ScreenInfo[] = [
    {
        title: 'Antenna_Alignment_and_Calibration.png',
        img_binary: AntennaAlignment,
        id: 'aB2cD',
        height: 614,
        width: 614
    },
    {
        title: 'Power_System_Troubleshooting_and_Repair.png',
        img_binary: PowerSystem,
        id: 'eFgHi',
        height: 768,
        width: 768
    },
    {
        title: 'Structural_Damage_Repair.png',
        img_binary: StructuralDamage,
        id: 'kLmNo',
        height: 768,
        width: 768
    },
    {
        title: 'Transceiver_Module_Replacement.png',
        img_binary: Transceiver,
        id: 'pQrSt',
        height: 614,
        width: 614
    },
    {
        title: 'Battery_Local.png',
        img_binary: BatteryLocal,
        id: 'uVwXy',
        height: 614,
        width: 614
    },
    {
        title: 'Battery_Umbilical.png',
        img_binary: BatteryUmbilical,
        id: 'z12a3',
        height: 768,
        width: 768
    },
    {
        title: 'CO2_A.png',
        img_binary: CO2A,
        id: '45abc',
        height: 614,
        width: 614
    },
    {
        title: 'CO2_B.png',
        img_binary: CO2B,
        id: 'd1e2f',
        height: 768,
        width: 768
    },
    {
        title: 'Communication_A.png',
        img_binary: CommunicationA,
        id: 'ghi12',
        height: 768,
        width: 768
    },
    {
        title: 'Communication_B.png',
        img_binary: CommunicationB,
        id: 'wiu18',
        height: 768,
        width: 768
    },
    {
        title: 'Fan_Primary.png',
        img_binary: FanPrimary,
        id: 'pof90',
        height: 768,
        width: 768
    },
    {
        title: 'Fan_Secondary.png',
        img_binary: FanSecondary,
        id: 'mjc87',
        height: 768,
        width: 768
    },
    {
        title: 'Oxygen_Primary.png',
        img_binary: OxygenPrimary,
        id: 'ung02',
        height: 768,
        width: 768
    },
    {
        title: 'Oxygen_Secondary.png',
        img_binary: OxygenSecondary,
        id: 'uih03',
        height: 768,
        width: 768
    },
    {
        title: 'Pump_Open.png',
        img_binary: PumpOpen,
        id: 'lfb31',
        height: 768,
        width: 768
    },
    {
        title: 'Pump_Close.png',
        img_binary: PumpClose,
        id: 'ohv58',
        height: 768,
        width: 768
    }
];

export const Communication = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isButton, setIsButton] = useState(false);
    const [positioningRef, setPositioningRef] = useState(null);
    const [imageArray, setImageArray] = useState([]);
    const [activeObjectId, setActiveObjectId] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        axios.get(`/api/screens/`)
            .then((res) => {
                setImageArray(res.data.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []); // Empty dependency array means it runs once after the initial render

    // handles the case when the button is clicked
    const handleButtonClick = (buttonId, ref) => {
        setDropdownVisible(true);
        setIsButton(true);
        setPositioningRef(ref.current);
        setActiveObjectId(buttonId);
    };

    const handleCardClick = (cardId, ref) => {
        setDropdownVisible(true);
        setIsButton(false);
        setPositioningRef(ref.current);
        setActiveObjectId(cardId);
    };

    const handleDropdownChange = (e, data) => {
        if (!data.open) {
            setDropdownVisible(false);
        }
    };

    return(
        <div style={{ backgroundColor: '#000000', height: '100vh', overflow: 'hidden' }}>
            <div id="myPopup" style={{ height: '100%', overflowY: 'auto' }}>
                <Header/>
                <ButtonRow onButtonClick={handleButtonClick}/>
                <div style ={{margin: "32px 0 32px 20px"}}>
                    <SearchBar searchInput={searchInput} setSearchInput={setSearchInput}/>
                </div>
                <DropDown open={dropdownVisible} onOpenChange={handleDropdownChange} positioningRef={positioningRef} activeObjectId={activeObjectId} isButton={isButton}/>
                <CardSelectable onCardClick={handleCardClick} images={presetScreens} searchInput={searchInput}/>
            </div>
        </div>
    )
}

export default Communication;
