import { Client, Context } from "multisig-wallet-sdk-client";
import { Deployments } from "../helper/Deployments";

async function main() {
    const deployments = new Deployments();
    await deployments.attachAll();

    const ctx = new Context(deployments.getContextParams());
    const client = new Client(ctx);

    const isUp = await client.multiSigWalletFactory.web3.isUp();
    console.log(`web3.isUp : ${isUp}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
