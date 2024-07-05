import Balance from "../components/Balance";

import "./main.scss";

function Main() {
  return (
    <div className="main">
      <section className="action-buttons"></section>
      <section className="balance-container">
        <Balance />
      </section>
      <section className="transactions-container"></section>
    </div>
  );
}

export default Main;
