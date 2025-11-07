import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import familyData from './mai-genealogy.json';
import './TimeLine.css';

// Historical events in Vietnamese history
const historicalEvents = [
    { year: 1905, event: "French Colonial Period", eventVn: "Thời Kỳ Thuộc Pháp", type: "political" },
    { year: 1945, event: "Vietnam Independence", eventVn: "Độc Lập Việt Nam", type: "political" },
    { year: 1954, event: "Geneva Accords - Vietnam Divided", eventVn: "Hiệp Định Genève - Việt Nam Chia Đôi", type: "political" },
    { year: 1960, event: "Vietnam War Begins", eventVn: "Chiến Tranh Việt Nam Bắt Đầu", type: "war" },
    { year: 1975, event: "Fall of Saigon - War Ends", eventVn: "Sài Gòn Thất Thủ - Chiến Tranh Kết Thúc", type: "war" },
    { year: 1978, event: "Boat People Migration", eventVn: "Cuộc Di Cư Thuyền Nhân", type: "migration" },
    { year: 1986, event: "Đổi Mới Economic Reforms", eventVn: "Cải Cách Kinh Tế Đổi Mới", type: "economic" },
    { year: 1995, event: "US-Vietnam Relations Normalized", eventVn: "Bình Thường Hóa Quan Hệ Mỹ-Việt", type: "political" },
    { year: 2007, event: "Vietnam Joins WTO", eventVn: "Việt Nam Gia Nhập WTO", type: "economic" },
];

const translations = {
    en: {
        title: "Mai Family Timeline",
        subtitle: "Historical View of Births, Deaths, and Major Events",
        filters: "Filters",
        allGenerations: "All Generations",
        allDecades: "All Decades",
        showHistoricalEvents: "Show Historical Events",
        showAgeGaps: "Show Age Gaps",
        birth: "Birth",
        death: "Death",
        generation: "Generation",
        year: "Year",
        age: "Age",
        siblings: "Siblings",
        spouse: "Spouse",
        yearsDifference: "years difference",
        backToTree: "Back to Family Tree",
        male: "Male",
        female: "Female",
        unknown: "Unknown",
        eventType: {
            political: "Political",
            war: "War",
            migration: "Migration",
            economic: "Economic"
        },
        footerContact: "For updates or questions, please contact:",
        footerEmail: "vuongquyenmai@gmail.com"
    },
    vn: {
        title: "Dòng Thời Gian Gia Đình Mai",
        subtitle: "Lịch Sử Sinh, Mất và Các Sự Kiện Quan Trọng",
        filters: "Bộ Lọc",
        allGenerations: "Tất Cả Thế Hệ",
        allDecades: "Tất Cả Thập Kỷ",
        showHistoricalEvents: "Hiển Thị Sự Kiện Lịch Sử",
        showAgeGaps: "Hiển Thị Khoảng Cách Tuổi",
        birth: "Sinh",
        death: "Mất",
        generation: "Thế Hệ",
        year: "Năm",
        age: "Tuổi",
        siblings: "Anh Chị Em",
        spouse: "Vợ/Chồng",
        yearsDifference: "năm chênh lệch",
        backToTree: "Quay Lại Cây Gia Phả",
        male: "Nam",
        female: "Nữ",
        unknown: "Không Rõ",
        eventType: {
            political: "Chính Trị",
            war: "Chiến Tranh",
            migration: "Di Cư",
            economic: "Kinh Tế"
        },
        footerContact: "Để cập nhật hoặc thắc mắc, vui lòng liên hệ:",
        footerEmail: "vuongquyenmai@gmail.com"
    }
};

const getName = (person, lang) => {
    if (!person) return '';
    if (lang === 'en' && person['en-name']) return person['en-name'];
    if (lang === 'en' && person.name && person.name !== person['vn-name']) return person.name;
    return person['vn-name'] || person.name || '';
};

