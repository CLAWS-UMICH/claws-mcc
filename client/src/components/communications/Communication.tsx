import * as React from "react";
import { Multiselect, SendButton } from "./Multiselect.tsx"
import { CardSelectable } from "./Card.tsx";

export const Communication = () => {
    return(
        <div>
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
                <CardSelectable></CardSelectable>
            </div>
        </div>
    )
}

export default Communication;
