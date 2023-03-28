import {useReactiveVar} from '@apollo/client';
import {
  Client,
  DaoListItem,
  DaoSortBy,
  IDaoQueryParams,
  SortDirection,
} from '@aragon/sdk-client';
import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';

import {favoriteDaosVar} from 'context/apolloClient';
import {useNetwork} from 'context/network';
import {getFavoritedDaosFromCache} from 'services/cache';
import {CHAIN_METADATA, SupportedChainID} from 'utils/constants';
import {resolveDaoAvatarIpfsCid} from 'utils/library';
import {useClient} from './useClient';

export const EXPLORE_FILTER = ['favorite', 'newest', 'popular'] as const;
export type ExploreFilter = typeof EXPLORE_FILTER[number];

export type AugmentedDaoListItem = DaoListItem & {
  chain: SupportedChainID;
};

const DEFAULT_QUERY_PARAMS = {
  sortBy: DaoSortBy.CREATED_AT,
  direction: SortDirection.DESC,
  skip: 0,
  limit: 4,
};

/**
 * Fetch a list of DAOs
 * @param client SDK common client
 * @param options Query params
 * @returns list of DAOs based on given params
 */
async function fetchDaos(client: Client | undefined, options: IDaoQueryParams) {
  return typeof client === 'undefined'
    ? Promise.reject(new Error('Client not defined'))
    : client.methods.getDaos(options);
}

/**
 * This hook returns a list of daos. The data returned for each dao contains
 * information about the dao such as metadata, plugins installed on the dao,
 * address, etc.
 *
 * The DAO criteria can be either popular or newest DAOs, or DAOs that a user has favorited.
 * @param filter criteria that should be applied when fetching dao
 * @param options.limit number of DAOs to return per fetch (page size)
 * @param options.direction sort direction
 * @returns A list of daos and their respective infos (metadata, plugins, etc.)
 */
export const useDaosQuery = (
  filter: ExploreFilter,
  options?: Pick<IDaoQueryParams, 'direction' | 'limit'>
) => {
  const {network} = useNetwork();
  const {client, network: clientNetwork} = useClient();
  const cachedDaos = useReactiveVar(favoriteDaosVar);

  const {direction, limit} = {
    direction: options?.direction || DEFAULT_QUERY_PARAMS.direction,
    limit: options?.limit || DEFAULT_QUERY_PARAMS.limit,
  };

  return useInfiniteQuery({
    // notice the use of `clientNetwork` instead of `network` from network context
    // To avoid a case of network mismatch, always go with the client network.
    // When it has caught up to final value of url/context network, that final query
    // will become the last & latest "fresh" one
    queryKey: ['infiniteDaos', filter, clientNetwork],

    queryFn: ({pageParam = 0}) => {
      const skip = limit * pageParam;

      if (filter === 'favorite') {
        return getFavoritedDaosFromCache(cachedDaos, {
          skip,
          limit,
        }) as Promise<DaoListItem[]>;
      } else {
        return fetchDaos(client, {
          skip,
          limit,
          direction,
          sortBy: toDaoSortBy(filter),
        });
      }
    },

    // calculate next page value
    getNextPageParam: (
      lastPage: Array<DaoListItem>,
      allPages: Array<DaoListItem[]>
    ) => (lastPage.length === limit ? allPages.length : undefined),

    // transform and select final value
    select: (data: InfiniteData<DaoListItem[]>) =>
      toAugmentedDaoListItem(data, CHAIN_METADATA[network].id),

    refetchOnWindowFocus: false,
  });
};

/**
 * Map explore filter to SDK DAO sort by
 * @param filter selected DAO category
 * @returns the equivalent of the SDK enum
 */
function toDaoSortBy(filter: ExploreFilter) {
  switch (filter) {
    case 'popular':
      return DaoSortBy.POPULARITY;
    case 'newest':
      return DaoSortBy.CREATED_AT;
    default:
      return DaoSortBy.CREATED_AT;
  }
}

/**
 * Add the chain and proper avatar resolved link for each DAO
 * @param data DAO api response
 * @param chain chain id
 * @returns augmented DAO with avatar link and proper chain
 */
// TODO: ideally chain id comes from the SDK; remove when available
function toAugmentedDaoListItem(
  data: InfiniteData<DaoListItem[]>,
  chain: SupportedChainID
) {
  return {
    pages: data.pages.flatMap(page =>
      page.map(dao => {
        const augmentedDao = dao as AugmentedDaoListItem;

        // add avatar
        augmentedDao.metadata.avatar = resolveDaoAvatarIpfsCid(
          augmentedDao.metadata.avatar
        );

        // add chain id
        if (!augmentedDao.chain) {
          augmentedDao.chain = chain;
        }

        return augmentedDao;
      })
    ),

    pageParams: data.pageParams,
  };
}
