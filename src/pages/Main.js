import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";

import Transactions from "../components/Transactions";

import Balance from "../components/Balance";

import "./main.scss";

function Main() {
  return (
    <div className="main">
      <section className="action-buttons">
        <Link to="/send">
          <Button variant="primary">
            <FontAwesomeIcon icon={faArrowTurnUp} />
            <span>Send</span>
          </Button>
        </Link>
      </section>
      <section className="balance-container">
        <Balance />
      </section>
      <section className="transactions-container">
        <Transactions />
      </section>
    </div>
  );
}

export default Main;
