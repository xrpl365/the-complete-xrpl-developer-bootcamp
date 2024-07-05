import { Client, Wallet } from "xrpl";

// Get wallet from seed
const wallet = Wallet.fromSeed("sEdVKu68MNwhPkoCFVe8yMB59eYMfso");

// New ledger connection
const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

try {
  // Create account delete tx object
  const deleteTx = {
    Account: wallet.classicAddress, // rAddress we want to delete (ie this account)
    TransactionType: "AccountDelete", // Important to spell this correctly, case sensitive
    Destination: "rNPDk6orRr2YvtGgh1eT5KHB28oCYVvauG",
  };

  // Prepare the transaction
  const prepared = await client.autofill(deleteTx); // Autofill :-)

  // Sign the transaction
  const signed = wallet.sign(prepared);

  // Submit
  const result = await client.submitAndWait(signed.tx_blob);
  console.log(result);
} catch (error) {
  console.log(error);
} finally {
  await client.disconnect();
}
