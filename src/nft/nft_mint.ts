import "dotenv/config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import { createSignerFromKeypair, generateSigner, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { create, mplCore, ruleSet } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());

(async () => {
    try {
        const metadataUri = "https://gateway.irys.xyz/DG722aXEh8LaTeWZZFDbQWXgSGKfJ3JXaTxvYN7fVew6";
        const asset = generateSigner(umi);

        const tx = await create(umi, {
            asset,
            name: "King Ape",
            uri: metadataUri,
            plugins: [
                {
                    type: "Royalties",
                    basisPoints: 500, // 5% royalty
                    creators: [
                        {
                            address: signer.publicKey,
                            percentage: 90,
                        },
                        {
                            address: publicKey('C81XCoS1VToRzYYQ35N5Afow5iTRsZmZLrpXdYV61eeZ'),
                            percentage: 10,
                        }
                    ],
                    ruleSet: ruleSet("None"), // no transfer restrictions
                }
            ],
        }).sendAndConfirm(umi);

        const signature = base58.deserialize(tx.signature)[0];

        console.log(`signature ${signature} , asset : ${asset.publicKey}`);


    }
    catch (e) {
        console.log(`errior ${e}`);
    }
})()

// signature 4NYSWJ8ZzTsstoPtDZL2peGqndTCizx1Ct6aVb2rL3zDgMNnpHDDrw5cixR3appxFAFVqCUkmBeVF7fP7WFN1PCe , asset : Bk8DdExxrEAuSGtcAj8127aBEGqm6VBaSch8wC11DMmb

// signature 4gYcnf4Y2yDM3q4MJ9fpL4XBaEvRP3asB9C6joMtAWv7sfyMRcguRPZ6cJL5u9NZLGB7Zd3zkLHqiTyEn32Z83PG , asset : 6SqKAdS8Dwb6Xszxu7sPR2RtTid18EJAHs5Zr2B7GXcq