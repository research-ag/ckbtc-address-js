import { bech32 } from 'bech32';
import { ec as EC } from 'elliptic';
import { BN } from 'bn.js';
import { hmac, ripemd, sha, sha256 } from 'hash.js';

const ec = new EC('secp256k1');

export class ExtendedPublicKey {
  constructor(
    public readonly key: Uint8Array,
    public readonly chaincode: Uint8Array,
  ) {}

  derivePath(path: Uint8Array[]): ExtendedPublicKey {
    let target = new ExtendedPublicKey(this.key, this.chaincode);
    for (const childIndex of path) {
      target = target.deriveChild(childIndex);
    }
    return target;
  }

  deriveChild(index: Uint8Array): ExtendedPublicKey {
    const fullNode = hmac(sha.sha512 as any, this.chaincode)
      .update(new Uint8Array([...this.key, ...index]))
      .digest();

    const left = fullNode.slice(0, 32);
    const right = fullNode.slice(32, 64);
    const multiplicand = BigInt('0x' + [...left].map(b => b.toString(16).padStart(2, '0')).join(''));
    const curveN = ec.curve.n;
    if (multiplicand >= curveN) {
      throw new Error('Derivation failed');
    }
    const parentKey = ec.keyFromPublic(this.key);
    const derivedPoint = ec.g.mul(new BN(multiplicand.toString(16), 16)).add(parentKey.getPublic());
    return new ExtendedPublicKey(derivedPoint.encodeCompressed(), new Uint8Array(right));
  }

  pubkeyAddress(): string {
    let hash = ripemd.ripemd160().update(sha256().update(this.key).digest()).digest();
    return bech32.encode('bc', new Uint8Array([0, ...bech32.toWords(hash)]));
  }
}
