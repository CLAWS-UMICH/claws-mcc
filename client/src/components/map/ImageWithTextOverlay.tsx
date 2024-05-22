import React from 'react';

export default function ImageWithTextOverlay({ src, alt, text, point }) {
    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        top: point.y,
        left: point.x,
        zIndex: 4,
        width: '18px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const textStyle: React.CSSProperties = {
        position: 'absolute',
        color: 'white', // You can change this to your desired text color
        fontSize: '10px', // Adjust font size as needed
        textAlign: 'center',
    };

    return (
        <div style={containerStyle}>
            <img src={src} alt={alt} style={{ width: '100%', height: '100%' }} />
            <div style={textStyle}>{text}</div>
        </div>
    );
};