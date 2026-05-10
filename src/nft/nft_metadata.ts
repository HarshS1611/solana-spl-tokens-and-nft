import "dotenv/config";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);


umi.use(
    irysUploader({
        address: "https://devnet.irys.xyz/",
    })
);

umi.use(signerIdentity(signer));

(async () => {
    try {
        const image = "https://gateway.irys.xyz/4FkrtxUQp1gxabhFoZLEZbMmFBYiAYYJNRVGhQYyWHhH";

        const metadata = {
            name: "King Ape",
            symbol: "KAPE",
            description: "A pride king of the apes enjoying life on Solana 😎",
            image,
            attributes: [
                { trait_type: "Crown", value: "Royal Gold" },
                { trait_type: "Eyewear", value: "Heart Sunglasses" },
                { trait_type: "Fur", value: "Psychedelic Rainbow" },
                { trait_type: "Background", value: "Sky Blue" },
                { trait_type: "Mood", value: "Unbothered" },
                { trait_type: "Royalty", value: "King" },
                { trait_type: "Expression", value: "Smug Grin" },
            ],
            properties: {
                category: "image",
                files: [
                    {
                        uri: image,
                        type: "image/png",
                    },
                ],
            },
            creators: [
                {
                    address: signer.publicKey,
                    share: 100,
                },
            ],
        }

        const myUri = await umi.uploader.uploadJson(metadata);
        console.log(`metadata uri: ${myUri} `);
    }
    catch (error) {
        console.log("error", error);
    }
})()


// metadata uri: https://gateway.irys.xyz/DG722aXEh8LaTeWZZFDbQWXgSGKfJ3JXaTxvYN7fVew6 