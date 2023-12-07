import React, { useEffect, useState } from 'react';
import './BottomBar.css';
import Translate from './googleTranslate';
import WeatherComponent from './weather';
import TextToSpeech from './TextToSpeech';
import { useZoom } from './ZoomContext';

/**
 * Represents the BottomBar component.
 * @function
 * @returns {JSX.Element} The JSX representation of the BottomBar.
 */
const BottomBar = () => {
  /**
   * State to track whether the accessibility popup is open.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /**
   * Text-to-Speech state and functions.
   * @type {Object}
   * @property {boolean} isToggled - Indicates whether Text-to-Speech is toggled on.
   * @property {Function} handleToggle - Function to toggle Text-to-Speech.
   */
  const { isToggled, handleToggle } = TextToSpeech();

  /**
   * Zoom-related state and functions obtained from ZoomContext.
   * @type {Object}
   * @property {number} textSize - Current text size for zoom.
   * @property {Function} setTextSize - Function to set the text size for zoom.
   */
  const { textSize, setTextSize } = useZoom();

  /**
   * Opens the accessibility popup and adds a CSS class to the body.
   * @function
   * @returns {void}
   */
  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.classList.add('popup-open');
  };

  /**
   * Closes the accessibility popup and removes the CSS class from the body.
   * @function
   * @returns {void}
   */
  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove('popup-open');
  };

  return (
    <>
      <footer>
        <div className="weather">
          {/* Weather component */}
          <WeatherComponent />
        </div>
        <div className="accessibility">
          {/* Accessibility images with hover effect */}
          <div className="img-container">
            <img id='acc-img' src='Images/accessibility.png' alt='accessibility'></img>
            <img id='acc-img-hov' src='Images/accessibility-hover.png' onClick={openPopup} alt='accessibility (hover)'></img>
          </div>
        </div>
        <div className="translate">
          {/* Translate component */}
          <Translate />
        </div>
      </footer>

      {isPopupOpen && (
        // Accessibility Popup
        <div className="A-Popup">
          <div className="A-Popup-Content">
            <h2>Accessibility Options</h2>
            <br />
            <div className="zoomDiv">
              <h5>Zoom:</h5>
              {/* Input range for zoom control */}
              <input
                type="range"
                min="0.9"
                max="1.4"
                step="0.1"
                value={textSize}
                onChange={(e) => {
                  const newSize = parseFloat(e.target.value);
                  setTextSize(newSize);
                  localStorage.setItem('textSize', newSize.toString());
                }}
              />
              <span>{textSize.toFixed(1)}</span>
            </div>
            <br />
            <div className="ttsButton">
              {/* Button to toggle Text-to-Speech */}
              <button onClick={handleToggle}>
                {isToggled ? 'Turn Off Text-to-Speech' : 'Turn On Text-to-Speech'}
              </button>
            </div>
            {/* Button to close the accessibility popup */}
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomBar;
