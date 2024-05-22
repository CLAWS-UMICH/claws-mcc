import React, { useEffect, useState } from "react";
import CameraView1 from '../../assets/cameraview1.jpeg';
import CameraView2 from '../../assets/cameraview2.jpeg';
import './cameraView.css';
import useDynamicWebSocket from "../../hooks/useWebSocket";
import config from "../../config";
import { Spinner } from "@fluentui/react-components";
import audioOnIcon from '../../assets/audio-on.svg';
import audioOffIcon from '../../assets/audio-off.svg';
import videoOnIcon from '../../assets/video-on.svg';
import videoOffIcon from '../../assets/video-off.svg';

const CameraView: React.FC = () => {
    const [uptime, setUpTime] = useState<number>(0);
    const [videoErrors, setVideoErrors] = useState<boolean[]>(config.EVA_IP_ADDRESSES.map(() => false));
    const [loading, setLoading] = useState<boolean[]>(config.EVA_IP_ADDRESSES.map(() => true));

    const [astronaut, setAstronaut] = useState({ name: 'Steve', color: '#006FD7' });
    const [videoOff, setVideoOff] = useState<boolean>(false);
    const [audioOff, setAudioOff] = useState<boolean>(false);

    const { sendMessage, lastMessage, connected } = useDynamicWebSocket({
        onOpen: () => {
            sendMessage(JSON.stringify({ type: 'UPTIME' }));
        },
        type: 'UPTIME'
    });
    const { sendMessage: sendAstroMessage, lastMessage: lastAstroMessage } = useDynamicWebSocket({
        onOpen: () => {
            sendAstroMessage(JSON.stringify({ type: 'GET_ASTRONAUT', id: 0 }));
        },
        type: 'ASTRONAUT'
    });

    useEffect(() => {
        if (lastAstroMessage && connected) {
            console.log({ lastAstroMessage })
            let astronautData = { name: 'Steve', color: '#006FD7' };
            try {
                astronautData = JSON.parse(lastAstroMessage.data).data;
            } catch (error) {
                console.error(error);
            }

            setAstronaut(astronautData);
        }
    }, [lastAstroMessage]);

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
                        <div className="astronaut-camera-title">
                            <div className="astronaut-letter" style={{ background: astronaut.color }}>{astronaut.name.charAt(0)}</div>
                            <div className="astronaut-name">{astronaut.name}</div>
                        </div>
                        {videoOff ? 
                            <img src={CameraView1} alt='camera' className='image' />
                        : (
                            <video 
                                src={`http://${ip}/api/holographic/stream/live_high.mp4?holo=true&pv=true&mic=true&loopback=true&RenderFromCamera=true`} 
                                autoPlay 
                                loop 
                                controls={false}
                                className='video hololens' 
                                muted={audioOff}
                                onError={() => handleVideoError(index)}
                                onLoadedData={() => handleVideoLoaded(index)}
                            />
                        )}
                        <div className="astronaut-camera-controls">
                            <button onClick={() => setVideoOff(prev => !prev)}>{videoOff ? (<img className="camera-control" src={videoOffIcon} />) : (<img className="camera-control" src={videoOnIcon} />)}</button>
                            <button onClick={() => setAudioOff(prev => !prev)}>{audioOff ? (<img className="camera-control" src={audioOffIcon} />) : (<img className="camera-control" src={audioOnIcon} />)}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CameraView;
