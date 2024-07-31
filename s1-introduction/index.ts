import { Command } from "commander";
import { generateWallet, airdrop, sendSol, getBalance } from "./wallet";

const program = new Command();

program.version("0.0.1").description("Solana CLI Wallet");

// Generate a new keypair command: bun run index.ts generate-wallet
program
  .command("generate")
  .description("Generate a new keypair")
  .action(() => {
    generateWallet();
  });

program
  .command('airdrop')
  .description('Request airdrop')
  .option('-adr, --address <address>', 'Address to request airdrop')
  .option('-amt, --amount <amount>', 'Amount of SOL to request')
  .action(async (address: string, amount: string) => {
    await airdrop(address, parseInt(amount));
  });

program
  .command('send <keypair> <recipient> <amount>')
  .description('Send SOL')
  .option('-k, --keypair <keypair>', 'Keypair JSON file path')
  .option('-r, --recipient <recipient>', 'Recipient public key')
  .option('-a, --amount <amount>', 'Amount of SOL to send')
  .action(async (keypairPath: string, recipient: string, amount: string) => {
    await sendSol(keypairPath, recipient, +amount);
  });

program
  .command('balance <address>')
  .description('Get balance of an address')
  .option('-a, --address <address>', 'Address to check balance')
  .action(async (address: string) => {
    await getBalance(address);
  });

program.parse(process.argv);
