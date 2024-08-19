# s5-exercise 

## Task 

Write a simple blog, or a README about the issues and how to fix them in the Anchor program below, and submit it in the airtable form shared.
[Insecure program](https://github.com/GitBolt/insecure-program)

## Attempt 

### 1. Missing Access Control (`CreateUser`)

- Issue: Anyone can call initialize and create user accounts, potentially leading to unauthorized user creation and manipulation of the points system.
- Fix: Introduce an "authority" account that can authorize user creation. Modify initialize to check if the caller is the authority before proceeding.

### 2. Lack of Input Validation (`CreateUser and TransferPoints`)

- Issue: The code doesn't validate id and name in initialize or id_sender, id_receiver, and amount in transfer_points. Attackers could exploit this for unintended behavior.
- Fix: 
  - In `initialize`, check if id is within a reasonable range (e.g., not negative) and potentially limit name length.
  - In `transfer_points`, validate that both `id_sender` and `id_receiver` exist before transferring points. Verify that amount is positive and doesn't overflow the points field.

### 3. Potential Reentrancy Attack (TransferPoints)

- Issue: The code doesn't explicitly check if the receiver account exists before modifying its points. This could be exploited for reentrancy attacks.
- Fix: Before updating receiver.points, ensure the receiver account exists using a Solana program library function like get_account.

### 4. Proper Implementation of remove_user

- Issue: The remove_user function only logs a message and does not actually remove or deactivate the account.
- Fix: Implement logic to deactivate or close the account, if that’s the intended functionality. Here’s a placeholder implementation:

### 5. Insecure Storage for name (CreateUser)

- Issue: While not a critical vulnerability in this example, storing long strings in the name field can become expensive on-chain.
- Fix: Consider alternative storage solutions for user names if they are expected to be lengthy. You could explore storing them off-chain or using a more space-efficient encoding.

### 6. Should Use Proper Error Handling:

- Issue: Ensure that all potential error conditions are covered.
- Fix: Define and use appropriate error codes in MyError to handle different scenarios.

```rust
#[error_code]
pub enum MyError {
    #[msg("Not enough points to transfer")]
    NotEnoughPoints,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Account not found")]
    AccountNotFound,
}
```
