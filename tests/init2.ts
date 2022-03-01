import * as anchor from '@project-serum/anchor';
import { PublicKey, SystemProgram, Transaction, Connection, Commitment } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { 
    escrowAccount, 
    initializerMainAccount, 
    initializerTokenAccountA, 
    initializerTokenAccountB, 
    mintAAccount, 
    mintBAccount } from './accounts'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

const takerAmount = 1000;
const initializerAmount = 500;

const commitment: Commitment = 'processed';
const connection = new Connection('https://api.devnet.solana.com', { commitment, wsEndpoint: 'wss://api.devnet.solana.com/' });
const options = anchor.Provider.defaultOptions();
const wallet = NodeWallet.local();
const provider = new anchor.Provider(connection, wallet, options);

  anchor.setProvider(provider);
// Read the generated IDL.
const idl = JSON.parse(
    require("fs").readFileSync("./keypair/anchor_escrow.json", "utf8")
  );
  
// Address of the deployed program.
const programId = new anchor.web3.PublicKey("2yTRYBq58ZMgudQcEp18UnsCBPTUx9a12ZnzZ7N7v9hQ");

// Generate the program client from IDL.
const program = new anchor.Program(idl, programId);
  
const initEscrow = async () => {
    const [_vault_account_pda, _vault_account_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"))],
        escrowAccount.publicKey,
    );
    const vault_account_pda = _vault_account_pda;
    const vault_account_bump = _vault_account_bump;

    const [_vault_authority_pda, _vault_authority_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("escrow"))],
        escrowAccount.publicKey,
    );
    const vault_authority_pda = _vault_authority_pda;
    // DEBUG BEGIN
    console.info(`initializerMainAccount: ` + initializerMainAccount.publicKey.toBase58());
    console.info(`Mint A token program id: ` + mintAAccount.toBase58());
    // DEBUG CONSOLE END
    await program.rpc.initialize(
        vault_account_bump,
        new anchor.BN(initializerAmount),
        new anchor.BN(takerAmount),
        {
            accounts: {
                initializer: initializerMainAccount.publicKey,
                vaultAccount: vault_account_pda,
                mint: mintAAccount,
                initializerDepositTokenAccount: initializerTokenAccountA,
                initializerReceiveTokenAccount: initializerTokenAccountB,
                escrowAccount: escrowAccount.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                tokenProgram: mintAAccount,
            },
            instructions: [
                await program.account.escrowAccount.createInstruction(escrowAccount),
            ],
            signers: [escrowAccount, initializerMainAccount],
        }
    );
}

initEscrow();