# BTC Deposit Address Generator for ckBTC Minter

This Typescript module provides an implementation of a Bitcoin address derivation algorithm for depositing BTC to the ckBTC minter on the Internet Computer.

## Overview

The module derives SegWit (P2WPKH) Bitcoin addresses for depositing BTC into a ckBTC minter using an extended public key (xpub). It follows the BIP32 key derivation standard.

### Features
- BIP32 hierarchical deterministic (HD) key derivation
- SegWit (P2WPKH) Bitcoin address generation
- Computing deposit addresses for ICRC-1 accounts

## Installation

```sh
npm install ckbtc-address-js --save
```

## Usage

### Importing the Module

```typescript
import { Minter } from "ckbtc-address-js";
```

### Creating a Minter Instance

```typescript
let minter = Minter(xpub);
```

### Deriving a BTC Deposit Address

For a given ICRC-1 account:

```typescript
let account = {
    owner: Principal.fromText("<owner-principal>"),
    subaccount: null,
};

let depositAddress = minter.depositAddr(account);
```

Alternatively, using a function-based approach:

```typescript
let depositAddressFunc = minter.depositAddrFunc(Principal.fromText("<owner-principal>"));
let btcAddress = depositAddressFunc(null);  // Passing optional subaccount
```

## Testing

Run the module tests:

```sh
npm run test
```

## Module Structure

The package consists of:

### `bip32.ts`
- Implements BIP32 key derivation.
- Provides functions for deriving child keys and computing Bitcoin addresses.

### `minter.ts`
- Implements the `Minter` class.
- Computes deposit addresses based on the derived keys.

## License

This project is licensed under the MIT License.

