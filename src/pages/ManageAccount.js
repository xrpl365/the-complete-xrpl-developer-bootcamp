import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTrash, faList } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";

import "./manage-account.scss";

function ManageAccount() {
  return (
    <div className="manage-accounts">
      <h1>
        <FontAwesomeIcon icon={faList} />
        <span>My Accounts</span>
      </h1>

      <ul>
        <li>
          <div className="address">Fake rAddress</div>
          <div className="buttons-container">
            <Button variant="primary">
              <FontAwesomeIcon icon={faThumbsUp} />
            </Button>
            <Button variant="danger">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default ManageAccount;
