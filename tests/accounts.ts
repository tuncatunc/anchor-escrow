import * as anchor from '@project-serum/anchor';
import { PublicKey, SystemProgram, Transaction, Connection, Commitment } from '@solana/web3.js';

import escrowPrivateKey from './keypair/anchor_escrow-keypair.json';
import initializerPrivateKey from './keypair/id.json';
import mintA from "./keypair/mintA.json";
import mintB from "./keypair/mintB.json";
import tokenAccountA from "./keypair/tokenA-account.json";
import tokenAccountB from "./keypair/tokenB-account.json";

const initializerMainAccount = anchor.web3.Keypair.fromSecretKey(new Uint8Array(initializerPrivateKey));
const mintAAccount = new PublicKey(mintA.publicKey);    
const mintBAccount = new PublicKey(mintB.publicKey);
const initializerTokenAccountA = new PublicKey(tokenAccountA.publicKey);
const initializerTokenAccountB = new PublicKey(tokenAccountB.publicKey);
const escrowAccount = anchor.web3.Keypair.fromSecretKey(new Uint8Array(escrowPrivateKey));

export {
    escrowAccount,
    initializerMainAccount,
    initializerTokenAccountA,
    initializerTokenAccountB,
    mintAAccount,
    mintBAccount,
}
