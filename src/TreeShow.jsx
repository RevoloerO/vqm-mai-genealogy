import { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
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
        scrollToTop: "Scroll to Top",
        spouseBadge: "(Spouse)",
        searchingFor: "Showing search result for",
        stats: "Statistics",
        toggleStats: "Toggle Statistics",
        totalMembers: "Total Members",
        generations: "Generations",
        genderDistribution: "Gender Distribution",
        male: "Male",
        female: "Female",
        unknown: "Unknown",
        generation: "Generation",
        members: "members",
        oldestInGeneration: "Oldest",
        youngestInGeneration: "Youngest",
        livingStatus: "Living Status",
        living: "Living",
        deceased: "Deceased",
        unknownStatus: "Unknown",
        timeline: "Timeline",
        viewTimeline: "View Timeline",
        footerContact: "For updates or questions, please contact:",
        footerEmail: "vuongquyenmai@gmail.com"
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
        scrollToTop: "Lên đầu trang",
        spouseBadge: "(Vợ/Chồng)",
        searchingFor: "Hiển thị kết quả tìm kiếm cho",
        stats: "Thống Kê",
        toggleStats: "Bật/Tắt Thống Kê",
        totalMembers: "Tổng Số Thành Viên",
        generations: "Thế Hệ",
        genderDistribution: "Phân Bố Giới Tính",
        male: "Nam",
        female: "Nữ",
        unknown: "Không Rõ",
        generation: "Thế Hệ",
        members: "thành viên",
        oldestInGeneration: "Lớn Tuổi Nhất",
        youngestInGeneration: "Trẻ Nhất",
        livingStatus: "Tình Trạng",
        living: "Còn Sống",
        deceased: "Đã Mất",
        unknownStatus: "Chưa Rõ",
        timeline: "Dòng Thời Gian",
        viewTimeline: "Xem Dòng Thời Gian",
        footerContact: "Để cập nhật hoặc thắc mắc, vui lòng liên hệ:",
        footerEmail: "vuongquyenmai@gmail.com"
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

const MemberCard = ({ member, lang, cardRef, isHighlighted = false }) => {
    if (!member) return null;
    const genderClass = member.gender === 'M' ? 'male' : 'female';
    const highlightClass = isHighlighted ? 'highlighted-card' : '';
    return (
        <div className={`member-card ${genderClass} ${highlightClass}`} ref={cardRef}>
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
    const genderClass = child.gender === 'M' ? 'male' : 'female';

    return (
        <li
            className={`child-list-item ${hasChildren ? 'clickable' : ''} ${genderClass}`}
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
    const genderClass = child.gender === 'M' ? 'male' : 'female';

    return (
        <div
            className={`child-grid-card ${hasChildren ? 'clickable' : ''} ${genderClass}`}
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
    const [language, setLanguage] = useState('vn');
    const [linePath, setLinePath] = useState('');
    const [isStickyButtonsVisible, setIsStickyButtonsVisible] = useState(false);
    const [highlightedSpouse, setHighlightedSpouse] = useState(null);
    const [isSpouseCollapsed, setIsSpouseCollapsed] = useState(false);
    const [isSearchBottomSheetOpen, setIsSearchBottomSheetOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    const mainMemberRef = useRef(null);
    const spouseRef = useRef(null);
    const connectionLineRef = useRef(null);
    const drawTimeoutRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const t = (key, ...args) => {
        const template = translations[language][key];
        if (typeof template === 'function') {
            return template(...args);
        }
        return template;
    };

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsStickyButtonsVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Touch gesture handler for swipe back navigation
    useEffect(() => {
        if (!isMobile || !containerRef.current || history.length === 0) return;

        const handleTouchStart = (e) => {
            touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now()
            };
        };

        const handleTouchEnd = (e) => {
            const touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
                time: Date.now()
            };

            const deltaX = touchEnd.x - touchStartRef.current.x;
            const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
            const deltaTime = touchEnd.time - touchStartRef.current.time;

            // Swipe right to go back (at least 100px, less than 300ms, mostly horizontal)
            if (deltaX > 100 && deltaY < 50 && deltaTime < 300 && touchStartRef.current.x < 50) {
                handleGoBack();
            }
        };

        const container = containerRef.current;
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMobile, history]);

    useEffect(() => {
        const drawLines = () => {
            if (!mainMemberRef.current || !connectionLineRef.current) {
                setLinePath('');
                return;
            }

            const containerRect = connectionLineRef.current.closest('.family-tree-container').getBoundingClientRect();
            const mainRect = mainMemberRef.current.getBoundingClientRect();
            const connectionRect = connectionLineRef.current.getBoundingClientRect();

            const startX = mainRect.left + mainRect.width / 2 - containerRect.left;
            const startY = mainRect.bottom - containerRect.top;
            const endY = connectionRect.top - containerRect.top;

            let path = `M ${startX},${startY} L ${startX},${startY + 20} `;

            if (spouseRef.current) {
                const spouseRect = spouseRef.current.getBoundingClientRect();
                const spouseX = spouseRect.left + spouseRect.width / 2 - containerRect.left;
                path += `M ${spouseX},${startY} L ${spouseX},${startY + 20} `;
                path += `M ${startX},${startY + 20} L ${spouseX},${startY + 20} `;
            }

            const midX = connectionRect.left + connectionRect.width / 2 - containerRect.left;
            path += `M ${midX},${startY + 20} L ${midX},${endY}`;

            setLinePath(path);
        };

        // Clear any pending draw operations
        if (drawTimeoutRef.current) {
            clearTimeout(drawTimeoutRef.current);
        }

        // Schedule new draw operation
        drawTimeoutRef.current = setTimeout(() => {
            drawLines();
        }, 150);

        window.addEventListener('resize', drawLines);

        // Cleanup
        return () => {
            if (drawTimeoutRef.current) {
                clearTimeout(drawTimeoutRef.current);
            }
            window.removeEventListener('resize', drawLines);
        };
    }, [currentMember, viewMode, language]);


    // familyData is static from JSON import, only calculate once
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
    }, []);

    // Calculate family statistics
    const familyStats = useMemo(() => {
        const stats = {
            totalMembers: 0,
            generations: {},
            genderStats: { male: 0, female: 0, unknown: 0 },
            livingStatus: { living: 0, deceased: 0, unknown: 0 }
        };

        // Only count non-spouse members for accurate statistics
        const realMembers = allMembers.filter(m => !m.isSpouse);
        stats.totalMembers = realMembers.length;

        realMembers.forEach(member => {
            // Extract generation from ID (e.g., "G3-5" -> 3)
            const genMatch = member.id?.match(/^G(\d+)-/);
            const generation = genMatch ? genMatch[1] : 'Unknown';

            // Initialize generation if not exists
            if (!stats.generations[generation]) {
                stats.generations[generation] = {
                    count: 0,
                    male: 0,
                    female: 0,
                    unknown: 0,
                    oldest: null,
                    youngest: null,
                    members: []
                };
            }

            const gen = stats.generations[generation];
            gen.count++;
            gen.members.push(member);

            // Gender distribution
            if (member.gender === 'M') {
                gen.male++;
                stats.genderStats.male++;
            } else if (member.gender === 'F') {
                gen.female++;
                stats.genderStats.female++;
            } else {
                gen.unknown++;
                stats.genderStats.unknown++;
            }

            // Living status
            if (member.dod) {
                stats.livingStatus.deceased++;
            } else if (member.dob) {
                stats.livingStatus.living++;
            } else {
                stats.livingStatus.unknown++;
            }

            // Find oldest/youngest in generation (only if we have DOB)
            if (member.dob) {
                const year = parseInt(member.dob);
                if (!isNaN(year)) {
                    if (!gen.oldest || year < parseInt(gen.oldest.dob)) {
                        gen.oldest = member;
                    }
                    if (!gen.youngest || year > parseInt(gen.youngest.dob)) {
                        gen.youngest = member;
                    }
                }
            }
        });

        return stats;
    }, [allMembers]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setIsSearchBottomSheetOpen(false);
            return;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = allMembers.filter(member =>
            (member['vn-name'] && member['vn-name'].toLowerCase().includes(lowerCaseSearchTerm)) ||
            (member.name && member.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (member['en-name'] && member['en-name'].toLowerCase().includes(lowerCaseSearchTerm))
        );
        setSearchResults(results);

        // Open bottom sheet on mobile when there are results
        if (isMobile && results.length > 0) {
            setIsSearchBottomSheetOpen(true);
        }
    }, [searchTerm, allMembers, isMobile]);

    const handleSelectSearchResult = (result) => {
        setAnimationClass('fade-out');
        setIsSearchBottomSheetOpen(false);
        setTimeout(() => {
            if (result.isSpouse) {
                // Navigate to partner's view
                const partner = result.path[result.path.length - 1];
                setCurrentMember(partner);
                setHistory(result.path.slice(0, -1));
                setHighlightedSpouse(getName(result, language));

                // Clear highlight after 3 seconds
                setTimeout(() => setHighlightedSpouse(null), 3000);
            } else {
                // Existing logic for regular members
                const newCurrentMember = result.path.length > 0
                    ? result.path[result.path.length - 1]
                    : result;
                setCurrentMember(newCurrentMember);
                setHistory(result.path);
                setHighlightedSpouse(null);
            }

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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const children = currentMember.children
        ? currentMember.children.filter(child => child.name !== 'Test')
        : [];

    const parentName = history.length > 0 ? getName(history[history.length - 1], language) : '';

    const spouseWithGender = currentMember.spouse ? {
        ...currentMember.spouse,
        gender: currentMember.spouse.gender || (currentMember.gender === 'M' ? 'F' : 'M')
    } : null;

    return (
        <div className={`family-tree-container ${animationClass}`} ref={containerRef}>
             <svg className="relationship-lines" width="100%" height="100%">
                <path d={linePath} stroke="var(--card-border)" strokeWidth="2" fill="none" />
            </svg>
            <header className="tree-header">
                <div className="top-bar">
                    <div className="top-bar-left">
                        {history.length > 0 && (
                            <button onClick={handleGoBack} className="back-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="back-arrow-icon">
                                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                </svg>
                                <span>{t('backToTitle', parentName)}</span>
                            </button>
                        )}
                        <Link
                            to="/vqm-mai-genealogy/timeline"
                            className="timeline-link-button"
                            title={t('viewTimeline')}
                            aria-label={t('viewTimeline')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                            </svg>
                            <span className="timeline-button-text">{t('timeline')}</span>
                        </Link>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchResults.length > 0 && !isMobile && (
                            <ul className="search-results">
                                {searchResults.map((result, index) => (
                                    <li
                                        key={index}
                                        className="search-result-item"
                                        onClick={() => handleSelectSearchResult(result)}
                                    >
                                        {getName(result, language)}
                                        {result.isSpouse && (
                                            <span className="spouse-badge">
                                                {t('spouseBadge')}
                                            </span>
                                        )}
                                        <span className="search-result-dob">{result.dob ? ` (b. ${result.dob})` : ''}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="top-bar-right">
                        <button
                            className="stats-toggle-button"
                            onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                            title={t('toggleStats')}
                            aria-label={t('toggleStats')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                            </svg>
                            <span className="stats-button-text">{t('stats')}</span>
                        </button>
                        <div
                            className={`language-switch ${language}`}
                            onClick={() => setLanguage(language === 'vn' ? 'en' : 'vn')}
                            title="Switch Language"
                        >
                            <div className="language-switch-handle"></div>
                            <span className="lang-option">VN</span>
                            <span className="lang-option">EN</span>
                        </div>
                    </div>
                </div>

                <h1>{t('familyTitle', getName(currentMember, language))}</h1>
                <p>{t('descendantsOf')}</p>
            </header>

            <main>
                <section className="parents-section">
                    <MemberCard member={currentMember} lang={language} cardRef={mainMemberRef} />
                    {spouseWithGender && isMobile && (
                        <button
                            className="mobile-spouse-toggle"
                            onClick={() => setIsSpouseCollapsed(!isSpouseCollapsed)}
                            aria-label={isSpouseCollapsed ? "Show spouse" : "Hide spouse"}
                        >
                            <span className="love-icon">&</span>
                            <span className="spouse-toggle-text">
                                {getName(spouseWithGender, language)}
                            </span>
                            <span className={`toggle-arrow ${isSpouseCollapsed ? 'collapsed' : ''}`}>
                                ▼
                            </span>
                        </button>
                    )}
                    {spouseWithGender && !isMobile && <span className="love-icon">&</span>}
                    {spouseWithGender && (!isMobile || !isSpouseCollapsed) && (
                        <MemberCard
                            member={spouseWithGender}
                            lang={language}
                            cardRef={spouseRef}
                            isHighlighted={highlightedSpouse === getName(spouseWithGender, language)}
                        />
                    )}
                </section>

                <div className="connection-line" ref={connectionLineRef}></div>

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

            <div className="sticky-buttons-container">
                {history.length > 0 && (
                    <button 
                        onClick={handleGoBack} 
                        className={`sticky-action-button back ${isStickyButtonsVisible ? 'visible' : ''}`}
                        title={t('backToTitle', parentName)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                        </svg>
                    </button>
                )}
                <button 
                    onClick={scrollToTop} 
                    className={`sticky-action-button scroll-top ${isStickyButtonsVisible ? 'visible' : ''}`}
                    title={t('scrollToTop')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                    </svg>
                </button>
            </div>

            {/* Footer */}
            <footer className="tree-footer">
                <p className="footer-contact">{t('footerContact')}</p>
                <a href="mailto:vuongquyenmai@gmail.com" className="footer-email">
                    {t('footerEmail')}
                </a>
            </footer>

            {/* Mobile Bottom Sheet for Search Results */}
            {isMobile && isSearchBottomSheetOpen && searchResults.length > 0 && (
                <>
                    <div
                        className="bottom-sheet-overlay"
                        onClick={() => setIsSearchBottomSheetOpen(false)}
                    />
                    <div className="bottom-sheet">
                        <div className="bottom-sheet-header">
                            <div className="bottom-sheet-handle" />
                            <h3 className="bottom-sheet-title">
                                {t('searchPlaceholder')} ({searchResults.length})
                            </h3>
                            <button
                                className="bottom-sheet-close"
                                onClick={() => setIsSearchBottomSheetOpen(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <ul className="bottom-sheet-results">
                            {searchResults.map((result, index) => (
                                <li
                                    key={index}
                                    className="bottom-sheet-result-item"
                                    onClick={() => handleSelectSearchResult(result)}
                                >
                                    <div className="result-item-content">
                                        <span className="result-name">{getName(result, language)}</span>
                                        {result.isSpouse && (
                                            <span className="spouse-badge">
                                                {t('spouseBadge')}
                                            </span>
                                        )}
                                    </div>
                                    {result.dob && (
                                        <span className="result-dob">{t('born')}: {result.dob}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Statistics Dashboard */}
            {isDashboardOpen && (
                <>
                    <div
                        className="dashboard-overlay"
                        onClick={() => setIsDashboardOpen(false)}
                    />
                    <div className={`statistics-dashboard ${isDashboardOpen ? 'open' : ''}`}>
                        <div className="dashboard-header">
                            <h2 className="dashboard-title">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                                </svg>
                                {t('stats')}
                            </h2>
                            <button
                                className="dashboard-close"
                                onClick={() => setIsDashboardOpen(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="dashboard-content">
                            {/* Total Members */}
                            <div className="stat-card stat-card-primary">
                                <div className="stat-label">{t('totalMembers')}</div>
                                <div className="stat-value">{familyStats.totalMembers}</div>
                                <div className="stat-sublabel">{familyStats.totalMembers} {t('members')}</div>
                            </div>

                            {/* Living Status */}
                            <div className="stat-section">
                                <h3 className="section-title">{t('livingStatus')}</h3>
                                <div className="stat-grid">
                                    <div className="stat-card stat-card-success">
                                        <div className="stat-label">{t('living')}</div>
                                        <div className="stat-value">{familyStats.livingStatus.living}</div>
                                    </div>
                                    <div className="stat-card stat-card-muted">
                                        <div className="stat-label">{t('deceased')}</div>
                                        <div className="stat-value">{familyStats.livingStatus.deceased}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">{t('unknownStatus')}</div>
                                        <div className="stat-value">{familyStats.livingStatus.unknown}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Gender Distribution */}
                            <div className="stat-section">
                                <h3 className="section-title">{t('genderDistribution')}</h3>
                                <div className="stat-grid">
                                    <div className="stat-card stat-card-male">
                                        <div className="stat-label">{t('male')}</div>
                                        <div className="stat-value">{familyStats.genderStats.male}</div>
                                        <div className="stat-bar">
                                            <div
                                                className="stat-bar-fill stat-bar-male"
                                                style={{ width: `${familyStats.totalMembers > 0 ? (familyStats.genderStats.male / familyStats.totalMembers * 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="stat-card stat-card-female">
                                        <div className="stat-label">{t('female')}</div>
                                        <div className="stat-value">{familyStats.genderStats.female}</div>
                                        <div className="stat-bar">
                                            <div
                                                className="stat-bar-fill stat-bar-female"
                                                style={{ width: `${familyStats.totalMembers > 0 ? (familyStats.genderStats.female / familyStats.totalMembers * 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Generation Statistics */}
                            <div className="stat-section">
                                <h3 className="section-title">{t('generations')}</h3>
                                {Object.keys(familyStats.generations).sort().map(gen => {
                                    const genData = familyStats.generations[gen];
                                    return (
                                        <div key={gen} className="generation-stat">
                                            <div className="generation-header">
                                                <span className="generation-label">{t('generation')} {gen}</span>
                                                <span className="generation-count">{genData.count} {t('members')}</span>
                                            </div>
                                            <div className="generation-details">
                                                <div className="gender-breakdown">
                                                    <span className="gender-item gender-male">
                                                        ♂ {genData.male}
                                                    </span>
                                                    <span className="gender-item gender-female">
                                                        ♀ {genData.female}
                                                    </span>
                                                </div>
                                                {genData.oldest && (
                                                    <div className="age-range">
                                                        <div className="age-item">
                                                            <span className="age-label">{t('oldestInGeneration')}:</span>
                                                            <span className="age-name">{getName(genData.oldest, language)}</span>
                                                            <span className="age-year">({genData.oldest.dob})</span>
                                                        </div>
                                                        {genData.youngest && genData.youngest !== genData.oldest && (
                                                            <div className="age-item">
                                                                <span className="age-label">{t('youngestInGeneration')}:</span>
                                                                <span className="age-name">{getName(genData.youngest, language)}</span>
                                                                <span className="age-year">({genData.youngest.dob})</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TreeShow;
