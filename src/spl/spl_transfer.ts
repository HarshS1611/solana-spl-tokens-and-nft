import "dotenv/config";
import { address, appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getSignatureFromTransaction, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from "@solana/kit";
import wallet from "../../devnet-wallet.json";
import { findAssociatedTokenPda, getCreateAssociatedTokenInstructionAsync, getTransferCheckedInstruction, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";

const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com");

//paste your mint address got from spl_init.ts
const mint = address("6oypof8YFDSkumpqui37DEADD4F1nc9cECVoJ3ZVAVow");

//paste the address of the recipient
const to = address("97xNk9eqUKN7t4SjE2nD9rNSoHDR44Doxxeb6P56XQUK");

(async () => {
    try {
        const signer = await createKeyPairSignerFromBytes(
            new Uint8Array(wallet)
        );
        const sendAndConfirm = sendAndConfirmTransactionFactory({
            rpc, rpcSubscriptions
        });

        const [fromAta] = await findAssociatedTokenPda({
            mint,
            owner: signer.address,
            tokenProgram: TOKEN_PROGRAM_ADDRESS
        })
        console.log(`Your fromAta is : ${fromAta}`);

        const [toAta] = await findAssociatedTokenPda({
            mint,
            owner: to,
            tokenProgram: TOKEN_PROGRAM_ADDRESS
        })
        console.log(`Your toAta is : ${toAta}`)

        const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
            payer: signer,
            mint,
            owner: to
        });

        const transferTx = getTransferCheckedInstruction({
            source: fromAta,
            mint,
            destination: toAta,
            authority: signer,
            amount: 1_000_000n,
            decimals: 6
        });

        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

        const msg = createTransactionMessage({ version: 0 });

        const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);

        const msgWithLiftime = setTransactionMessageLifetimeUsingBlockhash(
            latestBlockhash,
            msgWithPayer
        )

        const txMessage = appendTransactionMessageInstructions(
            [createAtaIx, transferTx],
            msgWithLiftime
        )

        const signedTx = await signTransactionMessageWithSigners(txMessage);

        assertIsTransactionWithBlockhashLifetime(signedTx);

        const signature = getSignatureFromTransaction(signedTx);

       
        await sendAndConfirm(signedTx, { commitment: "confirmed" });

        console.log(`transfer txid: ${signature}`);

    }
    catch (error) {
        console.log(error)
    }
})()


/*

Your fromAta is : J3FBW2EssLBdJvarTvC4n4jJkjkTVKom71iaXA5bHQ2a
Your toAta is : BwxgxNuLry4jfuCpuE1rDvMPEY5kSrGDPJ6mC5TgExPk
transfer txid: 2KT7FoYr6XdaTQH4QfDocrCAF3eKP1DyxDqUD3uWqEqDDwhpz6hqKR4x8hyaycXttxo2VeCsyL1rcRaz25ZV4vps

*/