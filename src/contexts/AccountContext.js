import { createContext, useContext, useState, useEffect } from "react";

// Create a context
const AccountContext = createContext();

// Provider component
export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState();

  useEffect(() => {
    const storedAccounts = localStorage.getItem("accounts");
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }
  }, []);

  const selectWallet = (account) => {
    setSelectedWallet(account);
  };

  const addAccount = (account) => {
    setAccounts((prevAccounts) => {
      const isDuplicate = prevAccounts.some((a) => a.address === account.address);

      if (isDuplicate) {
        // TODO: Update to use notifications system
        console.log("Account duplication: not added");
        return prevAccounts;
      } else {
        const updatedAccounts = [...prevAccounts, account];
        localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
        return updatedAccounts;
      }
    });
  };

  const removeAccount = (account) => {
    setAccounts((prevAccounts) => {
      const updatedAccounts = prevAccounts.filter((a) => a !== account);
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };

  return (
    <AccountContext.Provider value={{ accounts, addAccount, removeAccount, selectWallet }}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook
export const useAccounts = () => useContext(AccountContext);
