import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccounts } from "../contexts/AccountContext";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons/faArrowTurnUp";

import Spinner from "../components/Spinner";

import "./send.scss";

function Send() {
  const [amount, setAmount] = useState(0);
  const [destination, setDestination] = useState("");
  const [destinationTag, setDestinationTag] = useState();
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const { sendXRP } = useAccounts();

  const handleSendXRP = async (event) => {
    event.preventDefault();

    // Show modal
    setShowModal(true);

    try {
      // Send the XRP
      await sendXRP(amount, destination, destinationTag);
    } catch (error) {
      console.error(error);
    } finally {
      // Close modal
      setShowModal(false);

      // Navigate to home
      navigate("/");
    }
  };
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };
  const handleDestinationTagChange = (event) => {
    setDestinationTag(event.target.value);
  };
  return (
    <>
      <div className="send">
        <h1>
          <FontAwesomeIcon icon={faArrowTurnUp} />
          <span>Send XRP</span>
        </h1>

        <Form onSubmit={handleSendXRP}>
          <Form.Group
            className="form-group"
            controlId="amount"
          >
            <Form.Label>Amount (XRP)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Amount of XRP to send"
              required
              onChange={handleAmountChange}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            className="form-group"
            controlId="destination"
          >
            <Form.Label>Destination address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Destination address"
              required
              onChange={handleDestinationChange}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            className="form-group"
            controlId="destinationTag"
          >
            <Form.Label>Destination tag</Form.Label>
            <Form.Control
              type="text"
              placeholder="Destination tag"
              onChange={handleDestinationTagChange}
            ></Form.Control>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
          >
            Send
          </Button>
        </Form>
      </div>

      <Modal show={showModal}>
        <Modal.Header>Sending a payment of {amount} XRP</Modal.Header>
        <Modal.Body>
          <p>Destination: {destination}</p>
          {destinationTag && <p>Destination Tag: {destinationTag}</p>}
          <Spinner />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Send;
