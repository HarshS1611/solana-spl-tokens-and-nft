# scripts-solana-spl-and-nft-mint

Scripts for creating SPL tokens and NFTs on Solana.

---

## Setup

### 1. Add your wallet

Place your devnet wallet keypair at the project root:

```
root/
└── devnet-wallet.json
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy the env file

```bash
cp .env.example .env
```

By default `.env` points to devnet. See the **Backup** section below if devnet is down.

---

## SPL Token

Run these in order. Each script prints the address or signature you need to paste into the next one.

| Command | What it does |
|---|---|
| `npm run spl:init` | Creates a new mint account |
| `npm run spl:metadata` | Attaches a name, symbol, and URI to the mint |
| `npm run spl:mint` | Creates your token account and mints tokens into it |
| `npm run spl:transfer` | Sends tokens to another wallet |

## SPL Transaction Links
- **Mint Account** - https://explorer.solana.com/address/6oypof8YFDSkumpqui37DEADD4F1nc9cECVoJ3ZVAVow?cluster=devnet
- **Mint Account Transaction** - https://explorer.solana.com/tx/4Di1qxBeB5QZkxH2keiBBBvJaxtYg9GPSD4GdVR6WsHNfA4aa6EF1W7jE8bvT2VzGkeNCNAK7vQLJdeGpiome5wz?cluster=devnet
- **Metadata URI Transaction** - https://explorer.solana.com/tx/5bdY9ERMZ1E9ES58Ve8VogAGGxuBzJ54MLp684tx5ftZY59ycVB9aapczZpWQTw4f9AZJJEy28my6VG6qBd6eDYs?cluster=devnet
- **ATA Account** - https://explorer.solana.com/address/J3FBW2EssLBdJvarTvC4n4jJkjkTVKom71iaXA5bHQ2a?cluster=devnet
- **ATA Account Transaction** - https://explorer.solana.com/tx/3cygohH1xucpBKBwqkZRBhbkLwCGCmRw1ptVnugyMQ2UF4Uj9bVmvMg8A6rr4Y1j4nb3NgYfQiYZLqKaS56QNxgT?cluster=devnet
- **SPL Token transfer transaction** - https://explorer.solana.com/tx/2KT7FoYr6XdaTQH4QfDocrCAF3eKP1DyxDqUD3uWqEqDDwhpz6hqKR4x8hyaycXttxo2VeCsyL1rcRaz25ZV4vps?cluster=devnet

---

## NFT

| Command | What it does |
|---|---|
| `npm run nft:image` | Uploads your image to Irys, prints the image URI |
| `npm run nft:metadata` | Uploads the metadata JSON to Irys, prints the metadata URI |
| `npm run nft:mint` | Mints the NFT on-chain with Royalties plugin (5%) |

---

## NFT Transaction Links
- **Image URI** - https://gateway.irys.xyz/4FkrtxUQp1gxabhFoZLEZbMmFBYiAYYJNRVGhQYyWHhH
- **Metadata URI** - https://gateway.irys.xyz/DG722aXEh8LaTeWZZFDbQWXgSGKfJ3JXaTxvYN7fVew6
- **Mint Account** - https://explorer.solana.com/address/6SqKAdS8Dwb6Xszxu7sPR2RtTid18EJAHs5Zr2B7GXcq?cluster=devnet
- **Mint Transaction** - https://explorer.solana.com/tx/4gYcnf4Y2yDM3q4MJ9fpL4XBaEvRP3asB9C6joMtAWv7sfyMRcguRPZ6cJL5u9NZLGB7Zd3zkLHqiTyEn32Z83PG?cluster=devnet
- **Metaplex Explorer** - https://core.metaplex.com/explorer/6SqKAdS8Dwb6Xszxu7sPR2RtTid18EJAHs5Zr2B7GXcq?env=devnet
  
