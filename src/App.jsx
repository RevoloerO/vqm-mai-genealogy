import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import genealogyData from './mai-genealogy.json';
import TreeShow from './TreeShow.jsx';
import TreeShowEn from './TreeShow-en.jsx';

//import image
import headerImg1 from './assets/mai-genealogy-icon.jpeg';

const Header = ({ onLanguageChange }) => {
  const resetPage = () => {
    document.getElementById('body-content').classList.add('fade-out');
    setTimeout(() => {
      window.location.reload();
    }, 1600);
  }

  const headerTransition = () => {
    document.getElementById("header-img-1").id = 'header-img-2';
    document.getElementById("body-background").classList.add("background");
    const content1 = document.getElementById("banner1");
    const btn1 = document.getElementById("btn-1");
    const btn2 = document.getElementById("btn-2");

    setTimeout(() => {
      content1.classList.remove("hidden");
      content1.classList.add("visible");
    }, 1000);
    addEventListener
    document.getElementById("header-img-2").onClick = () => {
      btn1.classList.remove("hidden");
      btn2.classList.remove("hidden");
    }
  }

  return (
    <div className='content'>
      <div className="header">
        <button className="header-btn hidden" id="btn-1" onClick={() => { }} >Xem gia phả</button>
        <img id="header-img-1" src={headerImg1} alt="" onClick={() => headerTransition()} ></img>
        <button className="header-btn hidden" id="btn-2" onClick={resetPage}>Reload</button>
        
      </div>
      <button className="lang-btn hidden" onClick={() => onLanguageChange('vn')}>VN</button>
        <button className="lang-btn hidden" onClick={() => onLanguageChange('en')}>EN</button>

    </div>
  )
}

const App = () => {
  const [data, setData] = useState()
  const [familyData, setFamilyData] = useState([]);
  const [language, setLanguage] = useState('vn');

  const getFamilyData = () => {
    setFamilyData(genealogyData);
  }

  useEffect(() => {
    getFamilyData();
  }, [])

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  }

  return (
    <>
      <div id='body-background'></div>
      <div id='body-content'>
        <Header onLanguageChange={handleLanguageChange} />
        {language === 'vn' ? <TreeShow familyData={familyData} /> : <TreeShowEn familyData={familyData} />}
      </div>
    </>
  )
}

export default App;