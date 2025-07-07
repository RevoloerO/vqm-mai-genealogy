import React, { useEffect, useState } from 'react';
import './TreeShow.css';

// A placeholder for a profile image, using a simple SVG silhouette.
const ProfileImagePlaceholder = ({ gender }) => {
    const maleSilhouette = "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";
    const femaleSilhouette = "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z";
    const pathData = gender === 'M' ? maleSilhouette : femaleSilhouette;

    return (
        <div className="profile-image-placeholder">
            <svg viewBox="0 0 24 24">
                <path d={pathData} fill="currentColor" />
            </svg>
        </div>
    );
};


// A card for displaying a main family member or their spouse, redesigned for elegance.
const MemberCard = ({ member, isSpouse = false }) => {
    if (!member) return null;
    const genderClass = member.gender === 'M' ? 'male' : 'female';
    return (
        <div className={`member-card ${genderClass}`}>
            <ProfileImagePlaceholder gender={member.gender} />
            <div className="member-details">
                 <h2 className="member-name">{member['vn-name']}</h2>
                 <p className="member-dob">{member.dob ? `Born: ${member.dob}` : ' '}</p>
                 <div className="decorative-line"></div>
            </div>
        </div>
    );
};

// An item for the children list view.
const ChildListItem = ({ child, onSelectChild }) => {
    const hasChildren = child.children && child.children.length > 0;
    const genderSymbol = child.gender === 'M' ? '♂' : child.gender === 'F' ? '♀' : '';

    return (
        <li
            className={`child-list-item ${hasChildren ? 'clickable' : ''}`}
            onClick={() => hasChildren && onSelectChild(child)}
            title={hasChildren ? `View ${child['vn-name']}'s family` : ''}
        >
            <span className="child-gender">{genderSymbol}</span>
            <div className="child-info">
                <span className="child-name">{child['vn-name']}</span>
                {child.spouse && <span className="spouse-info"> & {child.spouse['vn-name']}</span>}
            </div>
            {hasChildren && <span className="child-action-indicator">→</span>}
        </li>
    );
};

// A card for displaying a child in the grid view.
const ChildGridCard = ({ child, onSelectChild }) => {
    const hasChildren = child.children && child.children.length > 0;

    return (
        <div
            className={`child-grid-card ${hasChildren ? 'clickable' : ''}`}
            onClick={() => hasChildren && onSelectChild(child)}
            title={hasChildren ? `View ${child['vn-name']}'s family` : ''}
        >
            <ProfileImagePlaceholder gender={child.gender} />
            <div className="child-card-details">
                <h4 className="child-name-grid">{child['vn-name']}</h4>
                {child.dob && <p className="child-dob-grid">{child.dob}</p>}
                {child.spouse && <p className="spouse-info-grid">& {child.spouse['vn-name']}</p>}
            </div>
             {hasChildren && <span className="child-action-indicator-grid">View Family</span>}
        </div>
    );
};


const TreeShow = ({ familyData }) => {
    const [currentMember, setCurrentMember] = useState(familyData);
    const [history, setHistory] = useState([]);
    const [animationClass, setAnimationClass] = useState('fade-in');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list', default to 'grid'

    // Function to animate and then navigate to a child's family
    const handleSelectChild = (child) => {
        setAnimationClass('fade-out');
        setTimeout(() => {
            setHistory([...history, currentMember]);
            setCurrentMember(child);
            setAnimationClass('fade-in');
        }, 500); // Match animation duration
    };

    // Function to animate and go back to the previous generation
    const handleGoBack = () => {
        if (history.length > 0) {
            setAnimationClass('fade-out');
            setTimeout(() => {
                const previousMember = history.pop();
                setCurrentMember(previousMember);
                setHistory([...history]);
                setAnimationClass('fade-in');
            }, 500);
        }
    };

    // Filter out the "Test" entry from children
    const children = currentMember.children
        ? currentMember.children.filter(child => child.name !== 'Test')
        : [];

    const parentName = history.length > 0 ? history[history.length - 1]['vn-name'] : '';

    return (
        <div className={`family-tree-container ${animationClass}`}>
            <header className="tree-header">
                 {history.length > 0 && (
                    <button onClick={handleGoBack} className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="back-arrow-icon">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        <span>Back to {parentName}'s Family</span>
                    </button>
                )}
                <h1>{currentMember['vn-name']}'s Family</h1>
                <p>The Descendants of the Current Generation</p>
            </header>

            <main>
                {/* Section for the current member and their spouse */}
                <section className="parents-section">
                    <MemberCard member={currentMember} />
                    {currentMember.spouse && <span className="love-icon">&</span>}
                    <MemberCard member={currentMember.spouse} isSpouse={true} />
                </section>

                <div className="connection-line"></div>

                {/* Section for the children */}
                {children.length > 0 && (
                    <section className="children-section">
                        <div className="children-section-header">
                            <h3>Descendants</h3>
                            <div className="view-toggle-buttons">
                                <button
                                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid View"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>
                                </button>
                                <button
                                    className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    title="List View"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                                </button>
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="children-grid">
                                {children.map((child) => (
                                    <ChildGridCard
                                        key={child.id || child.name}
                                        child={child}
                                        onSelectChild={handleSelectChild}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ul className="children-list">
                                {children.map((child) => (
                                    <ChildListItem
                                        key={child.id || child.name}
                                        child={child}
                                        onSelectChild={handleSelectChild}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default TreeShow;
