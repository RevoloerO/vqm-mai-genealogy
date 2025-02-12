import React, { useEffect, useState } from 'react';
import './TreeShow.css';
import './App.css';

const MemberTag = ({ memberData, onSelectChild, onGoBack }) => {
    const MemberInfo = ({ memberData }) => {
        return (
            <>
                <h2>{memberData['vn-name']}</h2>
                <p>--oo&#123; {memberData.dob} &#125;oo--</p>
                <div className='member-info'>
                    <ul>
                        <li>Gender: {memberData.gender === 'M' ? 'Male' :
                            memberData.gender === 'F' ? 'Female' : 'Unknown'}</li>
                        <li>Spouse:
                            <ul>
                                <li>{memberData.spouse && memberData.spouse['vn-name']}
                                    &#123;{memberData.spouse && memberData.spouse.dob}&#125;</li>
                            </ul>
                        </li>
                        <li>Children:
                            <ul>
                                {memberData.children && memberData.children.map(
                                    (child, index) => (
                                        <li key={index}>
                                            {child['vn-name']} &#123;{child.dob}&#125;
                                            <button onClick={() => onSelectChild(child)}>Select</button>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    </ul>
                </div>
                <button onClick={onGoBack}>Go Back</button>
            </>
        )
    }

    return (
        <div className='member-tag'>
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
        <div className='family-tree-banner hidden' id='banner1' >
            <div className='family-tree-content'>
                <MemberTag memberData={currentMember} onSelectChild={handleSelectChild} onGoBack={handleGoBack} />
            </div>
        </div>
    );
};

export default TreeShow;