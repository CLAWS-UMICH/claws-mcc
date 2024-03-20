import * as React from "react";
import { useState, useEffect } from 'react';
import { CardSelectable } from "./Card/Card.tsx";
import ButtonRow from "./ButtonRow/ButtonRow.tsx";
import DropDown from "./DropDown/DropDown.tsx";
import Header from "./Header/Header.tsx";
import axios from "axios";
 
export const Communication = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isButton, setIsButton] = useState(false);
    const [positioningRef, setPositioningRef] = useState(null);
    const [imageArray, setImageArray] = useState([]);
    const [activeObjectId, setActiveObjectId] = useState(null);

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
        console.log(buttonId);
        setDropdownVisible(true);
        setIsButton(true);
        setPositioningRef(ref.current);
        setActiveObjectId(buttonId);
    };

    const handleCardClick = (cardId, ref) => {
        console.log(cardId);
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
                <DropDown open={dropdownVisible} onOpenChange={handleDropdownChange} positioningRef={positioningRef} activeObjectId={activeObjectId} isButton={isButton}/>
                <CardSelectable onCardClick={handleCardClick} images={imageArray}/>
            </div>
        </div>
    )
}

export default Communication;