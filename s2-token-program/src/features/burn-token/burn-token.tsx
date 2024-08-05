import React from "react";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { Account, createBurnCheckedInstruction } from "@solana/spl-token";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function BurnToken({
  mintAddress,
  account,
}: {
  mintAddress: web3.PublicKey;
  account: Account;
}) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [tokenBalance, setTokenBalance] = React.useState("0");
  const [burnAmount, setBurnAmount] = React.useState(0);

  // error handling; is wallet connected?
  const connectionErr = () => {
    if (!publicKey || !connection) {
      toast.error("Please connect your wallet");
      return true;
    } else {
      return false;
    }
  };

  const burnToken = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const transaction = new web3.Transaction().add(
        createBurnCheckedInstruction(
          account?.address!, // receiver (should be a token account)
          mintAddress, // mint
          publicKey!, // owner of token account
          burnAmount,
          2, // decimals
        ),
      );
      const signature = await sendTransaction(transaction, connection);
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

      toast.success("Burn token success!");

      // fetch supply
      let tokenAmount = await connection.getTokenAccountBalance(
        account?.address!,
      );
      setTokenBalance(
        Number(
          Number(tokenAmount.value.amount) /
            Math.pow(10, tokenAmount.value.decimals),
        ).toFixed(tokenAmount.value.decimals),
      );

      toast.success("Burn txns confirmed! Supply updated");
    } catch (error) {
      console.error(error);
      toast.error("Burn token failed.");
    }
  };

  const mintTokenOutputs = [
    {
      title: "Token Address...",
      dependency: mintAddress,
      href: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    },
    {
      title: "Supply...",
      dependency: tokenBalance!,
    },
  ];

  return (
    <>
      <form
        onSubmit={(event) => burnToken(event)}
        className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold">Burn Token 🔥</h2>
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
            htmlFor="amount"
            className="block mb-2 text-green-400"
          >
            Amount:
          </label>
          <input
            style={{ background: "grey" }}
            id="amount"
            name="amount"
            min="0"
            className="bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32"
            placeholder="Enter amount"
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            required
          />
        </div>

        <div className="text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
          <ul className="p-2">
            {mintTokenOutputs.map(({ title, dependency }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && "mt-4"}`}
              >
                <p className="tracking-wider">{title}</p>
                {dependency && dependency.toString()}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </>
  );
}
