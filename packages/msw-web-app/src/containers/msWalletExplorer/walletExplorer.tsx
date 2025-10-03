import {
  ButtonGroup,
  ButtonText,
  IconChevronDown,
  Option,
  Spinner,
} from 'msw-ui-components';
import React, {useEffect, useMemo, useState} from 'react';
import {TFunction, useTranslation} from 'react-i18next';
import {generatePath, useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {WalletCard} from 'components/walletCard';
import {useWallet} from 'hooks/useWallet';
import {getSupportedNetworkByChainId} from 'utils/constants';
import {Dashboard} from 'utils/paths';
import {useWalletQuery, PROPOSALS_PER_PAGE} from 'hooks/useMSWalletQuery';
import {useClient} from '../../hooks/useClient';
import {WalletDetails} from 'multisig-wallet-sdk-client';

export const WalletExplorer = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {address} = useWallet();
  const {client} = useClient();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [walletList, setWalletList] = useState<Array<WalletDetails>>([]);
  const walletQuery = useWalletQuery(address, page) || {
    data: [],
    error: null,
    isLoading: false,
  };

  const [walletLength, setWalletLength] = useState<number>(0);

  useEffect(() => {
    const fetchWalletLength = async () => {
      if (client) {
        try {
          const length =
            address !== null
              ? await client.multiSigWalletFactory.getWalletListLength(address)
              : 0;
          setWalletLength(length);
          if (length > 0) {
            setPage(1);
          }
        } catch (error) {
          console.error('지갑 개수 조회 중 오류 발생:', error);
          setWalletLength(0);
        }
      }
    };

    fetchWalletLength();
  }, [client]);

  useEffect(() => {
    if (walletQuery.data) {
      const newWallets = walletQuery.data as Array<WalletDetails>;

      if (newWallets.length < PROPOSALS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (page === 1) {
        setWalletList(newWallets);
      } else {
        setWalletList(prev => {
          const uniqueProposals = newWallets.filter(
            newProposal => !prev.some(p => p.address === newProposal.address)
          );
          return [...prev, ...uniqueProposals];
        });
      }
    }
  }, [walletQuery.data, page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  /*************************************************
   *                     Render                    *
   *************************************************/
  return (
    <Container>
      <MainContainer>
        <HeaderWrapper>
          <Title>{t('explore.explorer.title')}</Title>
        </HeaderWrapper>
        <CardsWrapper>
          {walletQuery.isLoading ? (
            <Spinner size="default" />
          ) : (
            walletList.map((p: WalletDetails) => (
              <WalletCard
                key={p.address}
                address={p.address}
                name={p.metadata.name}
                description={p.metadata.description}
                chainId={p.chain}
                onClick={() => {
                  navigate(
                    generatePath(Dashboard, {
                      network: getSupportedNetworkByChainId(p.chain),
                      msWallet: p.address,
                    })
                  );
                }}
              />
            ))
          )}
        </CardsWrapper>
      </MainContainer>
      {hasMore && (
        <div>
          <ButtonText
            css={{}}
            label={t('explore.explorer.showMore')}
            iconRight={
              walletQuery.isLoading ? (
                <Spinner size="xs" />
              ) : (
                <IconChevronDown />
              )
            }
            bgWhite
            mode="ghost"
            onClick={() => handleLoadMore()}
          />
        </div>
      )}
    </Container>
  );
};

const MainContainer = styled.div.attrs({
  className: 'flex flex-col space-y-2 desktop:space-y-3',
})``;
const Container = styled.div.attrs({
  className: 'flex flex-col space-y-1.5',
})``;
const HeaderWrapper = styled.div.attrs({
  className:
    'flex flex-col space-y-2 desktop:flex-row desktop:space-y-0 desktop:justify-between',
})``;
const CardsWrapper = styled.div.attrs({
  className: 'grid grid-cols-1 gap-1.5 desktop:grid-cols-2 desktop:gap-3',
})``;
const Title = styled.p.attrs({
  className: 'font-bold ft-text-xl text-ui-800',
})``;
