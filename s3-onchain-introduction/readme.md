# s3-onchain-introduction

Build an asset manager’s vault, where customers can deposit SPL tokens of their choice. The vault manager should not be able to withdraw the vault’s funds.

Deployed here: https://explorer.solana.com/address/8TYpZMoJYfSJQ466jNNs9UigJZCrYauvJVjCz5nEpvDn?cluster=devnet


## Anchor

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

# Useful Resources
- [Anchor Docs](https://www.anchor-lang.com/docs/high-level-overview)
- [Anchor Space Calculator](https://anchorspace.vercel.app/)
