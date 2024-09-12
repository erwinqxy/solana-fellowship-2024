# Solana Keypair Generation and Usage

This guide explains how to generate a Solana keypair, save it to a JSON file, and load it back into a TypeScript application using the `@solana/web3.js` library.

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (optional)
- TypeScript setup
- `@solana/web3.js` library installed

## Installation

To get started, install the `@solana/web3.js` library:

```bash
npm install @solana/web3.js
```

## Generating a Solana Keypair
You can generate a Solana keypair and save it to a key.json file using either the Solana CLI or a Node.js script.

Option 1: Using Solana CLI
If you have the Solana CLI installed, you can generate a keypair and save it directly to a file:

```bash
solana-keygen new --outfile key.json
```

Option 2: Using a Node.js Script
Alternatively, you can use a Node.js script to generate a keypair and save it to a JSON file.

Create a script (generateKeypair.js):

```typescript
const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

// Generate a new Solana keypair
const keypair = Keypair.generate();

// Extract the secret key
const secretKey = Array.from(keypair.secretKey);

// Write the secret key to a JSON file
fs.writeFileSync('key.json', JSON.stringify(secretKey));

console.log('Keypair generated and saved to key.json');
```
Run the script:
```bash
node generateKeypair.js
```

This script will generate a new Solana keypair and save the secret key in an array format to key.json.

## Expected JSON Structure of key.json

The JSON file key.json should contain an array of 64 integers. The first 32 integers represent the private key (secret key), and the next 32 integers are the public key derived from the private key.

Example key.json file:
```json
[
  159, 47, 98, 157, 202, 138, 90, 208, 184, 137, 246, 213, 53, 104, 10, 101,
  244, 44, 117, 209, 204, 12, 34, 187, 248, 39, 196, 188, 134, 184, 27, 53,
  195, 183, 112, 20, 150, 75, 128, 15, 251, 74, 94, 43, 197, 129, 96, 214,
  199, 18, 22, 118, 156, 93, 156, 126, 67, 182, 251, 207, 241, 205, 239, 12
]
```

## Loading a Keypair from a JSON File in TypeScript

To load a Solana keypair from a JSON file, you can use the following TypeScript function:

```typescript
import fs from 'fs';
import { Keypair } from '@solana/web3.js';

/**
 * Load a locally stored JSON keypair file and convert it to a valid Keypair.
 * @param absPath - The absolute path to the keypair JSON file.
 * @returns A Solana Keypair object.
 */
export function loadKeypairFromFile(absPath: string): Keypair {
  try {
    if (!absPath) throw new Error('No path provided');
    if (!fs.existsSync(absPath)) throw new Error('File does not exist at the provided path.');

    // Load the keypair from the file
    const keyfileBytes = JSON.parse(fs.readFileSync(absPath, { encoding: 'utf-8' }));
    
    // Parse the loaded secretKey into a valid Keypair
    const keypair = Keypair.fromSecretKey(new Uint8Array(keyfileBytes));
    
    return keypair;
  } catch (err) {
    // Handle errors appropriately by rethrowing
    throw new Error(`Failed to load keypair from file: ${(err as Error).message}`);
  }
}
```

## How to Use the loadKeypairFromFile Function

Ensure you have a valid key.json file saved locally.

Call the function with the absolute path to the key.json file:

```typescript
const keypair = loadKeypairFromFile('/absolute/path/to/key.json');
console.log('Public Key:', keypair.publicKey.toBase58());
```

This will load the keypair and print the public key derived from the loaded keypair.
