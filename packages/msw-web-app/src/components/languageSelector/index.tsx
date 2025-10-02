import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

const languages = [
  {code: 'en', name: 'English'},
  {code: 'ko', name: '한국어'},
];

export const LanguageSelector: React.FC = () => {
  const {i18n} = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '6px', 
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '4px 8px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            background: i18n.language === lang.code ? '#3b82f6' : 'transparent',
            color: i18n.language === lang.code ? 'white' : '#374151',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: i18n.language === lang.code ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
          }}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};
