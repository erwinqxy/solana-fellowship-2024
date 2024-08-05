"use client";

import React from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import GitHubButton from "react-github-btn";

// import '@solana/wallet-adapter-react-ui/styles.css';

export default function NavBar() {
  return (
    <nav className="p-4 flex justify-around bg-zinc-800">
      <div className="p-4 flex" style={{ flex: 1 }}>
        <div style={{ paddingRight: "10px" }}>
          <WalletMultiButton />
        </div>
        <div>
          <WalletDisconnectButton />
        </div>
      </div>
      <div>
        <GitHubButton href="https://github.com/erwinqxy/solana-fellowship-2024/tree/main/s2-token-program">
          s2-token-program repo by erwinqxy
        </GitHubButton>
      </div>
    </nav>
  );
}
