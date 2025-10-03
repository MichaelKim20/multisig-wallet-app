import { Client, Context } from "multisig-wallet-sdk-client";
import { Deployments } from "../helper/Deployments";

async function main() {
    const deployments = new Deployments();
    await deployments.attachAll();

    const ctx = new Context(deployments.getContextParams());
    const client = new Client(ctx);

    const address = "0x2312c098Cef41C0F55350bC3Ad8F4AFf983d9432";
    const length = await client.multiSigWalletFactory.getNumberOfWalletsForMember(address);
    console.log(`getNumberOfWalletsForMember : ${length}`);

    const wallets = await client.multiSigWalletFactory.getWalletsForMember(address, 0, length);
    for (const wallet of wallets) {
        console.log(`Wallet Info`);
        console.log(`  address     : ${wallet.address}`);
        console.log(`  name        : ${wallet.metadata.name}`);
        console.log(`  description : ${wallet.metadata.description}`);
        console.log(`  date        : ${wallet.creationDate.toLocaleString()}`);
        console.log(`  chain       : ${wallet.chain}`);
        console.log(`----------`);

        console.log(`Members`);
        client.multiSigWallet.attach(wallet.address);
        const members = await client.multiSigWallet.getMembers();
        let idx = 0;
        for (const member of members) {
            console.log(`  ${(idx + 1).toString().padStart(2, "0")} - ${member}`);
            idx++;
        }
        console.log(`----------`);

        console.log(`Required`);
        const required = await client.multiSigWallet.getRequired();
        console.log(`  ${required}`);
        console.log(`----------`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
