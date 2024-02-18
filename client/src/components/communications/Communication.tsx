import * as React from "react";
import { Multiselect, SendButton } from "./Multiselect.tsx"
import { CardSelectable } from "./Card.tsx";
import ButtonRow from "./SendButtons.tsx";
import Dropdown from "./Dropdown.tsx";
import Header from "./Header.tsx";
 
export const Communication = () => {
    return(
        <div style={{ backgroundColor: '#000000' }}>
            <div id="myPopup">
                <style>
                    {`
                        #myPopup {
                            top: 0px !important;
                            max-height: 100vh !important;
                            // max-width: 120vh !important;
                            overflow-y: scroll !important;
                        }
                    `}
                </style>
                <Header></Header>
                <ButtonRow></ButtonRow>
                <Dropdown></Dropdown>
            </div>
        </div>
    )
}

export default Communication;
