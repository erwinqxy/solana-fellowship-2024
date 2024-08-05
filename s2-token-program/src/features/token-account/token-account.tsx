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
  createMintToCheckedInstruction,
  Account,
  createBurnCheckedInstruction,
  createApproveCheckedInstruction,
  createRevokeInstruction,
  createTransferCheckedInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { FaExternalLinkAlt } from "react-icons/fa";

export default function TokenAccount({
  mintAddress,
}: {
  mintAddress: web3.PublicKey;
}) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [tokenBalance, setTokenBalance] = React.useState("0");

  const [mintAmount, setMintAmount] = React.useState(0);
  const [burnAmount, setBurnAmount] = React.useState(0);

  const [delegatePublicKeyStr, setDelegatePublicKeyStr] = React.useState("");
  const [delegateAmount, setDelegateAmount] = React.useState(0);

  const [transferToAddr, setTransferToAddr] = React.useState("");
  const [transferAmount, setTransferAmount] = React.useState(0);

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

  const mintToken = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const transaction = new web3.Transaction().add(
        createMintToCheckedInstruction(
          mintAddress, // mint
          account?.address!, // receiver (should be a token account)
          publicKey!, // mint authority
          mintAmount,
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

      toast.success("Mint token success!");

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

      toast.success("Mint txns confirmed! Supply updated");
    } catch (error) {
      console.error(error);
      toast.error("Mint token failed.");
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

  const transferToken = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }
    try {
      const desintationPk = new web3.PublicKey(transferToAddr)!
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
          mintAddress // mint
        )
      );

      let signature = await sendTransaction(transaction1, connection);
      console.log('Transaction signature:', signature);
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
          2 // decimals
        )
      );

      signature = await sendTransaction(transaction, connection);
      console.log('Transaction signature:', signature);

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

  const tokenAccountOutputs = [
    {
      title: "Owner...",
      dependency: owner,
      href: `https://explorer.solana.com/address/${owner}?cluster=devnet`,
    },
    {
      title: "Mint...",
      dependency: mint,
      href: `https://explorer.solana.com/address/${mint}?cluster=devnet`,
    },
    {
      title: "Delegate...",
      dependency: delegate,
    },
  ];

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

  const delegateTokenOutputs = [
    {
      title: "Delegate's Address...",
      dependency: delegatePublicKeyStr,
      href: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    },
    {
      title: "Delegate Amount",
      dependency: delegateAmount!,
    },
  ];

  return (
    <>
      <form
        onSubmit={(event) => createTokenAccount(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Token Account 🥳</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div className='text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
          <ul className='p-2'>
            {tokenAccountOutputs.map(({ title, dependency, href }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && 'mt-4'}`}
              >
                <p className='tracking-wider'>{title}</p>
                {dependency && (
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex text-[#80ebff] italic hover:text-white transition-all duration-200'
                  >
                    {dependency.toString()}
                    <FaExternalLinkAlt className='w-5 ml-1' />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </form>
      <form
        onSubmit={(event) => mintToken(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Mint Token 🤑</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
          }}
        >
          <label
            style={{ paddingRight: '10px' }}
            htmlFor='amount'
            className='block mb-2 text-green-400'
          >
            Amount:
          </label>
          <input
            style={{ background: 'grey' }}
            id='amount'
            name='amount'
            min='0'
            className='bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32'
            placeholder='Enter amount'
            onChange={(e) => setMintAmount(Number(e.target.value))}
            required
          />
        </div>

        <div className='text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
          <ul className='p-2'>
            {mintTokenOutputs.map(({ title, dependency }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && 'mt-4'}`}
              >
                <p className='tracking-wider'>{title}</p>
                {dependency && dependency.toString()}
              </li>
            ))}
          </ul>
        </div>
      </form>
      <form
        onSubmit={(event) => burnToken(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Burn Token 🔥</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
          }}
        >
          <label
            style={{ paddingRight: '10px' }}
            htmlFor='amount'
            className='block mb-2 text-green-400'
          >
            Amount:
          </label>
          <input
            style={{ background: 'grey' }}
            id='amount'
            name='amount'
            min='0'
            className='bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32'
            placeholder='Enter amount'
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            required
          />
        </div>

        <div className='text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
          <ul className='p-2'>
            {mintTokenOutputs.map(({ title, dependency }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && 'mt-4'}`}
              >
                <p className='tracking-wider'>{title}</p>
                {dependency && dependency.toString()}
              </li>
            ))}
          </ul>
        </div>
      </form>

      <form
        onSubmit={(event) => delegateToken(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Delegate Token 🏂</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
          }}
        >
          <label
            style={{ paddingRight: '10px' }}
            htmlFor='delegate-pk'
            className='block mb-2 text-green-400'
          >
            Delegate's public key:
          </label>
          <input
            style={{ background: 'grey' }}
            id='delegate-pk'
            name='delegate-pk'
            className='bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32'
            placeholder="Delegate's public key"
            onChange={(e) => setDelegatePublicKeyStr(e.target.value)}
            required
          />
          <label
            style={{ paddingLeft: '10px', paddingRight: '10px' }}
            htmlFor='delegate-pk'
            className='block mb-2 text-green-400'
          >
            Delegate Amount:
          </label>
          <input
            style={{ background: 'grey' }}
            id='delegate-pk'
            name='delegate-pk'
            className='bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32'
            placeholder="Delegate's public key"
            onChange={(e) => setDelegateAmount(Number(e.target.value))}
            required
          />
        </div>

        <div className='text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
          <ul className='p-2'>
            {delegateTokenOutputs.map(({ title, dependency }, index) => (
              <li
                key={title}
                className={`flex justify-between items-center ${index !== 0 && 'mt-4'}`}
              >
                <p className='tracking-wider'>{title}</p>
                {dependency && dependency.toString()}
              </li>
            ))}
          </ul>
        </div>
      </form>

      <form
        onSubmit={(event) => unDelegateToken(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Revoke Delegate Token 🏂</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
          }}
        ></div>
      </form>

      <form
        onSubmit={(event) => transferToken(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Transfer to ✈️</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
          }}
        >
          <label
            style={{ paddingRight: '10px' }}
            htmlFor='transfer-pk'
            className='block mb-2 text-green-400'
          >
            Transfer to public key:
          </label>
          <input
            style={{ background: 'grey' }}
            id='transfer-pk'
            name='transfer-pk'
            className='bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32'
            placeholder="Delegate's public key"
            onChange={(e) => setTransferToAddr(e.target.value)}
            required
          />
          <label
            style={{ paddingRight: '10px' }}
            htmlFor='transfer-amount'
            className='block mb-2 text-green-400'
          >
            Transfer Amount:
          </label>
          <input
            style={{ background: 'grey' }}
            id='transfer-amount'
            name='transfer-amount'
            className='bg-[#333638] border border-gray-600 rounded-lg text-white placeholder-gray-400 p-2 ml-2 w-32'
            placeholder='Transfer amount'
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
