
import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import genealogyData from './mai-genealogy.json';
import TreeShow from './TreeShow.jsx';

//import image
import headerImg1 from './assets/mai-genealogy-icon.jpeg';

const Header = () => {
  
  const headerTransition = () => {
    document.getElementById("header-img-1").id = 'header-img-2';
    document.getElementById("body-background").classList.add("background");
    document.getElementById("header-img-2").onclick = () => {
      window.location.reload();
    };;
    const content1 = document.getElementById("content-1");
    document.getElementById("content-1").hidden = false;
    setTimeout(() => {
      content1.classList.remove("hidden");
      content1.classList.add("visible");
    }, 1000);
  }

  
  return (
    <div className='content'>
      <div className="header">
        <img id="header-img-1" src={headerImg1} alt=""
          onClick={() => headerTransition()} ></img>
      </div>
    </div>
  )
}

const App = () => {
  const [data, setData] = useState()
  const [familyData, setFamilyData] = useState([]);

  const getFamilyData = () => {
    setFamilyData(genealogyData);
  }
  useEffect(() => {
    getFamilyData();
  }, [])

  return (
    <>
      <div id='body-background'></div>
      <div id='body-content'>
        <Header />
        <TreeShow familyData={familyData} />
      </div>
    </>
  )
}

export default App