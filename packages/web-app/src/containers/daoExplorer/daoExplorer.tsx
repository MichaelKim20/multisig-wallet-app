import {
  ButtonGroup,
  ButtonText,
  IconChevronDown,
  Option,
  Spinner,
} from '@aragon/ui-components';
import {UseInfiniteQueryResult} from '@tanstack/react-query';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {DaoCard} from 'components/daoCard';
import {
  AugmentedDaoListItem,
  ExploreFilter,
  EXPLORE_FILTER,
  useDaosInfiniteQuery,
} from 'hooks/useDaos';
import {useWallet} from 'hooks/useWallet';
import {getSupportedNetworkByChainId, SupportedChainID} from 'utils/constants';
import {Dashboard} from 'utils/paths';

export function isExploreFilter(
  filterValue: string
): filterValue is ExploreFilter {
  return EXPLORE_FILTER.some((ef: any) => ef === filterValue);
}

export const DaoExplorer = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {isConnected} = useWallet();

  const [filterValue, setFilterValue] = useState<ExploreFilter>('favorite');

  // conditional api queries
  const daosApi = useDaosInfiniteQuery(true, {});

  // resulting api response
  const exploreDaosApi = useMemo(
    () => daosApi as UseInfiniteQueryResult<AugmentedDaoListItem, unknown>,
    [daosApi]
  );

  // whether the connected wallet has favorited DAOS
  const loggedInAndHasFavoritedDaos =
    isConnected && (daosApi.data?.pages || []).length > 0;

  /*************************************************
   *             Callbacks and Handlers            *
   *************************************************/
  const handleFilterChange = (filterValue: string) => {
    if (isExploreFilter(filterValue)) {
      setFilterValue(filterValue);
    } else throw Error(`${filterValue} is not an acceptable filter value`);
  };

  const handleDaoClicked = (dao: string, chain: SupportedChainID) => {
    navigate(
      generatePath(Dashboard, {
        network: getSupportedNetworkByChainId(chain),
        dao,
      })
    );
  };

  /*************************************************
   *                      Effects                  *
   *************************************************/
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
          {exploreDaosApi.isLoading ? (
            <Spinner size="default" />
          ) : (
            exploreDaosApi.data?.pages?.map(dao => (
              <DaoCard
                key={dao.wallet}
                name={dao.name}
                address={dao.wallet}
                description={dao.description}
                chainId={dao.chain}
                onClick={() =>
                  handleDaoClicked(dao.wallet, dao.chain as SupportedChainID)
                }
              />
            ))
          )}
        </CardsWrapper>
      </MainContainer>
      {exploreDaosApi.hasNextPage && (
        <div>
          <ButtonText
            label={t('explore.explorer.showMore')}
            iconRight={
              exploreDaosApi.isFetching && exploreDaosApi.isFetchingNextPage ? (
                <Spinner size="xs" />
              ) : (
                <IconChevronDown />
              )
            }
            bgWhite
            mode="ghost"
            onClick={() => exploreDaosApi.fetchNextPage()}
          />
        </div>
      )}
    </Container>
  );
};

const ButtonGroupContainer = styled.div.attrs({
  className: 'flex',
})``;

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
