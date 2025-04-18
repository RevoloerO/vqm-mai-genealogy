
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';


const App = () => {
  
  return (
    <>
      <Routes>
        <Route path="/vqm-mai-genealogy/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App;