import { Principal } from '@dfinity/principal';
import { ExtendedPublicKey } from './bip32';

export type XPubKey = {
  readonly publicKey: Buffer;
  readonly chainCode: Buffer;
};

export type Icrc1Account = {
  owner: Principal;
  subaccount: Uint8Array | null;
};

export class Minter {
  public readonly pk: ExtendedPublicKey;

  constructor(public readonly key: XPubKey) {
    this.pk = new ExtendedPublicKey(Buffer.from(this.key.publicKey), Buffer.from(this.key.chainCode)).deriveChild(
      new Uint8Array([1]),
    );
  }

  public depositAddr(account: Icrc1Account): string {
    let key = this.pk.derivePath([account.owner.toUint8Array(), account.subaccount || new Uint8Array(32)]);
    return key.pubkeyAddress();
  }

  public depositAddrFunc(owner: Icrc1Account['owner']): (subaccount: Icrc1Account['subaccount']) => string {
    let pk2 = this.pk.deriveChild(owner.toUint8Array());
    return subaccount => pk2.deriveChild(subaccount || new Uint8Array(32)).pubkeyAddress();
  }
}
