import { GasPriceManager } from "./GasPriceManager";
import { ContextParams, LIVE_CONTRACTS, SupportedNetwork } from "multisig-wallet-sdk-client";
import { MultiSigWalletFactory__factory } from "multisig-wallet-contracts-lib";
import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "@ethersproject/wallet";
import { AddressZero } from "@ethersproject/constants";
import { BaseContract, ContractFactory } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import * as fs from "fs";

import * as dotenv from "dotenv";

// @ts-ignore

dotenv.config();

interface IDeployedContract {
    name: string;
    address: string;
    contract: BaseContract;
}

export interface IAccount {
    users: Wallet[];
}

type FnDeployer = (accounts: IAccount, deployments: Deployments) => Promise<any>;

export class Deployments {
    public deployments: Map<string, IDeployedContract>;
    public accounts: IAccount;
    public provider: JsonRpcProvider;
    public network: string;
    public web3Endpoint: string;
    public supportedNetwork: SupportedNetwork = SupportedNetwork.MSW_DEVNET;

    constructor() {
        this.deployments = new Map<string, IDeployedContract>();
        this.network = process.env.NETWORK || "devnet";
        this.web3Endpoint = process.env.WEB3_ENDPOINT || "http://127.0.0.1:8545";
        console.log(`network: ${this.network}`);
        console.log(`web3Endpoint: ${this.web3Endpoint}`);
        this.provider = new JsonRpcProvider(this.web3Endpoint);
        switch (this.network) {
            case "ethereum":
                this.supportedNetwork = SupportedNetwork.ETHEREUM_MAINNET;
                break;
            case "sepolia":
                this.supportedNetwork = SupportedNetwork.ETHEREUM_SEPOLIA;
                break;
            case "testnet":
                this.supportedNetwork = SupportedNetwork.BOSAGORA_TESTNET;
                break;
            case "mainnet":
                this.supportedNetwork = SupportedNetwork.BOSAGORA_MAINNET;
                break;
            case "devnet":
                this.supportedNetwork = SupportedNetwork.MSW_DEVNET;
                break;
            default:
                this.supportedNetwork = SupportedNetwork.MSW_DEVNET;
                break;
        }

        const users: any = JSON.parse(fs.readFileSync(`./data/accounts.json`, "utf8"));
        this.accounts = {
            users: users.map((m: any) => new Wallet(m.privateKey, this.provider)),
        };
    }

    public addContract(name: string, address: string, contract: BaseContract) {
        this.deployments.set(name, {
            name,
            address,
            contract,
        });
    }

    public getContract(name: string): BaseContract | undefined {
        const info = this.deployments.get(name);
        if (info !== undefined) {
            return info.contract;
        } else {
            return undefined;
        }
    }

    public getContractAddress(name: string): string {
        const info = this.deployments.get(name);
        if (info !== undefined) {
            return info.address;
        } else {
            return AddressZero;
        }
    }

    public async attachAll() {
        const deployers: FnDeployer[] = [attachWalletFactory];
        for (const elem of deployers) {
            try {
                await elem(this.accounts, this);
            } catch (error) {
                console.log(error);
            }
        }
    }

    public getContextParams(): ContextParams {
        let chainId = 24680;
        switch (this.network) {
            case "ethereum":
                chainId = 1;
                break;
            case "sepolia":
                chainId = 11155111;
                break;
            case "testnet":
                chainId = 2019;
                break;
            case "mainnet":
                chainId = 2151;
                break;
            case "devnet":
                chainId = 24680;
                break;
            default:
                chainId = 24680;
                break;
        }
        return {
            network: chainId,
            signer: new NonceManager(new GasPriceManager(this.accounts.users[0])),
            web3Providers: [this.provider],
            walletFactoryAddress: this.getContractAddress("MultiSigWalletFactory"),
        };
    }
}

async function attachWalletFactory(accounts: IAccount, deployments: Deployments) {
    const contractName = "MultiSigWalletFactory";

    const factory = new ContractFactory(MultiSigWalletFactory__factory.abi, MultiSigWalletFactory__factory.bytecode);
    const contract = factory
        .attach(LIVE_CONTRACTS[deployments.supportedNetwork].MultiSigWalletFactoryAddress)
        .connect(deployments.provider);

    deployments.addContract(contractName, contract.address, contract);
}
