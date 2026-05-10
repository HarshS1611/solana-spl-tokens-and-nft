import "dotenv/config";
import { address, appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getSignatureFromTransaction, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from "@solana/kit";
import wallet from "../../devnet-wallet.json";
import { findAssociatedTokenPda, getCreateAssociatedTokenInstructionAsync, getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";

const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com");

const token_decimals = 1_000_000n;

//paste your mint address got from spl_init.ts
const mint = address("6oypof8YFDSkumpqui37DEADD4F1nc9cECVoJ3ZVAVow");

(async () => {

    try {
        const signer = await createKeyPairSignerFromBytes(
            new Uint8Array(wallet)
        );

    const [ata] = await findAssociatedTokenPda({
        mint,
        owner: signer.address,
        tokenProgram: TOKEN_PROGRAM_ADDRESS
    })
    console.log(`Your ata is : ${ata}`)

    const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
        payer: signer,
        mint,
        owner: signer.address
    });

    const mintToIx = getMintToInstruction({
        mint,
        token: ata,
        mintAuthority: signer,
        amount: 10n * token_decimals
    });

    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send();

    const msg = createTransactionMessage({ version: 0});
    
    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);
    
    const msgWithLiftime = setTransactionMessageLifetimeUsingBlockhash(
            latestBlockhash,
            msgWithPayer
        )

    const txMessage = appendTransactionMessageInstructions(
        [createAtaIx, mintToIx],
        msgWithLiftime
    )

    const signedTx = await signTransactionMessageWithSigners(txMessage);

    assertIsTransactionWithBlockhashLifetime(signedTx);
    
    const signature = getSignatureFromTransaction(signedTx);

    const sendAndConfirm = sendAndConfirmTransactionFactory({
            rpc, rpcSubscriptions
        });
    
        
    await sendAndConfirm(signedTx, {commitment: "confirmed"});

    console.log(`mint txid: ${signature}`);
    }
    catch (error)
    {
        console.log(error);
    }
    
})()



// Your ata is : J3FBW2EssLBdJvarTvC4n4jJkjkTVKom71iaXA5bHQ2a
// mint txid: 3cygohH1xucpBKBwqkZRBhbkLwCGCmRw1ptVnugyMQ2UF4Uj9bVmvMg8A6rr4Y1j4nb3NgYfQiYZLqKaS56QNxgT