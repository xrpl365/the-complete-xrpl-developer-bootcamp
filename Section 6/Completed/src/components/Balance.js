import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

import { useAccounts } from "../contexts/AccountContext";

import "./balance.scss";

function Balance() {
  const { balance, reserve, refreshBalance } = useAccounts();

  const BalanceDisplay = () => {
    const numericBalance = Number(balance);
    const numericReserve = Number(reserve);
    return isNaN(numericBalance) ? (
      <div className="amount">-</div>
    ) : (
      <div className="amount">{(numericBalance - numericReserve).toLocaleString()}</div>
    );
  };

  const ReserveDisplay = () => {
    return <div className="reserve">Reserve: {reserve} xrp</div>;
  };

  const handleBalanceRefresh = () => {
    refreshBalance();
  };

  return (
    <div className="balance">
      <label>
        Balance (XRP)
        <FontAwesomeIcon
          icon={faRefresh}
          onClick={handleBalanceRefresh}
        />
      </label>
      <BalanceDisplay />
      <ReserveDisplay />
    </div>
  );
}

export default Balance;
