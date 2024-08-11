import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
const client = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
const payer = pg.wallet;
const programId = new web3.PublicKey(pg.PROGRAM_ID);

describe('Solana Vault Tests', function () {
  let newAccount: web3.Keypair;

  beforeEach(async function () {
    newAccount = web3.Keypair.generate();
  });

  describe('initialize_account', () => {
    it('should initialize an account', async function () {
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: newAccount.publicKey, isSigner: true, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId,
        data: Buffer.from([0]), // Instruction 0 for initialize
      });

      const transaction = new Transaction().add(instruction);
      await sendAndConfirmTransaction(client, transaction, [payer.keypair, newAccount]);

      console.log(`Initialized account: ${newAccount.publicKey.toString()}`);
    });
  });

  describe('deposit_sol', () => {
    it('should fail when depositing more than balance, eg 10000000 SOL', async function () {
      const amount = 100000 * LAMPORTS_PER_SOL;
      try {
        const balanceBeforeDeposit = await client.getBalance(payer.publicKey);
        console.log(`Balance before deposit: ${balanceBeforeDeposit / LAMPORTS_PER_SOL}`);

        const instruction = new TransactionInstruction({
          keys: [
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: newAccount.publicKey, isSigner: false, isWritable: true },
            {
              pubkey: SystemProgram.programId,
              isSigner: false,
              isWritable: false,
            },
          ],
          programId,
          data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray('le', 8))), // Instruction 1 for deposit
        });

        const transaction = new Transaction().add(instruction);
        await sendAndConfirmTransaction(client, transaction, [payer.keypair]);

        const balanceAfterDeposit = await client.getBalance(pg.wallet.publicKey);
        console.log(
          `Deposited ${
            amount / LAMPORTS_PER_SOL
          } SOL into account: ${newAccount.publicKey.toString()}`
        );

        console.log(`Balance after deposit: ${balanceAfterDeposit / LAMPORTS_PER_SOL}`);
      } catch (error) {
        console.log(`Error caught: ${error.message}`);
      }
    });

    it('should deposit 0.1 SOL', async function () {
      const amount = 0.1 * LAMPORTS_PER_SOL;

      const balanceBeforeDeposit = await client.getBalance(payer.publicKey);
      console.log(`Balance before deposit: ${balanceBeforeDeposit / LAMPORTS_PER_SOL}`);

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: newAccount.publicKey, isSigner: false, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId,
        data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray('le', 8))), // Instruction 1 for deposit
      });

      const transaction = new Transaction().add(instruction);
      await sendAndConfirmTransaction(client, transaction, [payer.keypair]);

      const balanceAfterDeposit = await client.getBalance(payer.publicKey);
      console.log(
        `Deposited ${
          amount / LAMPORTS_PER_SOL
        } SOL into account: ${newAccount.publicKey.toString()}`
      );

      console.log(`Balance after deposit: ${balanceAfterDeposit / LAMPORTS_PER_SOL}`);
    });
  });

  describe('withdraw_sol', () => {
    it('should withdraw SOL', async function () {
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: newAccount.publicKey, isSigner: false, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId,
        data: Buffer.from([2]), // Instruction 2 for withdraw
      });

      const balanceBeforeWithdraw = await client.getBalance(payer.publicKey);
      console.log(`Balance before withdraw: ${balanceBeforeWithdraw / LAMPORTS_PER_SOL}`);

      const transaction = new Transaction().add(instruction);
      await sendAndConfirmTransaction(client, transaction, [payer.keypair]);

      const balanceAfterWithdraw = await client.getBalance(payer.publicKey);
      console.log(`Withdrew SOL from account: ${newAccount.publicKey.toString()}`);
      console.log(`Balance after withdraw: ${balanceAfterWithdraw / LAMPORTS_PER_SOL}`);
    });
  });
});
