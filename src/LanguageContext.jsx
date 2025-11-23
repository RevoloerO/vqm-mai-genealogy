import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vn');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState(null);
    const [isIncoming, setIsIncoming] = useState(false);
    const [displayLanguage, setDisplayLanguage] = useState('vn');
    const [animationKey, setAnimationKey] = useState(0);

    const handleLanguageSwitch = useCallback(() => {
        const newLang = language === 'vn' ? 'en' : 'vn';
        const direction = language === 'vn' ? 'to-en' : 'to-vn';

        // Start slide-out animation
        setTransitionDirection(direction);
        setIsTransitioning(true);
        setIsIncoming(false);

        // After slide-out, switch language and start type-in
        setTimeout(() => {
            setLanguage(newLang);
            setDisplayLanguage(newLang);
            setIsTransitioning(false);
            setIsIncoming(true);
            setAnimationKey(prev => prev + 1);

            // End type-in animation
            setTimeout(() => {
                setIsIncoming(false);
            }, 400);
        }, 250);
    }, [language]);

    const value = {
        language,
        displayLanguage,
        isTransitioning,
        transitionDirection,
        isIncoming,
        animationKey,
        handleLanguageSwitch
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Reusable LangText component for animated text
export const LangText = ({ text }) => {
    const { isTransitioning, transitionDirection, isIncoming, animationKey } = useLanguage();

    if (isTransitioning && !isIncoming) {
        const slideClass = transitionDirection === 'to-en' ? 'lang-slide-out-left' : 'lang-slide-out-right';
        return <span key={`out-${animationKey}`} className={slideClass}>{text}</span>;
    }
    if (isIncoming) {
        return <span key={`in-${animationKey}`} className="lang-type-in">{text}</span>;
    }
    return <span key={`static-${animationKey}`}>{text}</span>;
};

// Language switch toggle component
export const LanguageSwitch = ({ className = '' }) => {
    const { language, handleLanguageSwitch } = useLanguage();

    return (
        <div
            className={`language-switch ${language} ${className}`}
            onClick={handleLanguageSwitch}
            title="Switch Language"
        >
            <div className="language-switch-handle"></div>
            <span className="lang-option">VN</span>
            <span className="lang-option">EN</span>
        </div>
    );
};

export default LanguageContext;
