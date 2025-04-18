import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Import the left arrow icon
import './TreeShow.css';
import './App.css';

const MemberTag = ({ memberData, onSelectChild, onGoBack }) => {
    const MemberInfo = ({ memberData }) => {
        return (
            <div className="member-info-container">
                <div className="honor-title">
                    <h2 className="member-name">{memberData['vn-name']}</h2>
                    <p className="member-dob">--oo&#123; {memberData.dob} &#125;oo--</p>
                </div>
                <div className='member-info'>
                    <ul className="info-list">
                        <li><h4>Giới tính (Gender):</h4> {memberData.gender === 'M' ? '♂ Nam' :
                            memberData.gender === 'F' ? '♀ Nữ' : 'Unknown'}</li>
                        <li><h4>Người Phối Ngẫu (Spouse): </h4>
                            <ul>
                                <li>{memberData.spouse && memberData.spouse['vn-name']} &#123;{memberData.spouse && memberData.spouse.dob}&#125;</li>
                            </ul>
                        </li>
                        <li><h4>Con (Children):</h4>
                            <ol className="children-list"> {/* Changed from ul to ol */}
                                {memberData.children && memberData.children.map(
                                    (child, index) => (
                                        <li key={index}>
                                            <button className='child-btn modern-btn' onClick={() => onSelectChild(child)}>
                                                {child['vn-name']} &#123;{child.dob}&#125;
                                            </button>
                                        </li>
                                    ))}
                            </ol>
                        </li>
                        <button className="go-back-btn modern-btn" onClick={onGoBack}>
                            <FaArrowLeft /> {/* Use the left arrow icon */}
                        </button>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className='member-tag vintage-card'>
            {memberData ? <MemberInfo memberData={memberData} /> : null}
        </div>
    )
}

const TreeShow = ({ familyData }) => {
    const [currentMember, setCurrentMember] = useState(familyData);
    const [history, setHistory] = useState([]);

    const handleSelectChild = (child) => {
        setHistory([...history, currentMember]);
        setCurrentMember(child);
    };

    const handleGoBack = () => {
        if (history.length > 0) {
            const previousMember = history.pop();
            setCurrentMember(previousMember);
            setHistory([...history]);
        }
    };

    useEffect(() => {
        setCurrentMember(familyData);
    }, [familyData]);

    return (
        <div className='family-tree-banner hidden' id='banner1'>
            <div className='family-tree-content vintage-background'>
                <MemberTag memberData={currentMember} onSelectChild={handleSelectChild} onGoBack={handleGoBack} />
            </div>
        </div>
    );
};

export default TreeShow;