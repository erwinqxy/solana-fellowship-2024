import React from 'react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function Airdrop() {
  const [airdropTx, setAirdropTx] = React.useState<string>('');

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // error handling; is wallet connected?
  const connectionErr = () => {
    if (!publicKey || !connection) {
      toast.error('Please connect your wallet');
      return true;
    } else {
      return false;
    }
  };

  // create transaction to get air drop on the blockchain
  const airdropSol = async (event: { preventDefault: () => void }) => {
    // prevents page from refreshing
    event.preventDefault();

    // checks if wallet is connected
    if (connectionErr()) {
      return;
    }

    try {
      const signature = await connection.requestAirdrop(
        publicKey!,
        web3.LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(signature, 'processed');
      setAirdropTx(signature);
      toast.success('Airdrop success!')
    } catch (err) {
      toast.error('Error creating airdrop');
      console.log('error', err);
    }
  };

  const airdropOutputs = [
    {
      title: 'Public Key',
      dependency: publicKey!,
      href: `https://explorer.solana.com/address/${publicKey}?cluster=devnet`,
    },
    {
      title: 'Transaction Signature...',
      dependency: airdropTx,
      href: `https://explorer.solana.com/tx/${airdropTx}?cluster=devnet`,
    },
  ];

  return (
    <main className='max-w-7xl grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 text-white'>
      <form
        onSubmit={(event) => airdropSol(event)}
        className='rounded-lg min-h-content bg-[#2a302f] p-4 sm:col-span-6 lg:col-start-2 lg:col-end-6'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-lg sm:text-2xl font-semibold'>Airdrop SOL 🪂</h2>
          <button
            type='submit'
            className='bg-helius-orange rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:border-helius-orange disabled:opacity-50 disabled:hover:bg-helius-orange hover:bg-transparent disabled:cursor-not-allowed'
          >
            Submit
          </button>
        </div>
        <div className='text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2'>
          <ul className='p-2'>
            {airdropOutputs.map(({ title, dependency, href }, index) => (
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
                    {dependency.toString().slice(0, 25)}...
                    <FaExternalLinkAlt className='w-5 ml-1' />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </main>
  );
}
