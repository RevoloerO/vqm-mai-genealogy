import { useState, useEffect } from 'react';
import './HomePage.css';
import genealogyData from './mai-genealogy.json';
import TreeShowVN from './TreeShowVN.jsx';
import { useNavigate } from 'react-router-dom';

//import image
import headerImg1 from './assets/mai-genealogy-icon.jpeg';

const Header = () => {
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
        <div className='header-content'>
            <div className="header">
                <button className="header-btn hidden" id="btn-1" onClick={() => { }} >Xem gia phả</button>
                <img id="header-img-1" src={headerImg1} alt="" onClick={() => headerTransition()} ></img>
                <button className="header-btn hidden" id="btn-2" onClick={resetPage}>Reload</button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button className="lang-btn " onClick={() => { navigate('/vqm-mai-genealogy/en') }}>Switch to EN</button>
            </div>
        </div>
    )
}

const HomePageVN = () => {
    const [familyData, setFamilyData] = useState([]);

    const getFamilyData = () => {
        setFamilyData(genealogyData);
    }

    useEffect(() => {
        getFamilyData();
    }, [])

    return (
        <>
            <div id='body-background' ></div>
            <div id='body-content' >
                <Header />
                <TreeShowVN familyData={familyData} />
            </div>
        </>
    )
}

export default HomePageVN;
