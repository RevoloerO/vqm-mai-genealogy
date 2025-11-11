import { useState } from 'react';
import './HomePage.css';
import genealogyData from './mai-genealogy.json';
import TreeShow from './TreeShow.jsx';

// You can find this image in your original project's assets folder
import headerImg1 from './assets/mai-genealogy-icon.jpeg'; 

const HomePage = () => {
  const [familyData] = useState(genealogyData);
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('fade-in');

  const showTree = () => {
    setAnimationClass('fade-out');
    setTimeout(() => {
      setIsTreeVisible(true);
    }, 500); // Duration of the fade-out animation
  };

  // The Welcome screen view
  const WelcomeScreen = () => (
    <div className={`welcome-container ${animationClass}`}>
      <h1>The Mai Family Genealogy</h1>
      <p>A Journey Through Generations</p>
      <img 
        id="header-img-1" 
        src={headerImg1} 
        alt="Mai Family Crest" 
        onClick={showTree} 
        title="Enter the Family Tree"
      />
    </div>
  );

  return (
    <div id='body-content'>
      <div id='body-background'></div>
      {!isTreeVisible ? (
        <WelcomeScreen />
      ) : (
        <TreeShow familyData={familyData} />
      )}
    </div>
  );
};

export default HomePage;
