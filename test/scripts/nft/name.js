const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');


async function main() {
    const zilliqa = new Zilliqa('http://localhost:4200');
    const CHAIN_ID = 111;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
    privkey = 'db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3';
    zilliqa.wallet.addByPrivateKey(
        privkey
    );
    const address = getAddressFromPrivateKey(privkey);
    console.log("Your account address is:");
    console.log(`${address}`);
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions


    const nftAddr = toBech32Address("97ef723bc7e64cdd01e40b753c0c1f0d2a98bf6d");
    try {
        const contract = zilliqa.contracts.at(nftAddr);
        const callTx = await contract.callWithoutConfirm(
            'name',
            [],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            }
        );

        // check the pending status
        const pendingStatus = await zilliqa.blockchain.getPendingTxn(callTx.id);
        console.log(`Pending status is: `);
        console.log(pendingStatus.result);

        // process confirm
        console.log(`The transaction id is:`, callTx.id);
        console.log(`Waiting transaction be confirmed`);
        const confirmedTxn = await callTx.confirm(callTx.id);

        console.log(`The transaction status is:`);
        console.log(JSON.stringify(confirmedTxn.receipt));

    } catch (err) {
        console.log(err);
    }
}

main();
