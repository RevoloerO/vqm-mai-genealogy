
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import HomePageVN from './HomePageVN.jsx';

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path="/vqm-mai-genealogy/" element={<HomePage />} />
        <Route path="/vqm-mai-genealogy/en" element={<HomePage />} />
        <Route path="/vqm-mai-genealogy/vn" element={<HomePageVN />} />
      </Routes>
    </>
  )
}

export default App;