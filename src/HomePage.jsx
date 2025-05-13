import { useState } from 'react';
import './HomePage.css';
import { useEffect } from 'react';
import genealogyData from './mai-genealogy.json';
import TreeShow from './TreeShow.jsx';
import { useNavigate } from 'react-router-dom';

//import image
import headerImg1 from './assets/mai-genealogy-icon.jpeg';

const Header = ({ onLanguageChange }) => {
  const navigate = useNavigate();
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
    const themeBtn = document.getElementById("theme-selection");

    setTimeout(() => {
      content1.classList.remove("hidden");
      content1.classList.add("visible");
    }, 1000);

    document.getElementById("header-img-2").onclick = () => {
      const isVisible = btn1.classList.contains("visible");
      if (isVisible) {
        btn1.classList.remove("visible");
        btn2.classList.remove("visible");
        themeBtn.classList.remove("visible");
      } else {
        btn1.classList.add("visible");
        btn2.classList.add("visible");
        themeBtn.classList.add("visible");
      }
    };
  }

  const swapTheme = () => {
    const root = document.documentElement;
    const isDefaultTheme = root.style.getPropertyValue('--background-color') === '#F5F5DC'; // Default theme background color
  
    if (isDefaultTheme) {
      // Apply Dark Green Wood Palette
      root.style.setProperty('--background-color', '#1e1e1b');
      root.style.setProperty('--primary-accent', '#556b2f');
      root.style.setProperty('--secondary-accent', '#3e5f3c');
      root.style.setProperty('--highlight-color', '#d2b48c');
      root.style.setProperty('--text-color', '#e6e6e6');
      root.style.setProperty('--soft-accent', '#78866b');
      root.style.setProperty('--deep-accent', '#2f4f4f');
    } else {
      // Revert to Default Theme
      root.style.setProperty('--background-color', '#F5F5DC');
      root.style.setProperty('--primary-accent', '#708090');
      root.style.setProperty('--secondary-accent', '#4682B4');
      root.style.setProperty('--highlight-color', '#FFD700');
      root.style.setProperty('--text-color', '#2C2C2C');
      root.style.setProperty('--soft-accent', '#B0E0E6');
      root.style.setProperty('--deep-accent', '#2F4F4F');
    }
  };

  return (
    <div className='header-content'>
      <div className="header">
        <button className="header-btn hidden" id="btn-1" onClick={() => { }} >Xem gia phả</button>
        <button className="header-btn hidden" id="theme-selection" onClick={swapTheme}>Theme Selection</button>
        <img id="header-img-1" src={headerImg1} alt="" onClick={() => headerTransition()} ></img>
        <button className="header-btn hidden" id="btn-2" onClick={resetPage}>Reload</button>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button className="lang-btn hidden" onClick={() => onLanguageChange('vn')}>VN</button>
        <button className="lang-btn hidden" onClick={() => onLanguageChange('en')}>EN</button>
        
      </div>
    </div>
  )
}

const HomePage = () => {
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
      <div id='body-background' ></div>
      <div id='body-content' >
        <Header onLanguageChange={handleLanguageChange} />
        {language === 'vn' ? <TreeShow familyData={familyData} /> : <TreeShowEn familyData={familyData} />}
      </div>
    </>
  )
}

export default HomePage;