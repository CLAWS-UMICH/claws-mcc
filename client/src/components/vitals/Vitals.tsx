import React, { useState } from "react";

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // css for the carousel
import { Dropdown, Option, useId } from "@fluentui/react-components";
import type { DropdownProps } from "@fluentui/react-components"


export const AstronautDropdown = (props: Partial<DropdownProps>) => {
    const [selectedAstronaut, setSelectedAstronaut] = useState("");
    const dropdownId = useId("dropdown-default");
    const options = [
        "Steve's Vitals",
        "Steve 2.0's Vitals",
        "Steve etc.'s Vitals",
    ];

    return (
        <Dropdown
            id={dropdownId}
            aria-labelledby={dropdownId}
            placeholder="Select Astronaut"
            style={{margin: '1%'}}
            appearance = "underline"
            clearable
            {...props}
        >
            {options.map((option) => (
                <Option key={option}>
                    {option}
                </Option>
            ))}
        </Dropdown>
    );
};



const VitalManager: React.FC = () => {

    

    return (
        <div className="page" style={{display: 'flex', flexDirection: 'column', flex: "1 1 auto", gap: '15px'}}>
            <div className="topPlaceholder" style={{height: '10%', display: 'flex', flex: "1 1 auto", minWidth: '100%', 
            backgroundColor: 'grey', marginBottom: '2%'}}>
                <AstronautDropdown />
            </div>
            <div className="middlePlaceholder" style={{height: '300px', display: 'flex', flex: "1 1 auto", minWidth: '100%',
            backgroundColor: 'grey', marginBottom: '2%'}}>
                <div className="InnerMiddleBox" style={{display: 'flex', flex: "1 1 auto", flexDirection: 'row', margin: '10px'}}>
                    <div className="ResourceAtmosphereBox" style={{display: 'flex', flex: "1 1 auto", flexDirection: 'column',
                    backgroundColor: 'black', width: '70%'}}>
                        <div className="ResourcesBox" style={{display: 'flex', flex: "1 1 auto", margin: '25px', backgroundColor: 'white'}}>
                            <h2 style={{color: "black"}}>Suit Resources Thing Here</h2>
                        </div>
                        <div className="AtmosphereBox" style={{display: 'flex', flex: "1 1 auto", margin: '25px', backgroundColor: 'white'}}>
                            <h2 style={{color: "black"}}>Suit Atmosphere Thing Here</h2>
                        </div>
                    </div>
                    <div className="SuitControlsBox" style={{display: 'flex', flex: "1 1 auto", marginLeft: '2%', 
                    backgroundColor: 'white', width: '30%'}}>
                        <h2 style={{color: "black"}}>Suit Controls Thing Here</h2>
                    </div>
                </div>
            </div>
            <div className="bottomPlaceholder" style={{display: 'flex', flex: "1 1 auto", minWidth: '100%', backgroundColor: 'grey'}}>
                <div className="InnerBottomBox" style={{display: 'flex', flex: "1 1 auto", flexDirection: 'row', margin: '10px'}}>

                    <div className="TEMPBox" style={{display: 'flex', flex: "1 1 auto", flexDirection: 'column',
                        backgroundColor: 'black', width: '100%'}}>
                            <div className="TEMPxBox" style={{display: 'flex', flex: "1 1 auto", margin: '25px', backgroundColor: 'white'}}>
                                <h2 style={{color: "black"}}>Temporary whatever placeholder Thing Here</h2>
                            </div>
                            <div className="TEMPyBox" style={{display: 'flex', flex: "1 1 auto", margin: '25px', backgroundColor: 'white'}}>
                                <h2 style={{color: "black"}}>Temporary whatever placeholder Thing Here</h2>
                            </div>
                        </div>

                </div>
            </div>

            {/* <div className="carouselBox" style={{width: '20%', height: '20%', display: 'flex'}}>
                <Carousel>
                    <div>
                        <img src="https://via.placeholder.com/400" alt="Placeholder" />
                        <p className="legend">Legend 1</p>
                    </div>
                    <div>
                        <img src="https://via.placeholder.com/400" alt="Placeholder" />
                        <p className="legend">Legend 2</p>
                    </div>
                </Carousel>
            </div> */}
        </div>
    );
};

export default VitalManager;