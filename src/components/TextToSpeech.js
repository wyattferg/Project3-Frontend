import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

/**
 * Represents a component for text-to-speech functionality.
 * @function
 * @returns {Object} An object with properties related to text-to-speech.
 */
const TextToSpeech = () => {
  /**
   * Represents the toggle state for text-to-speech.
   * @type {boolean}
   */
  const [isToggled, setIsToggled] = useState(false);

  /**
   * Represents the flag to track whether initially set or not.
   * @type {boolean}
   */
  const [initiallySet, setInitiallySet] = useState(false);

  /**
   * Represents the current language for text-to-speech.
   * @type {string} - Language code (e.g., 'en-US', 'ru-RU').
   * Default to English or your preferred default language.
   */
  const [currentLanguage, setCurrentLanguage] = useState('en');

  /**
   * Handles the toggle action for text-to-speech.
   * @function
   */
  const handleToggle = () => {
    // Set the cookie for text-to-speech toggle state
    Cookies.set('text2speech', encodeURI((!isToggled).toString()), { expires: 7 });
    setIsToggled((prev) => !prev);

    // Retrieve and set the language based on the 'googtrans' cookie
    const savedLanguage = Cookies.get('googtrans');
    if (savedLanguage) {
      const temp = savedLanguage.substring(4); // Extract language code from the cookie value
      if (temp === 'ru') { setCurrentLanguage("ru-RU"); }
      else if (temp === 'es') { setCurrentLanguage("es-ES"); }
      else if (temp === 'pl') { setCurrentLanguage("pl-PL"); }
      else {
        setCurrentLanguage("en-US");
      }
    }
  };

  /**
   * Handles the mouseover event for text-to-speech functionality.
   * @function
   * @param {Event} event - The mouseover event.
   */
  useEffect(() => {
    const handleMouseOver = (event) => {
      if (isToggled) {
        const targetElement = event.target;

        // Check if the target element is of a specific type (e.g., button, p, h1, etc.)
        const validTypes = ['SELECT', 'A', 'BUTTON', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'];

        if (validTypes.includes(targetElement.tagName)) {
          const text = targetElement.innerText;
          speakText(text);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isToggled, currentLanguage]);

  /**
   * Speaks the provided text using the Web Speech API.
   * @function
   * @param {string} text - The text to be spoken.
   */
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Set the speech synthesis language based on the currentLanguage
    utterance.lang = currentLanguage;

    // Update the current language based on specific text
    if (text === 'Русский') { setCurrentLanguage("ru-RU"); }
    else if (text === 'Español') { setCurrentLanguage("es-ES"); }
    else if (text === 'Polski') { setCurrentLanguage("pl-PL"); }
    else if (text === 'English') { setCurrentLanguage("en-US"); }

    synth.speak(utterance);
  };

  /**
   * Retrieves the current language from cookies and sets initial state.
   * @function
   */
  useEffect(() => {
    // Retrieve the current language from cookies
    const savedLanguage = Cookies.get('googtrans');
    if (savedLanguage) {
      const temp = savedLanguage.substring(4); // Extract language code from the cookie value
      if (temp === 'o/ru' || temp === 'ru') { setCurrentLanguage("ru-RU"); }
      else if (temp === 'o/es' || temp === 'es') { setCurrentLanguage("es-ES"); }
      else if (temp === 'o/pl' || temp === 'pl') { setCurrentLanguage("pl-PL"); }
      else {
        setCurrentLanguage("en-US");
      }

      // Set initial state based on cookies
      if (!initiallySet) {
        if (Cookies.get('text2speech') === 'true') {
          setIsToggled(true);
        }
        setInitiallySet(true);
      }
    }
  }, []);

  /**
   * Returns an object with properties related to text-to-speech.
   * @returns {Object} - An object with properties `isToggled` and `handleToggle`.
   */
  return {
    isToggled,
    handleToggle,
  };
};

export default TextToSpeech;
