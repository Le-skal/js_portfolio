import { X } from "lucide-react";
import { useState } from "react";
import "./TerminalPopup.css";

export const TerminalPopup = ({ title, children, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Call onClose immediately to trigger parent's delay
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ pointerEvents: "auto" }}
    >
      {/* Semi-transparent overlay with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 animate-fade-in"
        onClick={handleClose}
      />

      {/* Terminal Window */}
      <div
        className={`terminal-window relative z-50 w-full max-w-3xl ${
          isClosing ? 'animate-popup-out' : 'animate-popup-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-title">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-title-text">{title}</span>
          </div>
          <button
            onClick={handleClose}
            className="terminal-close-btn"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="terminal-content">
          {children}
        </div>

        {/* Terminal Footer */}
        <div className="terminal-footer">
          <span className="terminal-status">
            <span className="terminal-status-dot"></span>
            CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
};
