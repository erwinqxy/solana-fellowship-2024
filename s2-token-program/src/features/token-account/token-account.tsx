import React from "react";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  Account,
} from "@solana/spl-token";
import { FaExternalLinkAlt } from "react-icons/fa";
import TransferToken from "../transfer-token/transfer-token";
import DelegateToken from "../delegate-token/delegate-token";
import BurnToken from "../burn-token/burn-token";
import MintToken from "../mint-token/mint-token";

export default function TokenAccount({
  mintAddress,
}: {
  mintAddress: web3.PublicKey;
}) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [signature, setSignature] = React.useState("");

  const [mint, setMint] = React.useState<web3.PublicKey | undefined>(undefined);
  const [owner, setOwner] = React.useState<web3.PublicKey | undefined>(
    undefined,
  );
  const [delegate, setDelegate] = React.useState<web3.PublicKey | undefined>(
    undefined,
  );
  const [account, setAccount] = React.useState<Account | undefined>(undefined);

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
  const createTokenAccount = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const associatedToken = await getAssociatedTokenAddress(
        mintAddress,
        publicKey!,
      );
      let fetchAccount = await getAccount(connection, associatedToken);
      console.log(fetchAccount);
    } catch (error) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        const associatedToken = await getAssociatedTokenAddress(
          mintAddress,
          publicKey!,
        );
        const transaction = new web3.Transaction().add(
          createAssociatedTokenAccountInstruction(
            publicKey!, //payer
            associatedToken, // associatedToken
            publicKey!, // owner
            mintAddress, // mint
          ),
        );
        const signature = await sendTransaction(transaction, connection);
        setSignature(signature);
        console.log("Transaction signature:", signature);

        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        // wait for confirmation
        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });
        toast.success("Created a new ATA");
      }
    } finally {
      const associatedToken = await getAssociatedTokenAddress(
        mintAddress,
        publicKey!,
      );
      const account = await getAccount(connection, associatedToken);
      setOwner(account.owner);
      setMint(account.mint);
      setDelegate(account.delegate!);
      setAccount(account);
      toast.success("Fetched ATA successfully");
    }
  };

  const tokenAccountOutputs = [
    {
      title: "Owner",
      dependency: owner,
      href: `https://explorer.solana.com/address/${owner}?cluster=devnet`,
    },
    {
      title: "Mint",
      dependency: mint,
      href: `https://explorer.solana.com/address/${mint}?cluster=devnet`,
    },
    {
      title: "Transaction Signature",
      dependency: signature,
      href: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    },
  ];

  return (
    <>
      <form
        onSubmit={(event) => createTokenAccount(event)}
        className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Token Account 🥳
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
            {tokenAccountOutputs.map(({ title, dependency, href }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && "mt-4"}`}
              >
                <p className="tracking-wider">{title}</p>
                {dependency && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-[#80ebff] italic hover:text-white transition-all duration-200"
                  >
                    {title !== "Transaction Signature"
                      ? dependency.toString()
                      : `${dependency.toString().slice(0, 25)}...`}
                    <FaExternalLinkAlt className="w-5 ml-1" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </form>
      <MintToken mintAddress={mintAddress} account={account!} />
      <BurnToken mintAddress={mintAddress} account={account!} />
      <DelegateToken mintAddress={mintAddress} account={account!} />
      <TransferToken mintAddress={mintAddress} account={account!} />
    </>
  );
}
