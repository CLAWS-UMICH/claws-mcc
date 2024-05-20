import React, { useState } from 'react';
import './task-list.css';

interface ProgressBarProps {
  progress: number;
  maxValue?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, maxValue = 100 }) => {
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const updateProgress = async () => {
    let progressValue = 0;
    while (progressValue < progress) {
      progressValue += 5;
      setProgressBarWidth(progressValue);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    // Check for progress reaching 0
    if (progress === 0) {
      setProgressBarWidth(0);
    }
  };

  // Simulate progress update (replace with your logic)
  React.useEffect(() => {
    const updateProgress = async () => {
      let progressValue = 0;
      while (progressValue < progress) {
        progressValue += 5;
        setProgressBarWidth(progressValue);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      // Check for progress reaching 0
      if (progress === 0) {
        setProgressBarWidth(0);
      }
    };
    updateProgress(); // Call updateProgress after state update
  }, [progress]); // Dependency array with progress

  const progressBarStyle: React.CSSProperties = {
    width: `${progressBarWidth}%`,
    height: '100%',
    backgroundColor: '#007bff',
    transition: 'width 0.5s ease-in-out',
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin={0} aria-valuemax={maxValue}></div>
    </div>
  );
};

export default ProgressBar;
