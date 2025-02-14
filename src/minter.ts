import { Principal } from '@dfinity/principal';
import { ExtendedPublicKey } from './bip32';

export type XPubKey = {
  readonly publicKey: Uint8Array;
  readonly chainCode: Uint8Array;
};

export type Icrc1Account = {
  owner: Principal | string;
  subaccount: Uint8Array | null;
};

export class Minter {
  public readonly pk: ExtendedPublicKey;

  constructor(public readonly key: XPubKey) {
    this.pk = new ExtendedPublicKey(this.key.publicKey, this.key.chainCode).deriveChild(new Uint8Array([1]));
  }

  public depositAddr(account: Icrc1Account): string {
    let ownerP = typeof account.owner === 'string' ? Principal.fromText(account.owner) : account.owner;
    let key = this.pk.derivePath([ownerP.toUint8Array(), account.subaccount || new Uint8Array(32)]);
    return key.pubkeyAddress();
  }

  public depositAddrFunc(owner: Icrc1Account['owner']): (subaccount: Icrc1Account['subaccount']) => string {
    let ownerP = typeof owner === 'string' ? Principal.fromText(owner) : owner;
    let pk2 = this.pk.deriveChild(ownerP.toUint8Array());
    return subaccount => pk2.deriveChild(subaccount || new Uint8Array(32)).pubkeyAddress();
  }
}
