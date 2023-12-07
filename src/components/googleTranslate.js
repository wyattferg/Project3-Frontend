import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
import Cookies from 'js-cookie';
import './googleTranslate.css';

/**
 * React component for language translation.
 * @component
 */
function Translate() {
  /**
   * An array of language options.
   * @type {Array<{label: string, value: string}>}
   */
  const languages = [
    { label: 'English', value: '/auto/en' },
    { label: 'Español', value: '/auto/es' },
    { label: `Русский`, value: '/auto/ru' },
    { label: 'Polski', value: '/auto/pl' }
  ];

  /**
   * State hook for the selected language value.
   * @type {string|null}
   */
  const [selected, setSelected] = useState(null);

  /**
   * State hook for the current language label.
   * @type {string|null}
   */
  const [currentLang, setCurrentLang] = useState(null);

  /**
   * Effect hook for initializing the Google Translate element.
   */
  useEffect(() => {
    /*global googleTranslateElementInit*/
    window.googleTranslateElementInit = googleTranslateElementInit;

    if (Cookies.get('googtrans') != null) {
      setSelected(Cookies.get('googtrans'));
      var temp = Cookies.get('googtrans').substring(4);
      if (temp === 'ru') { setCurrentLang('Русский'); }
      else if (temp === 'es') { setCurrentLang('Español'); }
      else if (temp === 'pl') { setCurrentLang('Polski'); }

    } else {
      setSelected('/auto/en');
      setCurrentLang('English');
    }
  }, []);

  /**
   * Handler function for language change.
   * @param {string} e - The selected language value.
   * @param {React.MouseEvent} m - The mouse event.
   * @param {React.MouseEvent} evt - The React mouse event.
   */
  const langChange = (e, m, evt) => {
    evt.preventDefault();
    if (Cookies.get('googtrans') != null) {
      Cookies.set('googtrans', encodeURI(e), { expires: 7 });
      setSelected(e);
    }
    else {
      Cookies.set('googtrans', e);
      setSelected(e);
    }
    window.location.reload();
  };

  /**
   * Render method for the Translate component.
   * @returns {JSX.Element} JSX representation of the component.
   */
  return (
    <div className="translate-wrapper">
      <div id="google_translate_element"></div>
      <div id="drop-down-translate"></div>
      <SelectPicker
        data={languages}
        style={{ width: 'auto', backgroundColor: '#2c2c2c', color: 'white', borderRadius: 8 }}
        placement="topEnd"
        cleanable={false}
        value={selected}
        searchable={false}
        className={'notranslate'}
        menuClassName={'notranslate'}
        menuStyle={{ width: 100, backgroundColor: '#2c2c2c', color: 'white', borderRadius: 8 }}
        onSelect={(e, m, evt) => langChange(e, m, evt)}
        placeholder={currentLang}
        container={() => document.getElementById('drop-down-translate')}
      />
    </div>
  );
}

export default Translate;
