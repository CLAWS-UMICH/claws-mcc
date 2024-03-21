import * as React from "react";
import { useState } from 'react';
import { CardSelectable } from "./Card.tsx";
import ButtonRow from "./SendButtons.tsx";
import DropDown from "./Dropdown.tsx";
import Header from "./Header.tsx";
 
export const Communication = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleButtonClick = (buttonId) => {
      console.log(buttonId);
      setDropdownVisible(true);
    };

    const handleDropdownChange = (e, { open }) => {
        if (!open) {
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
                <Header></Header>
                <ButtonRow onButtonClick={handleButtonClick}></ButtonRow>
                <DropDown open={dropdownVisible} onOpenChange={handleDropdownChange} />
                <CardSelectable></CardSelectable>
            </div>
        </div>
    )
}

export default Communication;
