# s1-introduction

Task: Build a cli wallet that generates a keypair and can handle airdrop/sending sol

## Features

1. A command to generate new wallet
2. getting airdrop from network
3. sending network token to another address
4. [additional] a command to check balance

## To run the project

Note: You need to have solana-test-validator running in the background to prevent errors.
Personally, I faced issues getting `Server responded with 429 Too Many Requests. Retrying after 500ms delay...` and found a work around by running a local network.

### Set up the local validator

In the cli:

```bash
   solana-test-validator
```

Update the solanaRpc in `wallet.ts`

```typescript
const solanaRpc = 'https://api.devnet.solana.com';
or
const solanaRpc = "http://127.0.0.1:8899"
```

### Run the project

```bash
  bun run index.ts <feature>
```

### Features

1. Generate a new wallet: A command to generate a new wallet, and the keypair will be saved locally in the project directory as `keypair.json`.

```bash
  bun run index.ts generate
```

![generate](./images/generate.png)

2. Get airdrop

```bash
  bun run index.ts airdrop <address> <amount>
```

![airdrop](./images/airdrop.png)

3. Send sol to another address

```bash
  bun run index.ts send <keypath.json file path> <recipient_address> <amount>
```

![transfer](./images/transfer.png)

4. Check balance

```bash
  bun run index.ts balance <address>
```

![balance](./images/balance.png)

## Appendix

Some addresses to play with:

- r6WE8BCdgepxvUPtdFMQxKax8D5Vu2BTC1wP2X7aDEY
- CwYWgGFgrrdX4qFTPK9SoiWPpt49AjUiCH89FiEASEUS

## Suggested user flow

1. Generate a new wallet A
2. Get airdrop for wallet A (save the address somewhere for reference in terminal later)
3. Generate a new wallet B
4. Get airdrop for wallet B (wallet B keypair will be saved on the project directory)
5. Check balance of wallet A and B
6. Send sol from wallet A to wallet B
7. Check balance of wallet B

## Learnings

### Useful references:

- [Solana web3.js](https://solana.com/docs/clients/javascript-reference)

### Generating a keypair

```typescript
import { Keypair } from "@solana/web3.js";
 
const keypair = Keypair.generate();
 
console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);
```

### Loading an existing keypair

```typescript
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
 
const keypair = getKeypairFromEnvironment("SECRET_KEY");
```

### Connecting to the network

```typescript
import { Connection, clusterApiUrl } from "@solana/web3.js";
 
const connection = new Connection(clusterApiUrl("devnet"));
console.log(`✅ Connected!`);
```
 
### Reading from network 

```typescript
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
 
const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN");
const balance = await connection.getBalance(address);
 
console.log(`The balance of the account at ${address} is ${balance} lamports`);
console.log(`✅ Finished!`);
```
