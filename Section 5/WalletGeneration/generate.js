import { Wallet } from "xrpl";

const generateWallet = () => {
  const newWallet = Wallet.generate();
  return newWallet;
};

const deriveAddress = (seed) => {
  const newWallet = Wallet.deriveWallet(seed);
  return newWallet.classicAddress;
};

const wallet = generateWallet();
console.log(wallet);

const rAddress = deriveAddress(wallet.seed);
console.log(rAddress);
