import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";

import "./transaction.scss";

function Transaction({ transaction }) {
  const truncateAddress = (address) => {
    if (typeof address !== "string") return "";
    if (address.length <= 22) return address;
    return `${address.substring(0, 6)}....${address.substring(address.length - 16)}`;
  };

  const transactionResult = (result) => {
    return result === "tesSUCCESS" ? (
      <>
        <FontAwesomeIcon
          icon={faThumbsUp}
          className="status-ok"
        />
      </>
    ) : (
      <>
        <span className="status-warning">{friendlyWarning(result)}</span>
      </>
    );
  };

  const friendlyWarning = (message) => {
    switch (message) {
      case "tecUNFUNDED_PAYMENT":
        return "Insufficient funds";
      // Add more warnings here over time.
      default:
        return { message };
    }
  };

  const explorerLink = (hash) => {
    return (
      <Button
        href={`https://testnet.xrpl.org/transactions/${hash}`}
        target="_blank"
        className="view-on-explorer"
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    );
  };

  return (
    <div className="row">
      <div className="col-3">{transaction.direction}</div>
      <div className="col-9">{transaction.amount} XRP</div>

      <div className="col-3">{transaction.direction === "Sent" ? "To" : "From"}</div>
      <div className="col-9">{truncateAddress(transaction.destination)}</div>

      <div className="col-3">On</div>
      <div className="col-9">{transaction.date.toLocaleString()}</div>

      <div className="col-3">Status</div>
      <div className="col-9">{transactionResult(transaction.transactionResult)}</div>

      <div className="col-3"></div>
      <div className="col-9">{explorerLink(transaction.hash)}</div>
    </div>
  );
}

export default Transaction;
