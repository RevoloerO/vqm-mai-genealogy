import React from 'react';
import './TreeShow.css';
import './App.css';

const TreeShow = ({ familyData }) => {
    //console.log(familyData['spouse']['vn-name']);
    return (
        <div className='content hidden' id='content-1' hidden={true}>
            <div className='family-tree-banner' >
                <div className='family-tree-content'>
                    <div className='member-tag'>
                        <h2>{familyData['vn-name']}</h2>
                        <p>--oo&#123; {familyData.dob} &#125;oo--</p>
                        <div className='member-info'>
                            <ul>
                                <li>Gender: {familyData.gender === 'M' ? 'Male' : familyData.gender === 'F' ? 'Female' : 'Unknown'}</li>
                                <li>Spouse: {familyData.spouse && familyData.spouse['vn-name']}</li>
                                <li>DOB: {familyData.dob}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeShow;