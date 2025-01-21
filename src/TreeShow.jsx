import React from 'react';
import './TreeShow.css';
import './App.css';

const MemberTag = ({ memberData }) => {
    //console.log(memberData.children[0]["vn-name"]);
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
                                    (child, index) => (<li key={index}>{child['vn-name']} &#123;{child.dob}&#125;</li>))}
                            </ul>
                        </li>
                    </ul>
                </div>
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
    //console.log(familyData['spouse']['vn-name']);
    return (
        <div className='family-tree-banner hidden' id='banner1' >
            <div className='family-tree-content'>
                <MemberTag memberData={familyData} />
            </div>
        </div>

    );
};

export default TreeShow;