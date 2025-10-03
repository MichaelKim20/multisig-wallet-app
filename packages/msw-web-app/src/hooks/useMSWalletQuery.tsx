import {useClient} from './useClient';
import {useNetwork} from 'context/network';
import {NotFound} from 'utils/paths';

import {useCallback, useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {Client, WalletDetails, SortType} from 'multisig-wallet-sdk-client';
import {useQuery} from '@tanstack/react-query';

export const PROPOSALS_PER_PAGE = 10;

async function fetchWallets(
  client: Client | undefined,
  address: string | null,
  page: number = 0
): Promise<Array<WalletDetails> | null> {
  if (!client) return Promise.reject(new Error('client must be defined'));

  const startIndex = (page - 1) * PROPOSALS_PER_PAGE;
  const endIndex = startIndex + PROPOSALS_PER_PAGE;
  if (address === null || page === 0) {
    return [];
  }
  try {
    return await client.multiSigWalletFactory.getWalletList(
      address,
      startIndex,
      endIndex,
      SortType.DSC
    );
  } catch (e) {
    return Promise.reject(new Error('getWalletList failed'));
  }
}

export const useWalletWithUseQuery = (
  address: string | null,
  page = 1,
  refetchInterval = 0
) => {
  const {network, networkUrlSegment} = useNetwork();
  const {client, network: clientNetwork} = useClient();
  const queryNetwork = useMemo(
    () => networkUrlSegment ?? network,
    [network, networkUrlSegment]
  );
  const enabled = !!client && clientNetwork === queryNetwork;

  const queryFn = useCallback(() => {
    return fetchWallets(client, address, page);
  }, [client, address, page]);

  return useQuery<WalletDetails | Array<WalletDetails> | null>({
    queryKey: ['wallets', queryNetwork, address, page],
    queryFn,
    enabled,
    refetchOnWindowFocus: false,
    refetchInterval,
  });
};

export const useWalletQuery = (address: string | null, page?: number) => {
  const navigate = useNavigate();
  const response = useWalletWithUseQuery(address, page);

  useEffect(() => {
    if (response.isFetched) {
      if (response.error || response.data === null) {
        navigate(NotFound, {
          replace: true,
          state: {incorrectAddress: address},
        });
      }
    }
  }, [response.data, response.error, response.isFetched, navigate, address]);

  return response;
};
