import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
import Cookies from 'js-cookie';
import './googleTranslate.css';

function Translate() {
  const languages = [
    {label: 'English', value:'/auto/en'},
    {label: `Русский`, value:'/auto/ru'},
    {label: 'Polski', value:'/auto/pl'} ];
  
  const [selected, setSelected] = useState(null);
  const [currentLang, setCurrentLang] = useState(null);
  
  useEffect(() => {
    /*global googleTranslateElementInit*/
    window.googleTranslateElementInit = googleTranslateElementInit;
  
    if (Cookies.get('googtrans') != null) {
      setSelected(Cookies.get('googtrans'));
      var temp = Cookies.get('googtrans').substring(4);
      if (temp === 'ru') {setCurrentLang('Русский');}
      else if (temp === 'pl') {setCurrentLang('Polski');}

    } else {
      setSelected('/auto/en');
      setCurrentLang('English');
    }
  }, [])
  

  const langChange=(e,m,evt)=>{
    evt.preventDefault()
    if(Cookies.get('googtrans') != null){
      Cookies.set('googtrans', encodeURI(e), { expires: 7 });
      setSelected(e);
    }
    else{
      Cookies.set('googtrans',e);
      setSelected(e);
    }
    window.location.reload();
  }

  return (
    <div className="translate-wrapper">
      <div id="google_translate_element"></div>
      <div id="drop-down-translate"></div>
      <SelectPicker
        data={languages}
        style={{ width: 100, backgroundColor: '#2c2c2c', color: 'white', borderRadius: 8 }}
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
