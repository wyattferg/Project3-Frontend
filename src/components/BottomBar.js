import React, { useState } from 'react';
import './BottomBar.css';
import Translate from './googleTranslate';
import WeatherComponent from './weather';

const BottomBar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.classList.add('popup-open');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove('popup-open');
  };

  return (
    <>
      <footer>
        <div className="weather">
          <WeatherComponent />
        </div>
        <div className="accessibility">
          <div className="img-container">
            <img id='acc-img' src='Images/accessibility.png' alt='accessibility'></img>
            <img id='acc-img-hov' src='Images/accessibility-hover.png' onClick={openPopup} alt='accessibility (hover)'></img>
          </div>
        </div>
        <div className="translate">
          <Translate />
        </div>
      </footer>

      {isPopupOpen && (
        <div className="A-Popup">
          <div className="A-Popup-Content">
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomBar;
