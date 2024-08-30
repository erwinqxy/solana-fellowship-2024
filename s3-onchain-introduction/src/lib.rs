use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("8TYpZMoJYfSJQ466jNNs9UigJZCrYauvJVjCz5nEpvDn");

#[program]
mod token_vault {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing token vault");
        Ok(())
    }

    pub fn deposit(ctx: Context<TransferAccounts>, deposit_amt: u64) -> Result<()> {
        msg!("Token amount being deposited: {}!", deposit_amt);

        // Ensure deposit amount is greater than 0
        if deposit_amt <= 0 {
            return err!(ErrorCode::InvalidDepositAmount);
        }

        // Instruction to send to the Token program.
        let transfer_instruction = Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        anchor_spl::token::transfer(cpi_ctx, deposit_amt)?;

        msg!("Tokens deposit successful.");

        Ok(())
    }

    pub fn withdraw(ctx: Context<TransferAccounts>, withdraw_amt: u64) -> Result<()> {
        msg!("Token amount being withdraw out: {}!", withdraw_amt);

        // Ensure vault balance is more than withdaw amount
        if ctx.accounts.vault_token_account.amount < withdraw_amt {
            return err!(ErrorCode::InvalidWithdrawAmount);
        }

        // Check that the vault and sender accounts are different
        if ctx.accounts.vault_token_account.key() == ctx.accounts.sender_token_account.key() {
            return Err(ErrorCode::InvalidWithdrawDestination.into());
        }

        // Instruction to send to the Token program.
        let transfer_instruction = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.sender_token_account.to_account_info(),
            authority: ctx.accounts.token_account_owner_pda.to_account_info(),
        };

        let bump = ctx.bumps.token_account_owner_pda;
        let seeds = &[b"token_account_owner_pda".as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );

        anchor_spl::token::transfer(cpi_ctx, withdraw_amt)?;

        msg!("Tokens withdrawal successful.");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        seeds=[b"token_account_owner_pda"],
        bump,
        space = 8
    )]
    token_account_owner_pda: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        seeds=[b"token_vault", mint_of_token_being_sent.key().as_ref()],
        token::mint=mint_of_token_being_sent,
        token::authority=token_account_owner_pda,
        bump
    )]
    vault_token_account: Account<'info, TokenAccount>,

    mint_of_token_being_sent: Account<'info, Mint>,

    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TransferAccounts<'info> {
    #[account(mut,
        seeds=[b"token_account_owner_pda"],
        bump
    )]
    token_account_owner_pda: AccountInfo<'info>,

    #[account(mut,
        seeds=[b"token_vault", mint_of_token_being_sent.key().as_ref()],
        bump,
        token::mint=mint_of_token_being_sent,
        token::authority=token_account_owner_pda,
    )]
    vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    sender_token_account: Account<'info, TokenAccount>,

    mint_of_token_being_sent: Account<'info, Mint>,

    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Deposit amount must be greater than 0")]
    InvalidDepositAmount,

    #[msg("Withdraw amount must be an amount available in the vault")]
    InvalidWithdrawAmount,

    #[msg("Only user who deposit can withdraw")]
    InvalidWithdrawDestination,
}
