import React from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {GridLayout} from 'components/layout';
import {LanguageSelector} from '../../components/languageSelector';

function Hero() {
  const {t} = useTranslation();
  return (
    <Container>
      <GridLayout>
        <Wrapper>
          <ContentWrapper>
            <Title>{t('explore.hero.title')}</Title>
            <Subtitle>{t('explore.hero.subtitle1')}</Subtitle>
          </ContentWrapper>
          <LanguageSelectorWrapper>
            <LanguageSelector />
          </LanguageSelectorWrapper>
        </Wrapper>
      </GridLayout>
    </Container>
  );
}

const Container = styled.div.attrs({
  className:
    'bg-primary-400 h-48 -mt-10 pt-8 desktop:h-56 desktop:pt-10 desktop:-mt-12 overflow-visible',
})``;

const Wrapper = styled.div.attrs({
  className:
    'flex justify-center desktop:justify-between col-span-full desktop:col-start-2 desktop:col-end-12 relative',
})``;

const ContentWrapper = styled.div.attrs({
  className: 'desktop:space-y-0.75 space-y-0.75 max-w-lg pt-3 desktop:pt-6',
})``;

const Title = styled.h1.attrs({
  className:
    'text-ui-0 font-bold ft-text-5xl desktop:text-left text-center desktop:leading-7.5 leading-4.5',
})`
  //font-family: Syne;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.h3.attrs({
  className:
    'text-ui-0 ft-text-lg font-normal text-center desktop:text-left leading-3 desktop:leading-3.75',
})``;

const LanguageSelectorWrapper = styled.div.attrs({
  className: 'absolute top-3 right-4 desktop:top-5 desktop:right-6',
})``;

export default Hero;
