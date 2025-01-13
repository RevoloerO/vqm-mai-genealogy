import React from 'react';
import './TreeShow.css';
import './App.css';

const MemberTag = ({ memberData }) => {
    return (
        <div className='member-tag'>
            <h2>{memberData['vn-name']}</h2>
            <p>--oo&#123; {memberData.dob} &#125;oo--</p>
            <div className='member-info'>
                <ul>
                    <li>Gender: {memberData.gender === 'M' ? 'Male' :
                        memberData.gender === 'F' ? 'Female' : 'Unknown'}</li>
                    <li>Spouse: {memberData.spouse && memberData.spouse['vn-name']}</li>
                    <li>DOB: {memberData.dob}</li>
                </ul>
            </div>
        </div>
    )
}

const TreeShow = ({ familyData }) => {
    //console.log(familyData['spouse']['vn-name']);
    return (
        <div className='family-tree-banner hidden' id='banner1' hidden={true} >
            <div className='family-tree-content'>
                <MemberTag memberData={familyData} />
            </div>
        </div>

    );
};

export default TreeShow;