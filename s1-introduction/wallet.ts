import {
  Keypair,
  PublicKey,
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import fs from "fs";

// TODO: update the RPC URL to the the desired network 
// const solanaRpc = 'https://api.devnet.solana.com';
const solanaRpc = "http://127.0.0.1:8899";

export const generateWallet = () => {
  console.log("Generating new keypair");
  const keyPair = Keypair.generate();

  let keypair = {
    publicKey: keyPair.publicKey.toBase58(),
    secretKey: Buffer.from(keyPair.secretKey).toString("base64"), // Convert secretKey to base64 string
  };

  let keypairJson = JSON.stringify(keypair);
  fs.writeFile("keypair.json", keypairJson, (err) => {
    if (err) {
      console.log("Error writing keypair to file:", err);
    } else {
      console.log("Keypair written to file");
      console.log("Public key:", keypair.publicKey);
      console.log("Secret key:", keypair.secretKey);
    }
  });
};

const readKeypair = (keypairJson: string): Promise<Keypair> => {
  return new Promise((resolve, reject) => {
    fs.readFile(keypairJson, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading keypair file:", err);
        reject(err);
      } else {
        const keyPairData = JSON.parse(data);
        keyPairData.secretKey = new Uint8Array(
          Buffer.from(keyPairData.secretKey, "base64"),
        ); // Convert base64 string back to Uint8Array
        const keyPair = Keypair.fromSecretKey(keyPairData.secretKey);
        resolve(keyPair);
      }
    });
  });
};

export const airdrop = async (address: string, amount: number) => {
  const airdropAmount = amount * LAMPORTS_PER_SOL; // note lamport has a value of 0.000000001 SOL
  const connection = new Connection(solanaRpc);
  (async () => {
    console.log(`Requesting airdrop of ${amount} SOL for ${address}`);
    let signature = await connection.requestAirdrop(
      new PublicKey(address),
      airdropAmount,
    );
    // 2 - Fetch the latest blockhash
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    // 3 - Confirm transaction success
    console.log("Confirming airdrop success...");
    await connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature,
      },
      "finalized",
    );
    // 4 - Log results
    console.log(
      `Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    );
    const balance =
      (await connection.getBalance(new PublicKey(address))) / LAMPORTS_PER_SOL;
    console.log(`Fetching wallet balance: ${balance} SOL`);
  })();
};

export const sendSol = async (
  keypairJson: string,
  recipient: string,
  amount: number,
) => {
  try {
    console.log(keypairJson, recipient, amount);
    const senderKeypair = await readKeypair(keypairJson);
    await sendSolTransaction(senderKeypair, recipient, amount);
  } catch (error) {
    console.error("Error sending SOL:", error);
  }
};

export const sendSolTransaction = async (
  senderKeypair: Keypair,
  recipient: string,
  amount: number,
) => {
  // set up the variables
  console.log(
    `Sending ${amount} SOL from ${senderKeypair.publicKey} to ${recipient}`,
  );

  const connection = new Connection(solanaRpc);
  const payer = Keypair.fromSecretKey(senderKeypair.secretKey);
  const receipientAddress = new PublicKey(recipient);

  // build the transaction
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: receipientAddress,
      lamports: amount,
    }),
  );

  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  transaction.feePayer = payer.publicKey;
  transaction.partialSign(payer);

  const seralizedTransaction = transaction.serialize();
  const signature = await connection.sendRawTransaction(seralizedTransaction);
  console.log("Transaction confirmed:", signature);
};

export const getBalance = async (address: string) => {
  const connection = new Connection(solanaRpc);
  const balance =
    (await connection.getBalance(new PublicKey(address))) / LAMPORTS_PER_SOL;
  console.log(`Balance of ${address}: ${balance} SOL`);
};
