import { NetworkDeployment, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "multisig-wallet-contracts-lib";
import { Network } from "@ethersproject/networks";

export const LIVE_CONTRACTS: { [K in SupportedNetwork]: NetworkDeployment } = {
    [SupportedNetwork.ETHEREUM_MAINNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_mainnet.MultiSigWalletFactory,
    },
    [SupportedNetwork.ETHEREUM_GOERLI]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_testnet.MultiSigWalletFactory,
    },
    [SupportedNetwork.ETHEREUM_SEPOLIA]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_testnet.MultiSigWalletFactory,
    },
    [SupportedNetwork.BOSAGORA_MAINNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_mainnet.MultiSigWalletFactory,
    },
    [SupportedNetwork.BOSAGORA_TESTNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_testnet.MultiSigWalletFactory,
    },
    [SupportedNetwork.BOSAGORA_DEVNET]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_devnet.MultiSigWalletFactory,
    },
    [SupportedNetwork.BOSAGORA_LOCAL]: {
        MultiSigWalletFactoryAddress: activeContractsList.bosagora_devnet.MultiSigWalletFactory,
    },
};

export const ADDITIONAL_NETWORKS: Network[] = [
    {
        name: SupportedNetwork.BOSAGORA_MAINNET,
        chainId: 2151,
    },
    {
        name: SupportedNetwork.BOSAGORA_TESTNET,
        chainId: 2019,
    },
    {
        name: SupportedNetwork.BOSAGORA_DEVNET,
        chainId: 24680,
    },
];
