import React, { useEffect, useState } from "react";
import CameraView1 from '../../assets/cameraview1.jpeg';
import CameraView2 from '../../assets/cameraview2.jpeg';
import './cameraView.css';
import useDynamicWebSocket from "../../hooks/useWebSocket";
import config from "../../config";
import { Spinner } from "@fluentui/react-components";

const CameraView: React.FC = () => {
    const [uptime, setUpTime] = useState<number>(0);
    const [videoErrors, setVideoErrors] = useState<boolean[]>(config.EVA_IP_ADDRESSES.map(() => false));
    const [loading, setLoading] = useState<boolean[]>(config.EVA_IP_ADDRESSES.map(() => true));

    const { sendMessage, lastMessage, connected } = useDynamicWebSocket({
        onOpen: () => {
            sendMessage(JSON.stringify({ type: 'UPTIME' }));
        },
        type: 'UPTIME'
    });

    useEffect(() => {
        if (lastMessage && connected) {
            let uptime = 0;
            try {
                uptime = JSON.parse(lastMessage.data).data;
            } catch (error) {
                console.error(error);
            }
            setUpTime(uptime);
        }
    }, [lastMessage, connected]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (connected) {
                setUpTime(prevUptime => prevUptime + 1);
            }
        }, 1000);

        const syncInterval = setInterval(() => {
            if (connected) {
                sendMessage(JSON.stringify({ type: 'UPTIME' }));
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(syncInterval);
        };
    }, [sendMessage, connected]);

    const handleVideoError = (index: number) => {
        setVideoErrors(prevErrors => {
            const newErrors = [...prevErrors];
            newErrors[index] = true;
            return newErrors;
        });
    };

    const handleVideoLoaded = (index: number) => {
        setLoading(prevLoading => {
            const newLoading = [...prevLoading];
            newLoading[index] = false;
            return newLoading;
        });
    };

    const formatUptime = (uptime: number) => {
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        return `${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
    };

    return (
        <div className='camera-view-container'>
            <div className='top-bar'>
                <div className={connected ? 'blue-dot' : 'red-dot'}></div>
                {formatUptime(uptime)}
            </div>
            <div className="content camera-content">
                {config.EVA_IP_ADDRESSES.map((ip, index) => (
                    <div key={index} className='camera'>
                        {/* {loading[index] || videoErrors[index] ? (
                            <div className="loader-container">
                                {loading[index] ?
                                    <div className="loading-container">
                                        <div className='mock-image camera'>
                                            <img src={CameraView1} alt='camera' className='image' />
                                        </div>
                                        <Spinner className="spinner" size='large' />
                                    </div> : (
                                    <img src={index === 0 ? CameraView1 : CameraView2} alt='camera' className='image' />
                                )}
                            </div>
                        ) : ( */}
                            <video 
                                src={`https://${ip}/api/holographic/stream/live_high.mp4?holo=true&pv=true&mic=false&loopback=true&RenderFromCamera=true`} 
                                autoPlay 
                                loop 
                                controls={false}
                                className='video' 
                                muted
                                onError={() => handleVideoError(index)}
                                onLoadedData={() => handleVideoLoaded(index)}
                            />
                        {/* )} */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CameraView;
