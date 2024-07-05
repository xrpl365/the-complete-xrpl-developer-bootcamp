import { useState, useEffect } from "react";

import { Toast } from "react-bootstrap";

import "./toast.scss";

let id = 0;

const ToastManager = {
  toasts: [],
  listeners: [],
  addListener(listener) {
    this.listeners.push(listener);
  },
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  },
  addToast(message) {
    const newToast = { id: id++, message };
    this.toasts.push(newToast);
    this.listeners.forEach((listener) => listener(this.toasts));
    setTimeout(() => this.removeToast(newToast.id), 3000);
  },
  removeToast(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.listeners.forEach((listener) => listener(this.toasts));
  },
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    ToastManager.addListener(setToasts);
    return () => {
      ToastManager.removeListener(setToasts);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id}>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
};

export { ToastContainer, ToastManager };
