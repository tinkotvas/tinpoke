/**
 * Pokémon-related utility functions.
 */

/**
 * Format a timestamp as a human-readable date string.
 * @param {number|null} timestamp Timestamp in milliseconds, or null
 * @returns {string|null} Formatted date string, or null if no timestamp
 */
export function formatCaughtDate(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a timestamp as a short date string.
 * @param {number|null} timestamp Timestamp in milliseconds, or null
 * @returns {string} Formatted date string, or 'Unknown' if no timestamp
 */
export function formatShortDate(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}