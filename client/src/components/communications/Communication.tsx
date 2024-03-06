import * as React from "react";
import { useState, useEffect } from 'react';
import { CardSelectable } from "./Card/Card.tsx";
import ButtonRow from "./ButtonRow/ButtonRow.tsx";
import DropDown from "./DropDown/DropDown.tsx";
import Header from "./Header/Header.tsx";
import axios from "axios";
 
export const Communication = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [positioningRef, setPositioningRef] = useState(null);
    const [imageArray, setImageArray] = useState([]);

    useEffect(() => {
        axios.get(`/api/screens/`)
            .then((res) => {
                setImageArray(res.data.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []); // Empty dependency array means it runs once after the initial render

    const handleButtonClick = (buttonId, ref) => {
        console.log(buttonId);
        setDropdownVisible(true);
        setPositioningRef(ref.current);
    };

    const handleCardClick = (cardId, ref) => {
        console.log(cardId);
        setDropdownVisible(true);
        setPositioningRef(ref.current);
    };

    const handleDropdownChange = (e, data) => {
        if (!data.open) {
            setDropdownVisible(false);
        }
    };

    return(
        <div style={{ backgroundColor: '#000000' }}>
            <div id="myPopup">
                <style>
                    {`
                        #myPopup {
                            top: 0px !important;
                            max-height: 100vh !important;
                            max-width: 120vh !important;
                            overflow-y: scroll !important;
                        }
                    `}
                </style>
                <Header/>
                <ButtonRow onButtonClick={handleButtonClick}/>
                <DropDown open={dropdownVisible} onOpenChange={handleDropdownChange} positioningRef={positioningRef} />
                <CardSelectable onCardClick={handleCardClick} images={imageArray}/>
            </div>
        </div>
    )
}

export default Communication;