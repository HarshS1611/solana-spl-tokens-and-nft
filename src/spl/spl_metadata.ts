import "dotenv/config";
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3, CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionArgs, DataV2Args } from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58"

//paste your mint address got from spl_init.ts
const mint = publicKey("6oypof8YFDSkumpqui37DEADD4F1nc9cECVoJ3ZVAVow");

const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));


(async () => {
    try {

        const accounts : CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer
        }

        let data: DataV2Args = {
            name: "Meme Cat",
            symbol: "MCAT",
            uri: "https://cdn.100xdevs.com/metadata.json",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        }

        const args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }
        const tx = createMetadataAccountV3(umi, {
            ...accounts,
            ...args
        })

        const result = await tx.sendAndConfirm(umi);
        console.log("signature: ",bs58.encode(Buffer.from(result.signature)));
    }
    catch (error) {
        console.log("error",error);
    }
})()

// signature:  5bdY9ERMZ1E9ES58Ve8VogAGGxuBzJ54MLp684tx5ftZY59ycVB9aapczZpWQTw4f9AZJJEy28my6VG6qBd6eDYs