use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
};

pub fn initialize_account(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let payer_account = next_account_info(accounts_iter)?;
    let account_to_create = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let lamports = Rent::default().minimum_balance(8); // 8 bytes for storing u64
    let space = 8; // Space for the deposited SOL (u64)

    invoke(
        &system_instruction::create_account(
            payer_account.key,
            account_to_create.key,
            lamports,
            space as u64,
            program_id,
        ),
        &[
            payer_account.clone(),
            account_to_create.clone(),
            system_program.clone(),
        ],
    )?;

    msg!("Account initialized successfully");

    Ok(())
}

pub fn deposit_sol(_program_id: &Pubkey, accounts: &[AccountInfo], amount: u64) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let user_account = next_account_info(accounts_iter)?;
    let deposit_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Check that the user account is the signer
    if !user_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Check that the user account has sufficient funds
    if **user_account.try_borrow_lamports()? < amount {
        return Err(ProgramError::InsufficientFunds);
    }

    invoke(
        &system_instruction::transfer(user_account.key, deposit_account.key, amount),
        &[
            user_account.clone(),
            deposit_account.clone(),
            system_program.clone(),
        ],
    )?;

    msg!("Deposited {} lamports successfully", amount);

    Ok(())
}

pub fn withdraw_sol(_program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let user_account = next_account_info(accounts_iter)?;
    let deposit_account = next_account_info(accounts_iter)?;

    // Read the available balance from the deposit account
    let deposit_balance = **deposit_account.try_borrow_lamports()?;

    // Calculate 10% of the available balance
    let withdraw_amount = deposit_balance / 10;

    msg!("Attempting to withdraw 10% of balance: {}", withdraw_amount);

    // Ensure the deposit account has enough balance for the withdrawal
    if withdraw_amount > deposit_balance {
        return Err(ProgramError::InsufficientFunds);
    }

    // Perform the withdrawal
    **deposit_account.try_borrow_mut_lamports()? -= withdraw_amount;
    **user_account.try_borrow_mut_lamports()? += withdraw_amount;

    msg!("Withdrawn {} lamports successfully", withdraw_amount);

    Ok(())
}
