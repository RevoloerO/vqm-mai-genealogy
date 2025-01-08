
import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
const Information = () =>{
  return (
    <div id='family-tree'>

    </div>
  )
}
const Header = () =>{
  const headerTransition = () => {
    document.getElementById("header-img-1").id = 'header-img-2';
    document.getElementById("body-background").classList.add("background");
  } 
  return (
    <div id='content'>
      <div className="header">
        <img id="header-img-1" src="/src/assets/mai-genealogy-icon.jpeg" alt="" 
        onClick={() => headerTransition()} ></img>
      </div>
      <Information />
    </div> 
  )
}

const App = () => {
  const [data,setData] = useState()

  useEffect(()=>{
    console.log('effect')
  })

  return (
    <div id='body-content'>
      <div id='body-background'></div>
      <Header />
    </div>
  )
}

export default App