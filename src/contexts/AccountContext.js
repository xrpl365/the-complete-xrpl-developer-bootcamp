import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Client, dropsToXrp } from "xrpl";

// Create a context
const AccountContext = createContext();

// Provider component
export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState();
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState([]);
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

  const _getTransactions = useCallback(async (account) => {
    if (account) {
      // Create client connection
      const client = new Client(process.env.REACT_APP_NETWORK);
      await client.connect();

      try {
        const allTransactions = await client.request({
          command: "account_tx",
          account: account.address,
          ledger_index_min: -1, // Optional - Use to specify the earliest ledger to include transactions from. -1 = earliest validated ledger.
          ledger_index_max: -1, // Optional - Use to specify the newest ledger to include transactions from. -1 = newest validated ledger.
          limit: 20, // Optional - limit the number of transactions to receive.
          forward: false, // Optional - Returns the transactions with the oldest ledger first when set to true
        });

        // Filter the transactions - we only care about payments in XRP.
        const filteredTransactions = allTransactions.result.transactions
          .filter((transaction) => {
            // Filter for Payment transactions only.
            if (transaction.tx.TransactionType !== "Payment") return false;

            // Filter for only XRP payments.
            return typeof transaction.tx.Amount === "string";
          })
          .map((transaction) => {
            return {
              account: transaction.tx.Account,
              destination: transaction.tx.Destination,
              hash: transaction.tx.hash,
              direction: transaction.tx.Account === account.address ? "Sent" : "Received",
              date: new Date((transaction.tx.date + 946684800) * 1000),
              transactionResult: transaction.meta.TransactionResult,
              amount:
                transaction.meta.TransactionResult === "tesSUCCESS"
                  ? dropsToXrp(transaction.meta?.delivered_amount)
                  : 0,
            };
          });

        setTransactions(filteredTransactions);
      } catch (error) {
        console.log(error);
        setTransactions([]);
      } finally {
        await client.disconnect();
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
    _getTransactions(selectedWallet);
  }, [selectedWallet, _getBalance, _getTransactions]);

  const refreshBalance = () => {
    _getBalance(selectedWallet);
  };

  const refreshTransactions = () => {
    _getTransactions(selectedWallet);
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
        transactions,
        reserve,
        refreshBalance,
        refreshTransactions,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook
export const useAccounts = () => useContext(AccountContext);
