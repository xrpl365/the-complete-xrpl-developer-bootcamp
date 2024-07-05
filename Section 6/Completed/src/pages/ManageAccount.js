import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTrash, faList } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useAccounts } from "../contexts/AccountContext";

import "./manage-account.scss";

function ManageAccount() {
  const { accounts, removeAccount, selectWallet } = useAccounts();

  const handleSelectAccount = (account) => {
    selectWallet(account);
  };

  const handleRemoveAccount = (account) => {
    removeAccount(account);
  };

  return (
    <div className="manage-accounts">
      <h1>
        <FontAwesomeIcon icon={faList} />
        <span>My Accounts</span>
      </h1>

      <ul>
        {accounts.map((account) => (
          <li key={account.address}>
            <div className="address">{account.address}</div>
            <div className="buttons-container">
              <Button
                variant="primary"
                onClick={() => handleSelectAccount(account)}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </Button>
              <Button
                variant="danger"
                onClick={() => handleRemoveAccount(account)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="action-buttons">
        <Link to="/import-account">
          <Button variant="primary">Import</Button>
        </Link>
        <Link to="/generate-account">
          <Button variant="success">Generate New</Button>
        </Link>
      </div>
    </div>
  );
}

export default ManageAccount;
