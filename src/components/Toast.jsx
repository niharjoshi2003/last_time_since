import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

/**
 * Subtle snackbar/toast for reset confirmation.
 * Auto-dismisses after delay; announces to screen readers.
 */
const Toast = ({ message, visible, onDismiss, duration = 2500 }) => {
  useEffect(() => {
    if (!visible || !onDismiss) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [visible, onDismiss, duration]);

  if (!visible) return null;

  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Check className="toast-icon" size={20} aria-hidden />
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
