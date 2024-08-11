import * as web3 from '@solana/web3.js';
import BN from 'bn.js';
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { Buffer } from 'buffer';

// Set up the connection
const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

// Load your wallet
const wallet = pg.wallet.keypair;

console.log('My address:', wallet.publicKey.toString());
const balance = await connection.getBalance(wallet.publicKey);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

// Program ID
// const programId = new PublicKey("EP1ZmWR1mYAVZxYrYS9HxXerPDbozjppvB2H737agaBL");
const programId = pg.PROGRAM_ID;

// Initialize an account
async function initializeAccount() {
  const newAccount = Keypair.generate();

  console.log(newAccount.publicKey.toString());

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

  await web3.sendAndConfirmTransaction(connection, transaction, [wallet, newAccount]);

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
    data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray('le', 8))), // Instruction 1 for deposit
  });

  const transaction = new Transaction().add(instruction);

  // Ensure to use the correct payer (wallet) and the correct accounts
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

  console.log(`Withdrew 10% of SOL from account: ${account.publicKey.toString()}`);
}

// Main function
(async () => {
  const newAccount = await initializeAccount();

  await depositSOL(newAccount, 0.5 * web3.LAMPORTS_PER_SOL);

  await withdrawSOL(newAccount);

  const balanceAfterWithdraw = await connection.getBalance(wallet.publicKey);
  console.log(
    `My balance after withdrawal: ${balanceAfterWithdraw / web3.LAMPORTS_PER_SOL} SOL`
  );
})();
