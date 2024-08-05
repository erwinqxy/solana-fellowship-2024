import React from "react";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import {
  createApproveCheckedInstruction,
  createRevokeInstruction,
  Account,
} from "@solana/spl-token";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function DelegateToken({
  mintAddress,
  account,
}: {
  mintAddress: web3.PublicKey;
  account: Account;
}) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [delegatePublicKeyStr, setDelegatePublicKeyStr] = React.useState("");
  const [delegateAmount, setDelegateAmount] = React.useState(0);
  const [delegateSignature, setDelegateSignature] = React.useState("");
  const [undelegateSignature, setUndelegateSignature] = React.useState("");
  const [formatedDelegatedAmt, setFormatedDelegatedAmt] = React.useState("");

  // error handling; is wallet connected?
  const connectionErr = () => {
    if (!publicKey || !connection) {
      toast.error("Please connect your wallet");
      return true;
    } else {
      return false;
    }
  };

  const delegateToken = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const transaction = new web3.Transaction().add(
        createApproveCheckedInstruction(
          account?.address!, // token account
          mintAddress, // mint
          new web3.PublicKey(delegatePublicKeyStr), // delegate
          publicKey!, // owner of token account
          delegateAmount,
          2, // decimals
        ),
      );
      const formatedDelegateAmount = Number(
        Number(delegateAmount) / Math.pow(10, 2),
      ).toFixed(2);
      setFormatedDelegatedAmt(formatedDelegateAmount);

      const signature = await sendTransaction(transaction, connection);
      setDelegateSignature(signature);
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

      toast.success("Delegate toke success!");
    } catch (error) {
      console.error(error);
      toast.error("Delegate token failed.");
    }
  };

  const unDelegateToken = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const transaction = new web3.Transaction().add(
        createRevokeInstruction(
          account?.address!, // token account
          publicKey!, // owner of token account
        ),
      );
      const signature = await sendTransaction(transaction, connection);
      setUndelegateSignature(signature);
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

      toast.success("Revoke delegate token success!");
    } catch (error) {
      console.error(error);
      toast.error("Revoke delegate token failed.");
    }
  };

  const delegateTokenOutputs = [
    {
      title: "Delegate's Address",
      dependency: delegatePublicKeyStr,
      href: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    },
    {
      title: "Delegate Amount",
      dependency: formatedDelegatedAmt!,
    },
    {
      title: "Delegate Transaction Signature",
      dependency: delegateSignature!,
      href: `https://explorer.solana.com/txs/${delegateSignature}?cluster=devnet`,
    },
  ];

  const undelegateTokenOutputs = [
    {
      title: "Revoke Delegate Transaction Signature",
      dependency: undelegateSignature!,
      href: `https://explorer.solana.com/txs/${undelegateSignature}?cluster=devnet`,
    },
  ];

  return (
    <>
      <form
        onSubmit={(event) => delegateToken(event)}
        className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Delegate Token 🏂
          </h2>
          <button
            type="submit"
            className="bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "space-between",
          }}
        >
          <label
            style={{ paddingRight: "10px" }}
            htmlFor="delegate-pk"
            className="block mb-2 text-green-400"
          >
            Delegate's public key:
          </label>
          <input
            style={{ background: "grey" }}
            id="delegate-pk"
            name="delegate-pk"
            className="bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32"
            placeholder="Delegate's public key"
            onChange={(e) => setDelegatePublicKeyStr(e.target.value)}
            required
          />
          <label
            style={{ paddingLeft: "10px", paddingRight: "10px" }}
            htmlFor="delegate-pk"
            className="block mb-2 text-green-400"
          >
            Delegate Amount:
          </label>
          <input
            style={{ background: "grey" }}
            id="delegate-pk"
            name="delegate-pk"
            className="bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32"
            placeholder="Delegate's public key"
            onChange={(e) => setDelegateAmount(Number(e.target.value))}
            required
          />
        </div>

        <div className="text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
          <ul className="p-2">
            {delegateTokenOutputs.map(({ title, dependency, href }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && "mt-4"}`}
              >
                <p className="tracking-wider">{title}</p>
                {title !== "Delegate Amount"
                  ? dependency && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex text-[#80ebff] italic hover:text-white transition-all duration-200"
                      >
                        {title !== "Delegate Transaction Signature"
                          ? dependency.toString()
                          : `${dependency.toString().slice(0, 25)}...`}
                        <FaExternalLinkAlt className="w-5 ml-1" />
                      </a>
                    )
                  : dependency.toString()}
              </li>
            ))}
          </ul>
        </div>
      </form>

      <form
        onSubmit={(event) => unDelegateToken(event)}
        className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Revoke Delegate Token 🏂
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
            {undelegateTokenOutputs.map(
              ({ title, dependency, href }, index) => (
                <li
                  key={title}
                  className={`flex justify-between items-center ${index !== 0 && "mt-4"}`}
                >
                  <p className="tracking-wider">{title}</p>
                  {title !== "Delegate Transaction Signature"
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
              ),
            )}
          </ul>
        </div>
      </form>
    </>
  );
}
