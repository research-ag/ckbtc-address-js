import { Minter } from "../src";
import { Principal } from "@dfinity/principal";

describe('Minter', () => {

  let minter = new Minter({
    publicKey: Buffer.from([0x02, 0x22, 0x04, 0x7A, 0x81, 0xD4, 0xF8, 0xA0, 0x67, 0x03, 0x1C, 0x89, 0x27, 0x3D, 0x24, 0x1B, 0x79, 0xA5, 0xA0, 0x07, 0xC0, 0x4D, 0xFA, 0xF3, 0x6D, 0x07, 0x96, 0x3D, 0xB0, 0xB9, 0x90, 0x97, 0xEB]),
    chainCode: Buffer.from([0x82, 0x1A, 0xEB, 0xB6, 0x43, 0xBD, 0x97, 0xD3, 0x19, 0xD2, 0xFD, 0x0B, 0x2E, 0x48, 0x3D, 0x4E, 0x7D, 0xE2, 0xEA, 0x90, 0x39, 0xFF, 0x67, 0x56, 0x8B, 0x69, 0x3E, 0x6A, 0xBC, 0x14, 0xA0, 0x3B]),
  });

  let userToSubaccount = (user: Principal): Uint8Array => {
    let arr = Array.from(user.toUint8Array());
    arr.unshift(arr.length);
    while (arr.length < 32) {
      arr.unshift(0);
    }
    return new Uint8Array(arr);
  };

  // get deposit address for a user of the auction backend
  let f_3gvau = minter.depositAddrFunc("3gvau-pyaaa-aaaao-qa7kq-cai");
  let f_farwr = minter.depositAddrFunc(Principal.fromText("farwr-jqaaa-aaaao-qj4ya-cai"));

  test('3gvau anonymous', () => {
    let sa = userToSubaccount(Principal.fromText("2vxsx-fae"));
    expect(f_3gvau(sa)).toBe("bc1q9q0kg90px3w9dadxku2x5pme77plcqxtn535rt");
  });

  test('3gvau user', () => {
    let sa = userToSubaccount(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"));
    expect(f_3gvau(sa)).toBe("bc1qvxx6fzd8hzzw070zsd5m0k0eh00593negrvtrj");
  });

  test('farwr anonymous', () => {
    let sa = userToSubaccount(Principal.fromText("2vxsx-fae"));
    expect(f_farwr(sa)).toBe("bc1q7grqgee386r6qf74srt4h0s69cvkav7kgup4l7");
  });

  test('farwr user 1', () => {
    let sa = userToSubaccount(Principal.fromText("mgqao-xam3j-a3ruc-umodo-tnifj-sszm7-7lilh-aibsy-2u7uz-gwph7-jae"));
    expect(f_farwr(sa)).toBe("bc1qpamdxt8rx5lr256dq7u4dnua02tlrdwyeerzwx");
  });

  test('farwr user 2', () => {
    let sa = userToSubaccount(Principal.fromText("rl3fy-hyflm-6r3qg-7nid5-lr6cp-ysfwh-xiqme-stgsq-bcga5-vnztf-mqe"));
    expect(f_farwr(sa)).toBe("bc1qxzlu00s4k83ts763s57xz89n3tnwfm3q6z3pt8");
  });

  test('farwr user 2 full derivation', () => {
    let sa = userToSubaccount(Principal.fromText("rl3fy-hyflm-6r3qg-7nid5-lr6cp-ysfwh-xiqme-stgsq-bcga5-vnztf-mqe"));
    let address = minter.depositAddr({
      owner: Principal.fromText("farwr-jqaaa-aaaao-qj4ya-cai"),
      subaccount: sa,
    })
    expect(address).toBe("bc1qxzlu00s4k83ts763s57xz89n3tnwfm3q6z3pt8");
  });

});
