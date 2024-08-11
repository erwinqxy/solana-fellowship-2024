# s4-onchain-introduction-native

## Overview

This project involves building a native Solana program that enables users to perform three main operations:

- Initialize an Account: Create a new account to hold SOL (Solana's native token).
- Deposit SOL: Transfer SOL into the initialized account.
- Withdraw 10% of Deposited SOL: Withdraw 10% of the deposited SOL from the account at a given time.

## Deployed Program

The Solana program is deployed on the Devnet cluster. You can interact with the deployed program and view transactions at the following link:

- Program Address: [EP1ZmWR1mYAVZxYrYS9HxXerPDbozjppvB2H737agaBL](https://explorer.solana.com/address/EP1ZmWR1mYAVZxYrYS9HxXerPDbozjppvB2H737agaBL?cluster=devnet)

## Functionality

### Initialize Account

Creates a new account to hold SOL. This operation requires:

- Payer Account: The account funding the creation of the new account.
- New Account: The account being created.

### Deposit SOL

Transfers SOL from the payer account to the initialized account. This operation requires:

- Payer Account: The account from which SOL will be deducted.
- Deposit Account: The account receiving the SOL.

### Withdraw SOL

Withdraws 10% of the deposited SOL from the deposit account to the payer account. This operation requires:

- Payer Account: The account receiving the withdrawn SOL.
- Deposit Account: The account from which SOL will be withdrawn.

## Usage

To interact with the program, you can use the provided client script. Ensure that you have Solana CLI and TypeScript environment set up. The client script demonstrates how to initialize an account, deposit SOL, and withdraw SOL.

Client Script
Here is an example of how to use the client script to interact with the program (client.ts):

```typescript
import * as web3 from "@solana/web3.js";
import BN from "bn.js";
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";

// Set up the connection
const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

// Load your wallet
const wallet = pg.wallet.keypair;

console.log("My address:", wallet.publicKey.toString());
const balance = await connection.getBalance(wallet.publicKey);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

// Program ID
const programId = pg.PROGRAM_ID;

// Initialize an account
async function initializeAccount() {
  const newAccount = Keypair.generate();

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: newAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data: Buffer.from([0]), // Instruction 0 for initialize
  });

  const transaction = new Transaction().add(instruction);

  await web3.sendAndConfirmTransaction(connection, transaction, [
    wallet,
    newAccount,
  ]);

  console.log(`Initialized account: ${newAccount.publicKey.toString()}`);
  return newAccount;
}

// Deposit SOL into the account
async function depositSOL(account: Keypair, amount: number) {
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true }, // User account must be a signer
      { pubkey: account.publicKey, isSigner: false, isWritable: true }, // Deposit account must be writable
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId,
    data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray("le", 8))), // Instruction 1 for deposit
  });

  const transaction = new Transaction().add(instruction);

  await web3.sendAndConfirmTransaction(connection, transaction, [wallet]);

  console.log(
    `Deposited ${
      amount / web3.LAMPORTS_PER_SOL
    } SOL into account: ${account.publicKey.toString()}`
  );
}

// Withdraw SOL from the account
async function withdrawSOL(account: Keypair) {
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: account.publicKey, isSigner: false, isWritable: true },
    ],
    programId,
    data: Buffer.from([2]), // Instruction 2 for withdraw
  });

  const transaction = new Transaction().add(instruction);

  await web3.sendAndConfirmTransaction(connection, transaction, [wallet]);

  console.log(
    `Withdrew 10% of SOL from account: ${account.publicKey.toString()}`
  );
}

// Main function
(async () => {
  console.log("-----------------");
  console.log("Init Account");

  const newAccount = await initializeAccount();

  let newAccBalance = await connection.getBalance(newAccount.publicKey);
  console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
  console.log(
    `New Account balance: ${newAccBalance / web3.LAMPORTS_PER_SOL} SOL`
  );

  console.log("-----------------");
  console.log("Pre-Deposit SOL");

  newAccBalance = await connection.getBalance(newAccount.publicKey);
  console.log(
    "new account address:",
    wallet.publicKey.toString(),
    newAccBalance
  );

  console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

  await depositSOL(newAccount, 0.1 * web3.LAMPORTS_PER_SOL);

  console.log("Post-Deposit SOL");

  newAccBalance = await connection.getBalance(newAccount.publicKey);
  console.log(
    "New account address:",
    wallet.publicKey.toString(),
    `${newAccBalance / web3.LAMPORTS_PER_SOL} SOL`
  );

  console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

  console.log("-----------------");
  console.log("Pre-Withdraw SOL");
  newAccBalance = await connection.getBalance(newAccount.publicKey);
  console.log(
    "new account address:",
    wallet.publicKey.toString(),
    `${newAccBalance / web3.LAMPORTS_PER_SOL} SOL`
  );

  console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

  await withdrawSOL(newAccount);

  const balanceAfterWithdraw = await connection.getBalance(wallet.publicKey);
  console.log(
    `My balance after withdrawal: ${
      balanceAfterWithdraw / web3.LAMPORTS_PER_SOL
    } SOL`
  );
  const newAccBalanceAfterWithdraw = await connection.getBalance(
    newAccount.publicKey
  );
  console.log(
    `New account balance after withdrawal: ${
      newAccBalanceAfterWithdraw / web3.LAMPORTS_PER_SOL
    } SOL`
  );
})();
```

## Test the Program

Here is the output of the client script after running the program:

![Test the Program](/s4-onchain-introduction-native/test.png)

## Useful Resources

- Solpg native program transfer SOL code: https://beta.solpg.io/66b7a81ccffcf4b13384d2be 
- Create account PDA for native: https://github.com/solana-developers/program-examples/blob/main/basics/program-derived-addresses/native/program/src/instructions/create.rs
