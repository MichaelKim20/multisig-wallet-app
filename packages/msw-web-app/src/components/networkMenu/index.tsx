import React, {useState, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import {
  ButtonIcon,
  ButtonText,
  Dropdown,
  IconChevronDown,
  ListItemAction,
} from 'msw-ui-components';

import {useNetwork} from 'context/network';
import {useSwitchNetwork} from 'hooks/useSwitchNetwork';
import {useWallet} from 'hooks/useWallet';
import {useGlobalModalContext} from 'context/globalModals';
import {CHAIN_METADATA} from 'utils/constants';
import {SupportedNetworks} from 'utils/constants/chains';

type NetworkMenuProps = {
  mode?: 'dropdown' | 'button';
  className?: string;
  variant?: 'navbar' | 'explore';
};

const NetworkMenu: React.FC<NetworkMenuProps> = ({
  mode = 'dropdown',
  className,
  variant = 'navbar',
}) => {
  const {t} = useTranslation();
  const {network} = useNetwork();
  const {switchWalletNetwork} = useSwitchNetwork();
  const {isConnected} = useWallet();
  const {open} = useGlobalModalContext();

  const currentNetwork = CHAIN_METADATA[network];

  // Filter out unsupported network from the list
  const supportedNetworks = Object.entries(CHAIN_METADATA).filter(
    ([key]) => key !== 'unsupported'
  );

  const handleNetworkChange = async (networkKey: string) => {
    if (!isConnected) {
      open('wallet');
      return;
    }
    try {
      await switchWalletNetwork(networkKey as SupportedNetworks);
      // Network context will automatically update when wallet chain changes
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const networkListItems = supportedNetworks.map(([key, networkData]) => ({
    component: (
      <ListItemAction
        title={
          key === 'bosagora_mainnet' ? 'Bosagora Mainnet' : 
          key === 'bosagora_testnet' ? 'Bosagora Testnet' :
          key === 'msw_devnet' ? 'Bosagora Devnet' :
          key === 'ethereum' ? 'Ethereum Mainnet' :
          key === 'sepolia' ? 'Ethereum Sepolia' :
          networkData.name
        }
        subtitle=""
        iconLeft={
          <img
            src={networkData.logo}
            alt={networkData.name}
            className="w-4 h-4 rounded-full"
          />
        }
        iconRight={network === key ? <span>✓</span> : undefined}
        onClick={() => handleNetworkChange(key)}
      />
    ),
  }));

  if (variant === 'explore') {
    return (
      <ExploreNetworkSelector>
        <Dropdown
          side="bottom"
          align="start"
          trigger={
            <NetworkDropdownTrigger>
              <img
                src={currentNetwork.logo}
                alt={currentNetwork.name}
                className="w-4 h-4 rounded-full"
              />
              <span className="flex-1 text-left">
                {network === 'bosagora_mainnet' ? 'Bosagora Mainnet' : 
                 network === 'bosagora_testnet' ? 'Bosagora Testnet' :
                 network === 'msw_devnet' ? 'Bosagora Devnet' :
                 network === 'ethereum' ? 'Ethereum Mainnet' :
                 network === 'sepolia' ? 'Ethereum Sepolia' :
                 currentNetwork.name}
              </span>
              <IconChevronDown className="w-4 h-4" />
            </NetworkDropdownTrigger>
          }
          listItems={networkListItems}
        />
      </ExploreNetworkSelector>
    );
  }


  if (mode === 'button') {
    return (
      <ButtonText
        mode="secondary"
        size="medium"
        label={currentNetwork.name}
        iconLeft={
          <img
            src={currentNetwork.logo}
            alt={currentNetwork.name}
            className="w-4 h-4 rounded-full"
          />
        }
        iconRight={<IconChevronDown />}
        className={className}
        css={{}}
      />
    );
  }

  return (
    <Dropdown
      side="bottom"
      align="end"
      trigger={
        <ButtonIcon
          mode="secondary"
          size="medium"
          icon={
            <div className="flex items-center gap-2">
              <img
                src={currentNetwork.logo}
                alt={currentNetwork.name}
                className="w-4 h-4 rounded-full"
              />
              <IconChevronDown />
            </div>
          }
          css={{}}
        />
      }
      listItems={networkListItems}
      className={className}
    />
  );
};

export default NetworkMenu;

// Explore page specific styles
const ExploreNetworkSelector = styled.div.attrs({
  className: 'flex justify-center desktop:justify-end',
})``;

const NetworkDropdownTrigger = styled.button.attrs({
  className: 'flex items-center gap-2 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium transition-all whitespace-nowrap min-w-[140px]',
})`
  color: white;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
