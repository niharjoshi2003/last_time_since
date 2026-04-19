export const formatDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Compact string e.g. "3d 5h 12m" (legacy / tooltips) */
export const formatTime = (ms) => {
  if (ms == null) return '—';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Parts for styled elapsed display: [{ n, u }, ...]
 * @param {number} ms
 * @returns {{ n: number, u: string }[]|null}
 */
export const formatElapsedParts = (ms) => {
  if (ms == null || Number.isNaN(ms)) return null;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return [
      { n: days, u: 'd' },
      { n: hours % 24, u: 'h' },
      { n: minutes % 60, u: 'm' },
    ];
  }
  if (hours > 0) {
    return [
      { n: hours, u: 'h' },
      { n: minutes % 60, u: 'm' },
      { n: seconds % 60, u: 's' },
    ];
  }
  if (minutes > 0) {
    return [
      { n: minutes, u: 'm' },
      { n: seconds % 60, u: 's' },
    ];
  }
  return [{ n: Math.max(0, seconds), u: 's' }];
};
