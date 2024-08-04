"use client";

import React from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// import '@solana/wallet-adapter-react-ui/styles.css';

export default function NavBar() {
  return (
    <nav className="p-4 flex justify-around bg-zinc-800">
      <div>
        <WalletMultiButton />
      </div>
      <div>
        <WalletDisconnectButton />
      </div>
    </nav>
  );
}
