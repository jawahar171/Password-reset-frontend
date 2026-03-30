// ─────────────────────────────────────────────
//  src/components/Alert.js  —  Reusable Alert
//
//  Props:
//    type    — "success" | "danger" | "warning" | "info"
//    message — string to display
// ─────────────────────────────────────────────
import React from "react";

const ICONS = {
  success: "bi-check-circle-fill",
  danger:  "bi-exclamation-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info:    "bi-info-circle-fill",
};

function Alert({ type = "danger", message }) {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} fade-in-up`}
      role="alert"
      style={{ borderRadius: 12, fontSize: "0.9rem" }}
    >
      <i className={`bi ${ICONS[type]} me-2`} style={{ flexShrink: 0 }}></i>
      <span>{message}</span>
    </div>
  );
}

export default Alert;