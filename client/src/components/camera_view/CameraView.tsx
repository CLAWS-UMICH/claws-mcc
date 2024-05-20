import React, { useEffect, useState } from "react";
import CameraView1 from '../../assets/cameraview1.jpeg';
import CameraView2 from '../../assets/cameraview2.jpeg';
import './cameraView.css';
import useDynamicWebSocket from "../../hooks/useWebSocket";
import config from "../../config";

const CameraView: React.FC = () => {
    const [uptime, setUpTime] = useState<number>(0);
    const [videoError, setVideoError] = useState<boolean>(false);

    const { sendMessage, lastMessage } = useDynamicWebSocket({
        onOpen: () => {
            sendMessage(JSON.stringify({ type: 'UPTIME' }));
        },
        type: 'UPTIME'
    });

    useEffect(() => {
        if (lastMessage) {
            let uptime = 0;
            try {
                uptime = JSON.parse(lastMessage.data).data;
            } catch (error) {
                console.error(error);
            }
            setUpTime(uptime);
        }
    }, [lastMessage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setUpTime(prevUptime => prevUptime + 1);
        }, 1000);

        const syncInterval = setInterval(() => {
            sendMessage(JSON.stringify({ type: 'UPTIME' }));
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(syncInterval);
        };
    }, [sendMessage]);

    useEffect(() => {
        const checkVideoFeeds = async () => {
            if (config.EVA_IP_ADDRESSES.length === 0) {
                setVideoError(true);
                return;
            }

            setVideoError(false);
        };

        checkVideoFeeds();
    }, []);

    useEffect(() => {
        const playVideos = () => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video.paused) {
                    video.play().catch(error => console.error('Error playing video:', error));
                }
            });
        };

        playVideos();

        const interval = setInterval(() => {
            playVideos();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatUptime = (uptime: number) => {
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        return `${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
    };

    return (
        <div className='camera-view-container'>
            <div className='top-bar'>
                <div className='blue-dot'></div>
                {formatUptime(uptime)}
            </div>
            <div className="content camera-content">
                {videoError ? (
                    <>
                        <div className='top-image camera'>
                            <img src={CameraView1} alt='camera' className='image' />
                        </div>
                        <div className='bottom-image camera'>
                            <img src={CameraView2} alt='camera' className='image' />
                        </div>
                    </>
                ) : (
                    config.EVA_IP_ADDRESSES.map((ip, index) => (
                        <div key={index} className='camera'>
                            <video 
                                src={`http://${ip}/api/holographic/stream/live_high.mp4?holo=true&pv=true&mic=false&loopback=true&RenderFromCamera=true`} 
                                autoPlay 
                                loop 
                                controls={false}
                                className='video' 
                                muted
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CameraView;
