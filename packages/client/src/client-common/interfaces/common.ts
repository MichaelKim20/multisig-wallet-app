export enum SupportedNetwork {
    ETHEREUM_MAINNET = "homestead",
    ETHEREUM_GOERLI = "goerli",
    ETHEREUM_SEPOLIA = "sepolia",
    BOSAGORA_MAINNET = "bosagora_mainnet",
    BOSAGORA_TESTNET = "bosagora_testnet",
    BOSAGORA_DEVNET = "bosagora_devnet",
    BOSAGORA_LOCAL = "localhost",
}

export const SupportedNetworksArray = Object.values(SupportedNetwork);

export type NetworkDeployment = {
    MultiSigWalletFactoryAddress: string;
};

export type GasFeeEstimation = {
    average: bigint;
    max: bigint;
};
