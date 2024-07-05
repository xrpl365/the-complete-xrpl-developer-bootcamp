import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Client, dropsToXrp } from "xrpl";

// Create a context
const AccountContext = createContext();

// Provider component
export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState();
  const [balance, setBalance] = useState();
  const [reserve, setReserve] = useState();

  const _getBalance = useCallback(async (account) => {
    if (account) {
      // Create a connection to the ledger
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();

      // Get the account balance from the latest ledger account info
      try {
        const response = await client.request({
          command: "account_info",
          account: account.address,
          ledger_index: "validated", // specify a ledger index OR a shortcut like validated, current or closed.
        });

        // Convert the balance returned in drops to XRP
        setBalance(dropsToXrp(response.result.account_data.Balance));
      } catch (error) {
        console.log(error);
        setBalance(); // Set balance to undefined - account doesn't exist
      } finally {
        client.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    const storedAccounts = localStorage.getItem("accounts");
    const storedDefault = localStorage.getItem("selectedAccount");
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }
    if (storedDefault) {
      setSelectedWallet(JSON.parse(storedDefault));
    }

    const getCurrentReserve = async () => {
      // Create a connection to the ledger
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();

      // Get the account balance from the latest ledger account info
      try {
        const response = await client.request({
          command: "server_info",
        });

        const reserve = response.result.info.validated_ledger.reserve_base_xrp;
        setReserve(reserve);
      } catch (error) {
        console.log(error);
      } finally {
        client.disconnect();
      }
    };

    getCurrentReserve();
  }, []);

  useEffect(() => {
    _getBalance(selectedWallet);
  }, [selectedWallet, _getBalance]);

  const refreshBalance = () => {
    _getBalance(selectedWallet);
  };

  const selectWallet = (account) => {
    localStorage.setItem("selectedAccount", JSON.stringify(account));
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
    <AccountContext.Provider
      value={{
        accounts,
        addAccount,
        removeAccount,
        selectWallet,
        balance,
        reserve,
        refreshBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook
export const useAccounts = () => useContext(AccountContext);
