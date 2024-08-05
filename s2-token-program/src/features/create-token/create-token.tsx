import React from "react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getMint } from "@solana/spl-token";
import TokenAccount from "../token-account/token-account";

export default function CreateToken() {
  // Token Mint
  const [mintTx, setMintTx] = React.useState<string>("");
  const [mintAddr, setMintAddr] = React.useState<web3.PublicKey | undefined>(
    undefined,
  );

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [mintSupply, setMintSupply] = React.useState<number>(0);
  const [mintDecimal, setMintDecimal] = React.useState<number>(0);
  const [mintAuthority, setMintAuthority] = React.useState<
    web3.PublicKey | undefined
  >(undefined);

  // error handling; is wallet connected?
  const connectionErr = () => {
    if (!publicKey || !connection) {
      toast.error("Please connect your wallet");
      return true;
    } else {
      return false;
    }
  };

  // create transaction to create a token mint on the blockchain
  const createMint = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }

    try {
      // Token Mints are accounts which hold data ABOUT a specific token.
      // Token Mints DO NOT hold tokens themselves.
      const tokenMint = web3.Keypair.generate();
      // amount of SOL required for the account to not be deallocated
      const lamports =
        await token.getMinimumBalanceForRentExemptMint(connection);
      const decimals = 2;
      // `token.createMint` function creates a transaction with the following two instruction: `createAccount` and `createInitializeMintInstruction`.
      const transaction = new web3.Transaction().add(
        // creates a new account
        web3.SystemProgram.createAccount({
          fromPubkey: publicKey!,
          newAccountPubkey: tokenMint.publicKey,
          space: token.MINT_SIZE,
          lamports,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        // initializes the new account as a Token Mint account
        token.createInitializeMintInstruction(
          tokenMint.publicKey,
          decimals, // decimals
          publicKey!, // mint authority
          publicKey!, // freezeAuthority
          token.TOKEN_PROGRAM_ID,
        ),
      );

      // prompts the user to sign the transaction and submit it to the network
      const signature = await sendTransaction(transaction, connection, {
        signers: [tokenMint],
      });
      setMintTx(signature);
      setMintAddr(tokenMint.publicKey);
      setMintDecimal(decimals);
      toast.success("Create Token success!");
      // await getTokenMint(tokenMint.publicKey);
    } catch (err) {
      toast.error("Error creating Token Mint");
      console.log("error", err);
    }
  };

  async function getTokenMint(mintAddr: web3.PublicKey) {
    const mintAccount = await getMint(connection, mintAddr!);
    setMintDecimal(mintAccount?.decimals!);
    setMintSupply(Number(mintAccount?.supply));
    setMintAuthority(mintAccount?.mintAuthority!);
  }

  const createMintOutputs = [
    {
      title: "Token Mint Address...",
      dependency: mintAddr!,
      href: `https://explorer.solana.com/address/${mintAddr}?cluster=devnet`,
    },
    {
      title: "Transaction Signature...",
      dependency: mintTx,
      href: `https://explorer.solana.com/tx/${mintTx}?cluster=devnet`,
    },
    {
      title: "Decimals...",
      dependency: mintDecimal,
    },
  ];

  const getMintOutputs = [
    {
      title: "Mint Authority...",
      dependency: mintAuthority!,
      href: `https://explorer.solana.com/address/${mintAddr}?cluster=devnet`,
    },
    {
      title: "Supply...",
      dependency: mintSupply!,
    },
    {
      title: "Decimals...",
      dependency: mintDecimal!,
    },
  ];

  return (
    <>
      <main className="max-w-7xl grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 text-white">
        <form
          onSubmit={(event) => createMint(event)}
          className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-semibold">
              Create Token 🦄
            </h2>
            <button
              type="submit"
              className="bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
          <div className="text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
            <ul className="p-2">
              {createMintOutputs.map(({ title, dependency, href }, index) => (
                <li
                  key={title}
                  className={`flex justify-between items-center ${index !== 0 && "mt-4"}`}
                >
                  <p className="tracking-wider">{title}</p>
                  {title !== "Decimals..."
                    ? dependency && (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex text-[#80ebff] italic hover:text-white transition-all duration-200"
                        >
                          {dependency.toString().slice(0, 25)}...
                          <FaExternalLinkAlt className="w-5 ml-1" />
                        </a>
                      )
                    : dependency && 2}
                </li>
              ))}
            </ul>
          </div>
        </form>
      </main>
      <main className="max-w-7xl grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 text-white">
        <TokenAccount mintAddress={mintAddr!} />
      </main>
    </>
  );
}
