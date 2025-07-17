declare module 'js-encrypt' {
  export class JSEncrypt {
    constructor();
    setPublicKey(pubKey: string): void;
    setPrivateKey(privKey: string): void;
    encrypt(data: string): string | false;
    decrypt(data: string): string | false;
  }
}
