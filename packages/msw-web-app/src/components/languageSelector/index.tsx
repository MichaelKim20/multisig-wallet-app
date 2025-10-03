import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';

const languages = [
  {code: 'en', name: 'English'},
  {code: 'ko', name: '한국어'},
];

export const LanguageSelector: React.FC = () => {
  const {i18n} = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <LanguageButtonGroup>
      {languages.map(lang => (
        <LanguageButton
          key={lang.code}
          active={i18n.language === lang.code}
          onClick={() => handleLanguageChange(lang.code)}
        >
          {lang.name}
        </LanguageButton>
      ))}
    </LanguageButtonGroup>
  );
};

const LanguageButtonGroup = styled.div.attrs({
  className: 'flex gap-0.5 bg-ui-100 backdrop-blur-sm rounded-xl p-1',
})``;

const LanguageButton = styled.button.attrs({
  className: 'px-2 py-1 rounded-lg text-sm font-medium transition-all',
})<{active: boolean}>`
  ${({active}) =>
    active
      ? 'background: white; color: #3164fa; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);'
      : 'color: #374151; &:hover { background: rgba(255, 255, 255, 0.5); }'}
`;
