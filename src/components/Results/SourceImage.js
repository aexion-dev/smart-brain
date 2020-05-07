import React from 'react';
import './SourceImage.css'

const SourceImage = ({ imageURL, boxes }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt4'>
        <img id='inputimage' src={imageURL} alt='' width='500px' height='auto'/>
        {boxes.map((faceIndex, index) => {
          return <div
              style={{top: faceIndex.topRow, right: faceIndex.rightCol, bottom: faceIndex.bottomRow, left: faceIndex.leftCol}}
              key={index}
              className='bounding-box'></div>
        })}
      </div>
    </div>
  );
}

export default SourceImage;
