import React from "react"
import CameraView1 from '../../assets/cameraview1.jpeg';
import CameraView2 from '../../assets/cameraview2.jpeg';
import './cameraView.css';

// TODO: Implement
const CameraView: React.FC = props => {
    return(
        <div className='camera-view-container'>
            <div className='top-bar'>
                <div className='blue-dot'></div>
                01:05:18
            </div>
            <div className="content camera-content">
                <div className='top-image camera'>
                    <img src={CameraView1} alt='camera' className='image'/>
                </div>
                <div className='bottom-image camera'>
                <img src={CameraView2} alt='camera' className='image'/>
                </div>
            </div>
        </div>
    )
}


export default CameraView;