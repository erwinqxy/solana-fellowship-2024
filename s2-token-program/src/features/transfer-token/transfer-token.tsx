import React from "react";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  Account,
} from "@solana/spl-token";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function TransferToken({
  mintAddress,
  account,
}: {
  mintAddress: web3.PublicKey;
  account: Account;
}) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [transferToAddr, setTransferToAddr] = React.useState("");
  const [transferAmount, setTransferAmount] = React.useState(0);

  // error handling; is wallet connected?
  const connectionErr = () => {
    if (!publicKey || !connection) {
      toast.error("Please connect your wallet");
      return true;
    } else {
      return false;
    }
  };

  const transferToken = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const desintationPk = new web3.PublicKey(transferToAddr)!;
      const associatedToken = await getAssociatedTokenAddress(
        mintAddress,
        desintationPk!,
      );

      //  create the token account for the desintation
      const transaction1 = new web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey!, //payer
          associatedToken, // associatedToken
          desintationPk, // destination address
          mintAddress, // mint
        ),
      );

      let signature = await sendTransaction(transaction1, connection);
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

      const fetchedAccount = await getAccount(connection, associatedToken);
      const transaction = new web3.Transaction().add(
        createTransferCheckedInstruction(
          account?.address!, // from (should be a token account)
          mintAddress, // mint
          fetchedAccount.address, // to (should be a token account)
          publicKey!, // from's owner
          transferAmount, // amount, if your deciamls is 8, send 10^8 for 1 token
          2, // decimals
        ),
      );

      signature = await sendTransaction(transaction, connection);
      console.log("Transaction signature:", signature);

      // wait for confirmation
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      toast.success("Transfer token success!");
    } catch (error) {
      console.log(error);
      toast.error("Transfer token failed.");
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => transferToken(event)}
        className="rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold">Transfer to ✈️</h2>
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
            htmlFor="transfer-pk"
            className="block mb-2 text-green-400"
          >
            Transfer to public key:
          </label>
          <input
            style={{ background: "grey" }}
            id="transfer-pk"
            name="transfer-pk"
            className="bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32"
            placeholder="Delegate's public key"
            onChange={(e) => setTransferToAddr(e.target.value)}
            required
          />
          <label
            style={{ paddingRight: "10px" }}
            htmlFor="transfer-amount"
            className="block mb-2 text-green-400"
          >
            Transfer Amount:
          </label>
          <input
            style={{ background: "grey" }}
            id="transfer-amount"
            name="transfer-amount"
            className="bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32"
            placeholder="Transfer amount"
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            required
          />
        </div>

        {/* <div className='text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
          <ul className='p-2'> */}
        {/* {delegateTokenOutputs.map(({ title, dependency }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && "mt-4"}`}
              >
                <p className="tracking-wider">{title}</p>
                {dependency && dependency.toString()}
              </li>
            ))} */}
        {/* </ul>
        </div> */}
      </form>
    </>
  );
}