const TimeLine = () => {
    const [language, setLanguage] = useState('vn');
    const [selectedGeneration, setSelectedGeneration] = useState('all');
    const [selectedDecade, setSelectedDecade] = useState('all');
    const [showHistoricalEvents, setShowHistoricalEvents] = useState(true);
    const [showAgeGaps, setShowAgeGaps] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scrollContainerRef = React.useRef(null);

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value[k];
            if (!value) return key;
        }
        return value;
    };

    // Drag/Swipe handlers for timeline
    const handleMouseDown = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
            scrollContainerRef.current.style.userSelect = 'auto';
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.cursor = 'grab';
                scrollContainerRef.current.style.userSelect = 'auto';
            }
        }
    };

    const handleTouchStart = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Extract all timeline events (births and deaths)
    const timelineData = useMemo(() => {
        const events = [];
        const recurse = (node, generation = 1) => {
            if (!node) return;

            // Skip spouses in main family structure
            if (!node.id) return;

            const genMatch = node.id?.match(/^G(\d+)-/);
            const gen = genMatch ? genMatch[1] : generation;

            // Birth event
            if (node.dob && node.dob.trim()) {
                const birthYear = parseInt(node.dob);
                if (!isNaN(birthYear)) {
                    events.push({
                        year: birthYear,
                        type: 'birth',
                        person: node,
                        generation: gen,
                        name: node.name || node['vn-name'],
                        gender: node.gender
                    });
                }
            }

            // Death event
            if (node.dod && node.dod.trim()) {
                const deathYear = parseInt(node.dod);
                if (!isNaN(deathYear)) {
                    events.push({
                        year: deathYear,
                        type: 'death',
                        person: node,
                        generation: gen,
                        name: node.name || node['vn-name'],
                        gender: node.gender
                    });
                }
            }

            // Recurse through children
            if (node.children) {
                node.children.forEach(child => recurse(child, parseInt(gen) + 1));
            }
        };

        recurse(familyData);
        return events.sort((a, b) => a.year - b.year);
    }, []);

    // Calculate age gaps between siblings and spouses
    const ageGaps = useMemo(() => {
        const gaps = [];
        const recurse = (node) => {
            if (!node || !node.children) return;

            // Sibling age gaps
            const childrenWithDob = node.children.filter(c => c.dob && !isNaN(parseInt(c.dob)));
            for (let i = 0; i < childrenWithDob.length - 1; i++) {
                const child1 = childrenWithDob[i];
                const child2 = childrenWithDob[i + 1];
                const gap = Math.abs(parseInt(child2.dob) - parseInt(child1.dob));
                if (gap > 0) {
                    gaps.push({
                        type: 'sibling',
                        person1: child1,
                        person2: child2,
                        gap,
                        year: Math.min(parseInt(child1.dob), parseInt(child2.dob))
                    });
                }
            }

            // Recurse
            node.children.forEach(child => recurse(child));
        };

        recurse(familyData);
        return gaps;
    }, []);

    // Get year range
    const yearRange = useMemo(() => {
        if (timelineData.length === 0) return { min: 1900, max: 2030 };
        const years = timelineData.map(e => e.year);
        return {
            min: Math.floor(Math.min(...years) / 10) * 10,
            max: Math.ceil(Math.max(...years, 2025) / 10) * 10
        };
    }, [timelineData]);

    // Get available generations
    const generations = useMemo(() => {
        const gens = new Set();
        timelineData.forEach(e => gens.add(e.generation));
        return Array.from(gens).sort();
    }, [timelineData]);

    // Get available decades
    const decades = useMemo(() => {
        const decs = new Set();
        for (let year = yearRange.min; year <= yearRange.max; year += 10) {
            decs.add(year);
        }
        return Array.from(decs).sort();
    }, [yearRange]);

    // Filter events
    const filteredEvents = useMemo(() => {
        return timelineData.filter(event => {
            if (selectedGeneration !== 'all' && event.generation !== selectedGeneration) {
                return false;
            }
            if (selectedDecade !== 'all') {
                const decade = Math.floor(event.year / 10) * 10;
                if (decade !== parseInt(selectedDecade)) {
                    return false;
                }
            }
            return true;
        });
    }, [timelineData, selectedGeneration, selectedDecade]);

    // Create timeline segments (combine events and empty periods into segments)
    const timelineSegments = useMemo(() => {
        const segments = [];
        const allEventYears = [...filteredEvents.map(e => e.year),
                              ...(showHistoricalEvents ? historicalEvents
                                  .filter(e => e.year >= yearRange.min && e.year <= yearRange.max)
                                  .map(e => e.year) : [])];

        if (allEventYears.length === 0) {
            return [{ type: 'active', start: yearRange.min, end: yearRange.max }];
        }

        const sortedYears = [...new Set(allEventYears)].sort((a, b) => a - b);

        // Add first segment
        if (sortedYears[0] - yearRange.min >= 10) {
            segments.push({
                type: 'gap',
                start: yearRange.min,
                end: sortedYears[0]
            });
        } else if (sortedYears[0] > yearRange.min) {
            segments.push({
                type: 'active',
                start: yearRange.min,
                end: sortedYears[0]
            });
        }

        // Add segments between events
        for (let i = 0; i < sortedYears.length - 1; i++) {
            const gap = sortedYears[i + 1] - sortedYears[i];

            if (gap >= 10) {
                // Add small active segment before gap
                segments.push({
                    type: 'active',
                    start: sortedYears[i],
                    end: sortedYears[i] + 2
                });
                // Add gap
                segments.push({
                    type: 'gap',
                    start: sortedYears[i] + 2,
                    end: sortedYears[i + 1] - 2
                });
                // Add small active segment after gap
                segments.push({
                    type: 'active',
                    start: sortedYears[i + 1] - 2,
                    end: sortedYears[i + 1]
                });
            } else {
                segments.push({
                    type: 'active',
                    start: sortedYears[i],
                    end: sortedYears[i + 1]
                });
            }
        }

        // Add last segment
        const lastYear = sortedYears[sortedYears.length - 1];
        if (yearRange.max - lastYear >= 10) {
            segments.push({
                type: 'gap',
                start: lastYear,
                end: yearRange.max
            });
        } else if (yearRange.max > lastYear) {
            segments.push({
                type: 'active',
                start: lastYear,
                end: yearRange.max
            });
        }

        return segments;
    }, [filteredEvents, showHistoricalEvents, yearRange]);

    // Calculate segment positions and widths
    const segmentStyles = useMemo(() => {
        const totalYears = yearRange.max - yearRange.min;
        let currentPosition = 0;

        return timelineSegments.map(segment => {
            const segmentYears = segment.end - segment.start;
            let width;

            if (segment.type === 'gap') {
                // Gaps take fixed 60px width
                width = 60;
            } else {
                // Active segments take proportional width
                const proportion = segmentYears / totalYears;
                // Calculate remaining space after all gaps
                const gapCount = timelineSegments.filter(s => s.type === 'gap').length;
                const remainingWidth = 3000 - (gapCount * 60);
                width = remainingWidth * proportion;
            }

            const position = currentPosition;
            currentPosition += width;

            return {
                left: position,
                width: width,
                segment: segment
            };
        });
    }, [timelineSegments, yearRange]);

    // Helper function to calculate pixel position for a year
    const getPixelPositionForYear = (year) => {
        for (const style of segmentStyles) {
            if (year >= style.segment.start && year <= style.segment.end) {
                if (style.segment.type === 'gap') {
                    // For gap segments, center the position
                    return style.left + style.width / 2;
                } else {
                    // For active segments, calculate proportional position
                    const segmentYears = style.segment.end - style.segment.start;
                    const yearOffset = year - style.segment.start;
                    const proportion = yearOffset / segmentYears;
                    return style.left + (style.width * proportion);
                }
            }
        }
        return 0;
    };

    return (
        <div className="timeline-container">
            <header className="timeline-header">
                <div className="timeline-header-content">
                    <h1>{t('title')}</h1>
                    <p className="timeline-subtitle">{t('subtitle')}</p>
                </div>
                <div className="timeline-header-actions">
                    <a href="/" className="back-to-tree-btn">{t('backToTree')}</a>
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
            </header>

            <div className="timeline-controls">
                <h3>{t('filters')}</h3>
                <div className="filter-group">
                    <label>
                        {t('generation')}:
                        <select
                            value={selectedGeneration}
                            onChange={(e) => setSelectedGeneration(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">{t('allGenerations')}</option>
                            {generations.map(gen => (
                                <option key={gen} value={gen}>G{gen}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Decade:
                        <select
                            value={selectedDecade}
                            onChange={(e) => setSelectedDecade(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">{t('allDecades')}</option>
                            {decades.map(dec => (
                                <option key={dec} value={dec}>{dec}s</option>
                            ))}
                        </select>
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={showHistoricalEvents}
                            onChange={(e) => setShowHistoricalEvents(e.target.checked)}
                        />
                        {t('showHistoricalEvents')}
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={showAgeGaps}
                            onChange={(e) => setShowAgeGaps(e.target.checked)}
                        />
                        {t('showAgeGaps')}
                    </label>
                </div>
            </div>

            <div
                className="timeline-scroll-container"
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="timeline-track" style={{ minWidth: `${segmentStyles.reduce((sum, s) => sum + s.width, 0)}px` }}>
                    {/* Render timeline segments */}
                    {segmentStyles.map((style, idx) => (
                        <div
                            key={idx}
                            className={`timeline-segment ${style.segment.type}`}
                            style={{
                                left: `${style.left}px`,
                                width: `${style.width}px`
                            }}
                        >
                            {style.segment.type === 'gap' ? (
                                <div className="timeline-gap-indicator">
                                    <span className="gap-dots">...</span>
                                    <span className="gap-years">{style.segment.end - style.segment.start}y</span>
                                </div>
                            ) : (
                                <>
                                    {/* Decade markers for active segments */}
                                    {decades
                                        .filter(decade => decade >= style.segment.start && decade <= style.segment.end)
                                        .map(decade => {
                                            const segmentYears = style.segment.end - style.segment.start;
                                            const decadeOffset = decade - style.segment.start;
                                            const position = (decadeOffset / segmentYears) * 100;
                                            return (
                                                <div
                                                    key={decade}
                                                    className="decade-marker"
                                                    style={{ left: `${position}%` }}
                                                >
                                                    <span className="decade-label">{decade}</span>
                                                    <div className="decade-line"></div>
                                                </div>
                                            );
                                        })}
                                </>
                            )}
                        </div>
                    ))}

                    {/* Historical events overlay */}
                    {showHistoricalEvents && (
                        <div className="historical-events-layer">
                            {historicalEvents
                                .filter(event => event.year >= yearRange.min && event.year <= yearRange.max)
                                .map((event, idx) => (
                                    <div
                                        key={idx}
                                        className={`historical-event event-${event.type}`}
                                        style={{ left: `${getPixelPositionForYear(event.year)}px` }}
                                        title={`${event.year}: ${language === 'vn' ? event.eventVn : event.event}`}
                                    >
                                        <div className="event-marker"></div>
                                        <div className="event-label">
                                            <strong>{event.year}</strong><br />
                                            {language === 'vn' ? event.eventVn : event.event}
                                            <span className="event-type-badge">{t(`eventType.${event.type}`)}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {/* Timeline events */}
                    <div className="timeline-events-layer">
                        {filteredEvents.map((event, idx) => {
                            const position = getPixelPositionForYear(event.year);
                            const genderClass = event.gender === 'M' ? 'male' : event.gender === 'F' ? 'female' : 'unknown';

                            return (
                                <div
                                    key={`${event.type}-${event.year}-${idx}`}
                                    className={`timeline-event ${event.type} ${genderClass}`}
                                    style={{ left: `${position}px` }}
                                >
                                    <div className="event-dot"></div>
                                    <div className="event-card">
                                        <div className="event-card-header">
                                            <span className="event-type-label">{t(event.type)}</span>
                                            <span className="event-year">{event.year}</span>
                                        </div>
                                        <div className="event-person-name">{getName(event.person, language)}</div>
                                        <div className="event-generation">G{event.generation}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Age gaps visualization */}
                    {showAgeGaps && (
                        <div className="age-gaps-layer">
                            {ageGaps
                                .filter(gap => {
                                    if (selectedGeneration !== 'all') {
                                        const gen1 = gap.person1.id?.match(/^G(\d+)-/)?.[1];
                                        if (gen1 !== selectedGeneration) return false;
                                    }
                                    if (selectedDecade !== 'all') {
                                        const decade = Math.floor(gap.year / 10) * 10;
                                        if (decade !== parseInt(selectedDecade)) return false;
                                    }
                                    return true;
                                })
                                .map((gap, idx) => {
                                    const position = getPixelPositionForYear(gap.year);
                                    return (
                                        <div
                                            key={`gap-${idx}`}
                                            className={`age-gap age-gap-${gap.type}`}
                                            style={{ left: `${position}px` }}
                                        >
                                            <div className="age-gap-label">
                                                {getName(gap.person1, language)} ↔ {getName(gap.person2, language)}
                                                <br />
                                                <strong>{gap.gap} {t('yearsDifference')}</strong>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="timeline-legend">
                <div className="legend-section">
                    <h4>Events:</h4>
                    <div className="legend-item">
                        <span className="legend-dot birth male"></span>
                        <span>{t('birth')} - {t('male')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot birth female"></span>
                        <span>{t('birth')} - {t('female')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot death male"></span>
                        <span>{t('death')} - {t('male')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot death female"></span>
                        <span>{t('death')} - {t('female')}</span>
                    </div>
                </div>
                {showHistoricalEvents && (
                    <div className="legend-section">
                        <h4>Historical Events:</h4>
                        <div className="legend-item">
                            <span className="legend-marker event-political"></span>
                            <span>{t('eventType.political')}</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-marker event-war"></span>
                            <span>{t('eventType.war')}</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-marker event-migration"></span>
                            <span>{t('eventType.migration')}</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-marker event-economic"></span>
                            <span>{t('eventType.economic')}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="timeline-footer">
                <p className="footer-contact">{t('footerContact')}</p>
                <a href="mailto:vuongquyenmai@gmail.com" className="footer-email">
                    {t('footerEmail')}
                </a>
            </footer>
        </div>
    );
};

export default TimeLine;
