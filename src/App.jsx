
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LanguageProvider } from './LanguageContext.jsx';
import HomePage from './HomePage.jsx';
import Timeline from './Timeline.jsx';
import TreeText from './TreeText.jsx';

const PageTransition = ({ children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('fade-out');
    }
  }, [children, displayChildren]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'fade-out') {
      setDisplayChildren(children);
      setTransitionStage('fade-in');
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleTransitionEnd}
    >
      {displayChildren}
    </div>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <LanguageProvider>
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/vqm-mai-genealogy/" element={<HomePage />} />
          <Route path="/vqm-mai-genealogy/timeline" element={<Timeline />} />
          <Route path="/vqm-mai-genealogy/tree-text" element={<TreeText />} />
        </Routes>
      </PageTransition>
    </LanguageProvider>
  )
}

export default App;