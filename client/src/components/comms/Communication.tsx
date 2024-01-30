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
                            max-height: 50vh !important;
                            max-width: 100vh !important;
                            overflow-y: scroll !important;
                        }
                    `}
                </style>
                <CardSelectable></CardSelectable>
            </div>
            {/* TODO have these appear on the same line */}
            <Multiselect></Multiselect>
            <SendButton></SendButton>
        </div>
    )
}

/**
 * for the rest of the page
 * savedScrollY = window.scrollY;
    let x = document.getElementById("myPage"); 
    x.style.position = "fixed"; 
    x.style.top = -savedScrollY+"px";
 */