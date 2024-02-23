import * as React from "react";
import { useState, useRef } from 'react';
import { CardSelectable } from "./Card.tsx";
import ButtonRow from "./SendButtons.tsx";
import DropDown from "./DropDown.tsx";
import Header from "./Header.tsx";
 
export const Communication = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [buttonRef, setButtonRef] = useState(null);
    const [cardRef, setCardRef] = useState(null);

    const handleButtonClick = (buttonId, ref) => {
      console.log(buttonId);
      setDropdownVisible(true);
      setButtonRef(ref.current); // Store the button ref
    };

    const handleCardClick = (cardId, ref) => {
        console.log(cardId);
        setDropdownVisible(true);
        setCardRef(ref.current); // Store the card ref
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
                <DropDown open={dropdownVisible} onOpenChange={handleDropdownChange} positioningRef={buttonRef} />
                <CardSelectable />
            </div>
        </div>
    )
}

export default Communication;
