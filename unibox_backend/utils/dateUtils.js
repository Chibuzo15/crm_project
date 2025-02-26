/**
 * Format a date string or Date object
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (optional, defaults to ISO date)
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = "iso") => {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(d.getTime())) return "";

  switch (format.toLowerCase()) {
    case "iso":
      return d.toISOString();
    case "short":
      return d.toLocaleDateString();
    case "long":
      return d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "datetime":
      return d.toLocaleString();
    case "relative":
      return getRelativeTimeString(d);
    default:
      return d.toISOString();
  }
};

/**
 * Get relative time string (e.g., "2 days ago")
 * @param {Date} date - Date to compare against now
 * @returns {string} Relative time string
 */
const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  } else {
    return formatDate(date, "short");
  }
};

/**
 * Calculate follow-up date based on interval and last message date
 * @param {Date} lastMessageDate - Date of last message
 * @param {number} interval - Interval in days
 * @returns {Date} Follow-up date
 */
const calculateFollowUpDate = (lastMessageDate, interval = 2) => {
  if (!lastMessageDate) return null;

  const d =
    typeof lastMessageDate === "string"
      ? new Date(lastMessageDate)
      : lastMessageDate;

  // Check if date is valid
  if (isNaN(d.getTime())) return null;

  const followUpDate = new Date(d);
  followUpDate.setDate(followUpDate.getDate() + interval);

  return followUpDate;
};

/**
 * Check if a date is past (compared to now)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
const isPastDate = (date) => {
  if (!date) return false;

  const d = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(d.getTime())) return false;

  return d < new Date();
};

module.exports = {
  formatDate,
  getRelativeTimeString,
  calculateFollowUpDate,
  isPastDate,
};
