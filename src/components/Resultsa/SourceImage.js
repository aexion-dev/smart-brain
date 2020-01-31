import React from 'react';
import './SourceImage.css'

const SourceImage = ({ imageURL, box }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt4'>
        <img id='inputimage' src={imageURL} alt='' width='500px' height='auto'/>
        <div
          style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}
          className='bounding-box'></div>
      </div>
    </div>
  );
}

export default SourceImage;
