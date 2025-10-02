import {ButtonText} from 'msw-ui-components';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import {
  ModalBody,
  StyledImage,
  WarningContainer,
  WarningTitle,
} from 'containers/networkErrorMenu';
import {useGlobalModalContext} from 'context/globalModals';
import {useNetwork} from 'context/network';
import WalletIcon from 'public/wallet.svg';
import {Dashboard} from 'utils/paths';
import {htmlIn} from 'utils/htmlIn';
import {WalletDetails} from 'multisig-wallet-sdk-client';

const TokenContainer = ({tokenName}: {tokenName: string}) => {
  const {t} = useTranslation();

  return (
    <WarningContainer>
      <WarningTitle>{t('alert.gatingUsers.tokenTitle')}</WarningTitle>
      <WarningDescription>
        {t('alert.gatingUsers.tokenDescription', {tokenName})}
      </WarningDescription>
    </WarningContainer>
  );
};

const WrappingRequiredContainer = ({tokenSymbol}: {tokenSymbol: string}) => {
  const {t} = useTranslation();

  return (
    <WarningContainer>
      <WarningTitle>{t('modalAlert.wrapToken.title')}</WarningTitle>
      <WarningDescription>
        <span
          dangerouslySetInnerHTML={{
            __html: htmlIn(t)('modalAlert.wrapToken.desc', {
              tokenSymbol,
            }),
          }}
        />
      </WarningDescription>
    </WarningContainer>
  );
};

const WalletContainer = () => {
  const {t} = useTranslation();
  return (
    <WarningContainer>
      <WarningTitle>{t('alert.gatingUsers.walletTitle1')}</WarningTitle>
      <WarningDescription>
        {t('alert.gatingUsers.walletDescription1')}
      </WarningDescription>
    </WarningContainer>
  );
};

type Props = {
  walletDetails: WalletDetails;
};

export const GatingMenu: React.FC<Props> = ({walletDetails}) => {
  const {close, isGatingOpen} = useGlobalModalContext();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {network} = useNetwork(); // TODO ensure this network is the msWallet network
  return (
    <ModalBottomSheetSwitcher isOpen={isGatingOpen}>
      <ModalBody>
        <StyledImage src={WalletIcon} />
        <WalletContainer />
        <ButtonText
          css={{}}
          label={t('alert.gatingUsers.buttonLabel')}
          onClick={() => {
            navigate(
              generatePath(Dashboard, {
                network,
                msWallet: walletDetails.address,
              })
            );
            close('gating');
          }}
          size="large"
        />
      </ModalBody>
    </ModalBottomSheetSwitcher>
  );
};

const WarningDescription = styled.p.attrs({
  className: 'text-base text-ui-500 text-center',
})``;
