import React from 'react';
import './satellite-loader.css';

const SatelliteLoader: React.FC = () => {
  return (
    <div className="orbit-container">
      <div className="planet">🌍</div>
      <div className="orbit">
        <div className="rocket">🚀</div>
      </div>
    </div>
  );
};

export default SatelliteLoader;
