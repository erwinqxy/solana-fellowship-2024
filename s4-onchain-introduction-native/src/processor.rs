use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

use crate::instruction::deposit_sol;
use crate::instruction::initialize_account;
use crate::instruction::withdraw_sol;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TransferInstruction {
    InitializeAccount,
    DepositSOL(u64),
    WithdrawSOL,
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {
    let instruction = TransferInstruction::try_from_slice(input)?;
    match instruction {
        TransferInstruction::InitializeAccount => initialize_account(program_id, accounts),
        TransferInstruction::DepositSOL(amount) => deposit_sol(program_id, accounts, amount),
        TransferInstruction::WithdrawSOL => withdraw_sol(program_id, accounts),
    }
}
