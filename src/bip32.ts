import { createHash, createHmac } from 'crypto';
import { bech32 } from 'bech32';
import { ec as EC } from 'elliptic';
import { BN } from 'bn.js';

const ec = new EC('secp256k1');

export class ExtendedPublicKey {
  constructor(
    public readonly key: Buffer,
    public readonly chaincode: Buffer,
  ) {}

  derivePath(path: Uint8Array[]): ExtendedPublicKey {
    let target = new ExtendedPublicKey(this.key, this.chaincode);
    for (const childIndex of path) {
      target = target.deriveChild(childIndex);
    }
    return target;
  }

  deriveChild(index: Uint8Array): ExtendedPublicKey {
    const hmac = createHmac('sha512', this.chaincode);
    hmac.update(Buffer.concat([new Uint8Array(this.key), index]));
    const fullNode = hmac.digest();
    const left = fullNode.slice(0, 32);
    const right = fullNode.slice(32, 64);
    const multiplicand = BigInt(`0x${Buffer.from(left).toString('hex')}`);
    const curveN = ec.curve.n;
    if (multiplicand >= curveN) {
      throw new Error('Derivation failed');
    }
    const parentKey = ec.keyFromPublic(this.key);
    const derivedPoint = ec.g.mul(new BN(multiplicand.toString(16), 16)).add(parentKey.getPublic());
    return new ExtendedPublicKey(Buffer.from(derivedPoint.encodeCompressed()), right);
  }

  pubkeyAddress(): string {
    const hash = createHash('ripemd160').update(createHash('sha256').update(this.key).digest()).digest();
    return bech32.encode('bc', new Uint8Array([0, ...bech32.toWords(hash)]));
  }
}
