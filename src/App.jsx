
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import Timeline from './Timeline.jsx';

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/vqm-mai-genealogy/" element={<HomePage />} />
        <Route path="/vqm-mai-genealogy/timeline" element={<Timeline />} />
      </Routes>
    </>
  )
}

export default App;