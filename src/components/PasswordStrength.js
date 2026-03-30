// ─────────────────────────────────────────────
//  src/components/PasswordStrength.js
//
//  Visual password strength meter.
//  Shows: Weak / Fair / Strong / Very Strong
//  Props:
//    password — the current password string
// ─────────────────────────────────────────────
import React from "react";

/**
 * getStrength
 * Returns a score 0-4 and a label based on password characteristics.
 */
function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 6)  score++;           // min length
  if (password.length >= 10) score++;           // good length
  if (/[A-Z]/.test(password)) score++;          // uppercase letter
  if (/[0-9]/.test(password)) score++;          // number
  if (/[^A-Za-z0-9]/.test(password)) score++;  // special character

  const levels = [
    { label: "Too short", color: "#ef5350" },
    { label: "Weak",      color: "#ef5350" },
    { label: "Fair",      color: "#ffa726" },
    { label: "Strong",    color: "#26a69a" },
    { label: "Very Strong", color: "#42b72a" },
  ];

  return { score, ...levels[Math.min(score, 4)] };
}

function PasswordStrength({ password }) {
  if (!password) return null;

  const { score, label, color } = getStrength(password);
  const percentage = (score / 5) * 100;

  return (
    <div className="mt-2">
      {/* Bar */}
      <div
        style={{
          height: 5,
          background: "#e2e8f0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          className="strength-bar"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
      {/* Label */}
      <p
        className="mb-0 mt-1"
        style={{ fontSize: "0.78rem", color, fontWeight: 500 }}
      >
        {label}
      </p>
    </div>
  );
}

export default PasswordStrength;