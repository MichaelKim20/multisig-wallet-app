import { BytesLike } from "@ethersproject/bytes";
import { BigNumber } from "@ethersproject/bignumber";

export enum NormalSteps {
    SENT = "sent",
    SUCCESS = "success",
}

export type CreateMultiSigWallet =
    | {
          key: NormalSteps.SENT;
          creator: string;
          owners: string[];
          required: number;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          address: string;
      };

export type SubmitTransaction =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          transactionId: BigNumber;
      };

export type ConfirmTransaction =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          transactionId: BigNumber;
      };

export type RevokeTransaction =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
          transactionId: BigNumber;
      };

export type ChangeInformation =
    | {
          key: NormalSteps.SENT;
          txHash: BytesLike;
      }
    | {
          key: NormalSteps.SUCCESS;
      };

export type ContractTransactionData = {
    title: string;
    description: string;
    destination: string;
    value: BigNumber;
    data: string;
    executed: boolean;
};

export type ContractWalletInfo = {
    creator: string;
    wallet: string;
    name: string;
    description: string;
    time: BigNumber;
    chain: number;
};

export type Pagination = {
    skip?: number;
    limit?: number;
    direction?: SortDirection;
};

export enum SortDirection {
    ASC = "asc",
    DESC = "desc",
}

export type QueryOption = {
    limit: number;
    skip: number;
    direction: SortDirection;
};
