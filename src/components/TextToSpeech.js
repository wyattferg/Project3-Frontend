import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const TextToSpeech = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [initiallySet, setInitiallySet] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Default to English or your preferred default language

  const handleToggle = () => {
    Cookies.set('text2speech', encodeURI((!isToggled).toString()), { expires: 7 });
    setIsToggled((prev) => !prev);

    const savedLanguage = Cookies.get('googtrans');
    if (savedLanguage) {
      const temp = savedLanguage.substring(4); // Extract language code from the cookie value
      if (temp === 'ru') {setCurrentLanguage("ru-RU");}
      else if (temp === 'es') {setCurrentLanguage("es-ES");}
      else if (temp === 'pl') {setCurrentLanguage("pl-PL");}
      else {
        setCurrentLanguage("en-US");
      }
    }
  };

  useEffect(() => {
    const handleMouseOver = (event) => {
      if (isToggled) {
        const targetElement = event.target;

        // Check if the target element is of a specific type (e.g., button, p, h1, etc.)
        const validTypes = ['A', 'BUTTON', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'];

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

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the speech synthesis language based on the currentLanguage
    utterance.lang = currentLanguage;

    if (text === 'Русский') {setCurrentLanguage("ru-RU");}
    else if (text === 'Español') {setCurrentLanguage("es-ES");}
    else if (text === 'Polski') {setCurrentLanguage("pl-PL");}
    else if (text === 'English') {setCurrentLanguage("en-US");}
    else {
      utterance.lang = currentLanguage;
    }

    synth.speak(utterance);
  };

  useEffect(() => {
    // Retrieve the current language from cookies
    const savedLanguage = Cookies.get('googtrans');
    if (savedLanguage) {
      const temp = savedLanguage.substring(4); // Extract language code from the cookie value
      if (temp === 'o/ru' || temp === 'ru') {setCurrentLanguage("ru-RU");}
      else if (temp === 'o/es' || temp === 'es') {setCurrentLanguage("es-ES");}
      else if (temp === 'o/pl' || temp === 'pl') {setCurrentLanguage("pl-PL");}
      else {
        setCurrentLanguage("en-US");
      }

      if (!initiallySet) {
        if (Cookies.get('text2speech') === 'true') {
          setIsToggled(true);
        }
        setInitiallySet(true);
      }
    }
  }, []);

  return {
    isToggled,
    handleToggle,
  };
};

export default TextToSpeech;
