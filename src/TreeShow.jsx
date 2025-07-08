import React, { useEffect, useState, useMemo } from 'react';
import './TreeShow.css';

// --- Translation Data ---
const translations = {
    en: {
        familyTitle: (name) => `${name}'s Family`,
        backToTitle: (name) => `Back to ${name}'s Family`,
        descendantsOf: "The Descendants of the Current Generation",
        descendants: "Descendants",
        born: "Born",
        viewFamily: "View Family",
        searchPlaceholder: "Search for a family member...",
        spouse: "Spouse",
    },
    vn: {
        familyTitle: (name) => `Gia phả của ${name}`,
        backToTitle: (name) => `Trở về gia phả của ${name}`,
        descendantsOf: "Các hậu duệ của thế hệ hiện tại",
        descendants: "Hậu duệ",
        born: "Năm sinh",
        viewFamily: "Xem gia phả",
        searchPlaceholder: "Tìm kiếm thành viên...",
        spouse: "Vợ/Chồng",
    }
};

// --- Helper Functions ---
const getName = (person, lang) => {
    if (!person) return '';
    if (lang === 'en' && person['en-name']) return person['en-name'];
    if (lang === 'en' && person['name'] && person.name !== person['vn-name']) return person.name;
    return person['vn-name'] || person['name'] || '';
};


// --- Components ---

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

const MemberCard = ({ member, lang }) => {
    if (!member) return null;
    const genderClass = member.gender === 'M' ? 'male' : 'female';
    return (
        <div className={`member-card ${genderClass}`}>
            <ProfileImagePlaceholder gender={member.gender} />
            <div className="member-details">
                 <h2 className="member-name">{getName(member, lang)}</h2>
                 <p className="member-dob">{member.dob ? `${translations[lang].born}: ${member.dob}` : ' '}</p>
                 <div className="decorative-line"></div>
            </div>
        </div>
    );
};

const ChildListItem = ({ child, onSelectChild, lang }) => {
    const hasChildren = child.children && child.children.length > 0;
    const genderSymbol = child.gender === 'M' ? '♂' : child.gender === 'F' ? '♀' : '';

    return (
        <li
            className={`child-list-item ${hasChildren ? 'clickable' : ''}`}
            onClick={() => hasChildren && onSelectChild(child)}
            title={hasChildren ? `${translations[lang].viewFamily} ${getName(child, lang)}` : ''}
        >
            <span className="child-gender">{genderSymbol}</span>
            <ProfileImagePlaceholder gender={child.gender} />
            <div className="child-info">
                <span className="child-name">{getName(child, lang)}</span>
                {child.dob && <p className="child-dob-list">{`${translations[lang].born}: ${child.dob}`}</p>}
                {child.spouse && <span className="spouse-info">& {getName(child.spouse, lang)}</span>}
            </div>
            {hasChildren && <span className="child-action-indicator">→</span>}
        </li>
    );
};

const ChildGridCard = ({ child, onSelectChild, lang }) => {
    const hasChildren = child.children && child.children.length > 0;
    const genderSymbol = child.gender === 'M' ? '♂' : child.gender === 'F' ? '♀' : '';

    return (
        <div
            className={`child-grid-card ${hasChildren ? 'clickable' : ''}`}
            onClick={() => hasChildren && onSelectChild(child)}
            title={hasChildren ? `${translations[lang].viewFamily} ${getName(child, lang)}` : ''}
        >
            <ProfileImagePlaceholder gender={child.gender} />
            <div className="child-card-details">
                <div className="child-grid-header">
                    <h4 className="child-name-grid">{getName(child, lang)}</h4>
                    <span className="child-gender-grid">{genderSymbol}</span>
                </div>
                {child.dob && <p className="child-dob-grid">{`${translations[lang].born}: ${child.dob}`}</p>}
                {child.spouse && <p className="spouse-info-grid">& {getName(child.spouse, lang)}</p>}
            </div>
             {hasChildren && <span className="child-action-indicator-grid">{translations[lang].viewFamily}</span>}
        </div>
    );
};


const TreeShow = ({ familyData }) => {
    const [currentMember, setCurrentMember] = useState(familyData);
    const [history, setHistory] = useState([]);
    const [animationClass, setAnimationClass] = useState('fade-in');
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [language, setLanguage] = useState('vn'); // 'vn' or 'en'

    const t = (key) => translations[language][key];

    const allMembers = useMemo(() => {
        const flattened = [];
        const recurse = (node, path) => {
            if (!node) return;
            flattened.push({ ...node, path });
            if (node.spouse) {
                flattened.push({ ...node.spouse, isSpouse: true, path });
            }
            if (node.children) {
                node.children.forEach(child => recurse(child, [...path, node]));
            }
        };
        recurse(familyData, []);
        return flattened;
    }, [familyData]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = allMembers.filter(member =>
            (member['vn-name'] && member['vn-name'].toLowerCase().includes(lowerCaseSearchTerm)) ||
            (member.name && member.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (member['en-name'] && member['en-name'].toLowerCase().includes(lowerCaseSearchTerm))
        );
        setSearchResults(results);
    }, [searchTerm, allMembers]);

    const handleSelectSearchResult = (result) => {
        setAnimationClass('fade-out');
        setTimeout(() => {
            const newCurrentMember = result.path.length > 0 ? result.path[result.path.length - 1] : result;
            setCurrentMember(newCurrentMember);
            setHistory(result.path);
            setSearchTerm('');
            setSearchResults([]);
            setAnimationClass('fade-in');
        }, 500);
    };

    const handleSelectChild = (child) => {
        setAnimationClass('fade-out');
        setTimeout(() => {
            setHistory([...history, currentMember]);
            setCurrentMember(child);
            setAnimationClass('fade-in');
        }, 500);
    };

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

    const children = currentMember.children
        ? currentMember.children.filter(child => child.name !== 'Test')
        : [];

    const parentName = history.length > 0 ? getName(history[history.length - 1], language) : '';

    // Infer spouse's gender if it's not provided in the data
    const spouseWithGender = currentMember.spouse ? {
        ...currentMember.spouse,
        gender: currentMember.spouse.gender || (currentMember.gender === 'M' ? 'F' : 'M')
    } : null;

    return (
        <div className={`family-tree-container ${animationClass}`}>
            <header className="tree-header">
                 {history.length > 0 && (
                    <button onClick={handleGoBack} className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="back-arrow-icon">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        <span>{t('backToTitle')(parentName)}</span>
                    </button>
                )}
                
                <div className="header-controls">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <ul className="search-results">
                                {searchResults.map((result, index) => (
                                    <li
                                        key={index}
                                        className="search-result-item"
                                        onClick={() => handleSelectSearchResult(result)}
                                    >
                                        {getName(result, language)}
                                        <span className="search-result-dob">{result.dob ? ` (b. ${result.dob})` : ''}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                     <div className="language-toggle">
                        <button onClick={() => setLanguage('vn')} className={language === 'vn' ? 'active' : ''}>VN</button>
                        <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>EN</button>
                    </div>
                </div>

                <h1>{t('familyTitle')(getName(currentMember, language))}</h1>
                <p>{t('descendantsOf')}</p>
            </header>

            <main>
                <section className="parents-section">
                    <MemberCard member={currentMember} lang={language} />
                    {spouseWithGender && <span className="love-icon">&</span>}
                    <MemberCard member={spouseWithGender} lang={language} />
                </section>

                <div className="connection-line"></div>

                {children.length > 0 && (
                    <section className="children-section">
                        <div className="children-section-header">
                            <h3>{t('descendants')}</h3>
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
                                        lang={language}
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
                                        lang={language}
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
