import React from "react"
import CameraView1 from '../../assets/CameraView1';
import CameraView2 from '../../assets/';

// TODO: Implement
const CameraView: React.FC = props => {
    return(
        <div className='camera-view-container'>
            <div className='top-image'>
                <img src={CameraView1} alt="camera"/>
            </div>

            <div className='bottom-image'>
                <img src={CameraView2} alt="camera"/>
            </div>
        </div>
    )
}
