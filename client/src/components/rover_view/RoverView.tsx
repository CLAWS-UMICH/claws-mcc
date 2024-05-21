import React, { useEffect, useState } from "react";
import CameraView1 from '../../assets/cameraview1.jpeg';
import CameraView2 from '../../assets/cameraview2.jpeg';
import '../rover_view/RoverView.css';
import { DrawerHeader, DrawerHeaderTitle } from "@fluentui/react-components";
import config from "../../config";

const RoverView: React.FC = () => {
    useEffect(() => {
        const updateImages = () => {
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
                img.src = img.src.split('?')[0] + '?' + new Date().getTime();
            });
        };

        updateImages();

        const interval = setInterval(() => {
            updateImages();
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", backgroundColor: "#000000", border: "1px solid #444444", overflowX: "hidden" }}>
            <DrawerHeader style={{ height: "70px", backgroundColor: "#141414", borderColor: "#444444", borderStyle: "solid", borderWidth: "0px 1px 1px 0px" }}>
                <DrawerHeaderTitle>
                    Rover
                </DrawerHeaderTitle>
            </DrawerHeader>

            <div className="camera-content">
                {!config.ROVER_IP_ADDRESS ? (
                    <>
                        <div className='top-image camera'>
                            <img src={CameraView1} alt='camera' className='image' />
                        </div>
                        <div className='bottom-image camera'>
                            <img src={CameraView2} alt='camera' className='image' />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='top-image camera'>
                            <img
                                src={`http://${config.ROVER_IP_ADDRESS}/native_feed`}
                                className='video'
                            />
                        </div>
                        <div className='bottom-image camera'>
                            <img
                                src={`http://${config.ROVER_IP_ADDRESS}/thermal_feed`}
                                className='video'
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RoverView;
