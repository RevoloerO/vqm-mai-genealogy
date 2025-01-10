
import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import genealogyData from './mai-genealogy.json';

//import image
import headerImg1 from './assets/mai-genealogy-icon.jpeg';

const Information = ({ familyData }) => {
  console.log({familyData});
  return (
    <div id='family-tree'>
      <h1>MAI Family Tree</h1>
      <div id='family-root'>
        <div id='family-tree-content-1'>
          <h2>Family Tree</h2>
          <ul>
            {familyData.id}
          </ul>
        </div>
      </div>

    </div>
  )
}
const Header = () => {
  const headerTransition = () => {
    document.getElementById("header-img-1").id = 'header-img-2';
    document.getElementById("body-background").classList.add("background");
  }
  return (
    <div id='content'>
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
    <div id='body-content'>
      <div id='body-background'></div>
      <Header />
      {familyData && familyData.length > 0 && data.map((item)=><p>{item.about}</p>)}
      <Information familyData={familyData} />
    </div>
  )
}

export default App