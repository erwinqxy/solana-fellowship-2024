# s3-onchain-introduction

## Overview 

With the anchor framework, build an asset manager’s vault, where customers can deposit SPL tokens of their choice. The vault manager should not be able to withdraw the vault’s funds.

## Deployed Program

The Solana program is deployed on the Devnet cluster. You can interact with the deployed program and view transactions at the following link:

- Program Address: [8TYpZMoJYfSJQ466jNNs9UigJZCrYauvJVjCz5nEpvDn](https://explorer.solana.com/address/8TYpZMoJYfSJQ466jNNs9UigJZCrYauvJVjCz5nEpvDn?cluster=devnet)

  
## Main Learnings 

### Program Derived Addresses (PDA)

A Program Derived Address (PDA) is a special type of account in Solana that only your program can control.

- PDAs are addresses derived deterministically using a combination of user-defined seeds, a bump seed, and a program's ID.
- PDAs are addresses that fall off the Ed25519 curve and have no corresponding private key.

 By using a PDA, you can make sure that only the program (and not the vault manager or anyone else) can move the funds.

![pda](/s3-onchain-introduction/images/pda.png)

Useful resource here: https://solana.com/docs/core/pda

### Cross-Program Invocation (CPI)

Cross-Program Invocation (CPI) allows your program to call other Solana programs, like the SPL token program. This is useful when managing deposits and withdrawals securely.

![cpi](/s3-onchain-introduction/images/cpi.png)


Useful resource here: https://solana.com/docs/core/cpi

Together, PDAs and CPI enable you to create a secure vault where customers can deposit tokens, and the vault manager is restricted from withdrawing any funds.


## Functionality

### Deposit SPL Tokens

Deposits some SPL token into an account.

[Deposit SPL Tokens Transaction Signature Reference](https://explorer.solana.com/tx/4hasrGHPSCX8XHsNfJXRr2sMaiuN1VCyrRt3YCuaRcwuZ2EXfMt8Wq95jW4yrnMmtZRrfwi6fmasTsoWEyRABncZ?cluster=devnet)

![deposit-spl](/s3-onchain-introduction/images/deposit.png)

### Withdraw SPL Tokens

Withdraw some of the deposited SPL token into an account.

[Withdraw SPL Tokens Transaction Signature Reference](https://explorer.solana.com/tx/2MDbB5KnTtfs6Qni4DAcitD3kNZ1G514cfaaJ1LV9UJNozRzN1k2S17e1Tnb8wWme86XFunuK9qJze5X33wymYcR?cluster=devnet)

![withdraw-spl](/s3-onchain-introduction/images/withdraw.png)


## Learnings: Anchor

Anchor is a framework for quickly building secure Solana programs.

With Anchor you can build programs quickly because it writes various boilerplate for you such as (de)serialization of accounts and instruction data.

You can build secure programs more easily because Anchor handles certain security checks for you. On top of that, it allows you to succinctly define additional checks and keep them separate from your business logic.

An Anchor program consists of three parts.

1. The program module: where you write your business logic.
2. Accounts structs which are marked with #[derive(Accounts)]: where you validate accounts.
3. the declare_id macro: creates an ID field that stores the address of your program.

```rust
// use this import to gain access to common anchor features
use anchor_lang::prelude::*;


// declare an id for your program
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");


// write your business logic here
#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}


// validate incoming accounts here
#[derive(Accounts)]
pub struct Initialize {}
```

## Useful Resources

- [Anchor Docs](https://www.anchor-lang.com/docs/high-level-overview)
- [Anchor Space Calculator](https://anchorspace.vercel.app/)
