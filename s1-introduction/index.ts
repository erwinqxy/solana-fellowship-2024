import { Command } from "commander";
import { generateWallet, airdrop, sendSol, getBalance } from "./wallet";
import fs from "fs";

const program = new Command();
const solanaRpcUrl = "https://api.devnet.solana.com";

program.version("0.1.0").description("Solana CLI Wallet");

// Generate a new keypair command: bun run index.ts generate-wallet
program
  .command("generate")
  .description("Generate a new keypair")
  .action(() => {
    generateWallet();
  });

program
  .command("airdrop")
  .option("-adr, --address <address>", "Address to request airdrop")
  .option("-amt, --amount <amount>", "Amount of SOL to request")
  .description("Request airdrop")
  .action(async (address: string, amount: string) => {
    await airdrop(address, parseInt(amount));
  });

program
  .command("send  <keypair> <recipient> <amount>")
  .option("-k, --keypair <keypair>", "Keypair JSON file path")
  .option("-r", "--recipient <recipient>", "Recipient public key")
  .option("-a, --amount <amount>", "Amount of SOL to send")
  .description("Send SOL")
  .action(async (keypairPath: string, recipient: string, amount: string) => {
    await sendSol(keypairPath, recipient, +amount);
  });

program
  .command("balance <address>")
  .option("-a, --address <address>", "Address to check balance")
  .description("Get balance of an address")
  .action(async (address: string) => {
    await getBalance(address);
  });

program.parse(process.argv);
