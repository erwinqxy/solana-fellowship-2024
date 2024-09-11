# Create and Mint Output

```bash

yarn demo ./scripts/createAndMint.ts                                                                                                                                   ─╯
yarn run v1.22.22
$ npx ts-node -r tsconfig-paths/register ./scripts/createAndMint.ts
Payer address: 6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj
Test wallet address: AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF
Starting account balance: 2.00 SOL

Space to allocate: 64,504.00 bytes
Estimated cost to allocate space: 0.4498387200
Max compressed NFTs for tree: 16,384.00

===============================================
===============================================

Creating a new Merkle tree...
treeAddress: EVQRSVjCC6PHt8N1LQgX6h41448fAp5KuzvwxLWHhHZP
treeAuthority: 7rF3EPsTRgqfjxKZunv3qwhkXL1X4WmWq3bu9cVoVSrY

Merkle tree created successfully!
<https://explorer.solana.com/tx/4m6t3CT5wtPR4rBjYk3yTYMBuD9iVo99yG6RgYK3u1NNx7SEfAjEPihukeu62dzF1RmXzbCYXGFx48ZX2AaA8a6x?cluster=devnet>

Creating the collection's mint...
Mint address: 6JZguruV1SadU5J2iytgmrDGZTkr2awxBeHyakuzwvxD
Creating a token account...
Token account: 25h48rSHznCe6ghAkKZs4Qw1aDv6234k6RKj8CmaQoZh
Minting 1 token for the collection...
Metadata account: BxTTHjGBCVTUi3U8E1EyqDk27R1oEbpJMfTLPjyFNBJ8
Master edition account: 72vHjQQZu12M9CtW6BekdXAvm52kXbMzWPpwbVmJf8kq

Collection successfully created!
<https://explorer.solana.com/tx/3K68QsLmMem5NHsTEKcuyumrSN2itVeMxuLPFhcddn897nuFJWibrCzzSGoCf9BYWLNGMYAhV6i9hrfDvJXYEroy?cluster=devnet>

Minting a single compressed NFT to 6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj...
computedDataHash: 8JYPdpwQkXrbMA6Ns7gMuDyVokRsJej879SNcKGwdPxM
computedCreatorHash: CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU

Successfully minted the compressed NFT!
<https://explorer.solana.com/tx/5uGW4bXZo3qZ1NgFtfpMm1aeWGtJ1KroyNX2p6AzNoViSquErvTV2zhFMyTZJbry3AywiAEAtqMHf1hMRbuy7Yvy?cluster=devnet>

Minting a single compressed NFT to AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF...
computedDataHash: 8JYPdpwQkXrbMA6Ns7gMuDyVokRsJej879SNcKGwdPxM
computedCreatorHash: CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU

Successfully minted the compressed NFT!
<https://explorer.solana.com/tx/Gb2DW4hjZeHk1YRrFGxAL5VKNodgNpv9AquWUMeYFJjhQrhgkfLRdUpV6qp3zmahZvgAjRnZJxk55UBpK74Xiov?cluster=devnet>

===============================
Total cost: 0.4710893200 SOL

✨  Done in 18.80s.
```