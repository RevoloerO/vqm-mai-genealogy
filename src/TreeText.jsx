import { useState } from 'react';
import { Link } from 'react-router-dom';
import familyData from './mai-genealogy.json';
import { useLanguage, LangText, LanguageSwitch } from './LanguageContext.jsx';
import './TreeText.css';

const translations = {
    en: {
        title: "Mai Family Tree",
        subtitle: "Collapsible Text View",
        backToTree: "Back to Family Tree",
        expandAll: "Expand All",
        collapseAll: "Collapse All",
        born: "b.",
        died: "d.",
        spouse: "Spouse",
        children: "children",
        noChildren: "No children",
        generation: "Generation",
        legendTitle: "Legend:",
        male: "Male",
        female: "Female",
        genColors: "Generation depth",
        footerContact: "For updates or questions, please contact:"
    },
    vn: {
        title: "Gia Phả Họ Mai",
        subtitle: "Xem Dạng Văn Bản",
        backToTree: "Quay Lại Cây Gia Phả",
        expandAll: "Mở Rộng Tất Cả",
        collapseAll: "Thu Gọn Tất Cả",
        born: "sinh",
        died: "mất",
        spouse: "Vợ/Chồng",
        children: "con",
        noChildren: "Không có con",
        generation: "Thế Hệ",
        legendTitle: "Chú thích:",
        male: "Nam",
        female: "Nữ",
        genColors: "Độ sâu thế hệ",
        footerContact: "Để cập nhật hoặc thắc mắc, vui lòng liên hệ:"
    }
};

const getName = (person, lang) => {
    if (!person) return '';
    if (lang === 'en' && person['en-name']) return person['en-name'];
    if (lang === 'en' && person.name && person.name !== person['vn-name']) return person.name;
    return person['vn-name'] || person.name || '';
};

const TreeNode = ({ node, language, level, expandedNodes, toggleNode, t }) => {
    if (!node || !node.id) return null;

    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const genMatch = node.id.match(/^G(\d+)-/);
    const generation = genMatch ? genMatch[1] : level;

    const lifespan = [];
    if (node.dob) lifespan.push(`${t('born')} ${node.dob}`);
    if (node.dod) lifespan.push(`${t('died')} ${node.dod}`);

    return (
        <div className={`tree-node level-${level} gen-${generation}`}>
            <div className="node-content">
                <button
                    className={`expand-toggle ${hasChildren ? '' : 'no-children'} ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => hasChildren && toggleNode(node.id)}
                    disabled={!hasChildren}
                >
                    {hasChildren ? (
                        <svg className="toggle-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M4.5 2L9 6L4.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                    ) : (
                        <span className="leaf-dot"></span>
                    )}
                </button>
                <div className="node-info">
                    <span className={`node-name ${node.gender === 'M' ? 'male' : 'female'}`}>
                        {getName(node, language)}
                    </span>
                    {lifespan.length > 0 && (
                        <span className="node-dates">({lifespan.join(', ')})</span>
                    )}
                    <span className="node-generation">G{generation}</span>
                </div>
            </div>

            {node.spouse && (
                <div className="spouse-info">
                    <span className="spouse-label">{t('spouse')}:</span>
                    <span className={`spouse-name ${node.spouse.gender === 'M' ? 'male' : node.gender === 'M' ? 'female' : 'male'}`}>
                        {getName(node.spouse, language)}
                    </span>
                    {node.spouse.dob && (
                        <span className="spouse-dates">({t('born')} {node.spouse.dob})</span>
                    )}
                </div>
            )}

            {hasChildren && isExpanded && (
                <div className="children-container">
                    {node.children.map((child, idx) => (
                        <TreeNode
                            key={child.id || idx}
                            node={child}
                            language={language}
                            level={level + 1}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            t={t}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeText = () => {
    const { language, displayLanguage } = useLanguage();
    const [expandedNodes, setExpandedNodes] = useState(new Set(['G1-1']));

    const t = (key) => translations[displayLanguage][key] || key;

    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const getAllNodeIds = (node) => {
        const ids = [];
        if (!node) return ids;
        if (node.id) ids.push(node.id);
        if (node.children) {
            node.children.forEach(child => {
                ids.push(...getAllNodeIds(child));
            });
        }
        return ids;
    };

    const expandAll = () => {
        const allIds = getAllNodeIds(familyData);
        setExpandedNodes(new Set(allIds));
    };

    const collapseAll = () => {
        setExpandedNodes(new Set(['G1-1']));
    };

    return (
        <div className="tree-text-container">
            <header className="tree-text-header">
                <div className="header-content">
                    <h1>
                        <LangText text={t('title')} />
                    </h1>
                    <p className="subtitle">
                        <LangText text={t('subtitle')} />
                    </p>
                </div>
                <div className="header-actions">
                    <Link to="/vqm-mai-genealogy/" className="back-btn">
                        <LangText text={t('backToTree')} />
                    </Link>
                    <LanguageSwitch />
                </div>
            </header>

            <div className="tree-text-controls">
                <button className="control-btn" onClick={expandAll}>
                    <LangText text={t('expandAll')} />
                </button>
                <button className="control-btn" onClick={collapseAll}>
                    <LangText text={t('collapseAll')} />
                </button>
            </div>

            <div className="legend-bar">
                <span className="legend-title">
                    <LangText text={t('legendTitle')} />
                </span>
                <div className="legend-items">
                    <div className="legend-item">
                        <span className="legend-color male"></span>
                        <span className="legend-label">
                            <LangText text={t('male')} />
                        </span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color female"></span>
                        <span className="legend-label">
                            <LangText text={t('female')} />
                        </span>
                    </div>
                    <div className="legend-divider"></div>
                    <div className="legend-item gen-legend">
                        <span className="legend-label">
                            <LangText text={t('genColors')} />:
                        </span>
                        <div className="gen-colors">
                            <div className="gen-color-item">
                                <span className="gen-color gen-1"></span>
                                <span className="gen-color-label">G1</span>
                            </div>
                            <div className="gen-color-item">
                                <span className="gen-color gen-2"></span>
                                <span className="gen-color-label">G2</span>
                            </div>
                            <div className="gen-color-item">
                                <span className="gen-color gen-3"></span>
                                <span className="gen-color-label">G3</span>
                            </div>
                            <div className="gen-color-item">
                                <span className="gen-color gen-4"></span>
                                <span className="gen-color-label">G4</span>
                            </div>
                            <div className="gen-color-item">
                                <span className="gen-color gen-5"></span>
                                <span className="gen-color-label">G5+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tree-text-content">
                <TreeNode
                    node={familyData}
                    language={language}
                    level={1}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                    t={t}
                />
            </div>

            <footer className="tree-text-footer">
                <p className="footer-contact">
                    <LangText text={t('footerContact')} />
                </p>
                <a href="mailto:vuongquyenmai@gmail.com" className="footer-email">
                    vuongquyenmai@gmail.com
                </a>
            </footer>
        </div>
    );
};

export default TreeText;
