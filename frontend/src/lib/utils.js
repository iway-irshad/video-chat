export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Format timestamp for notifications
export const formatNotificationTime = (timestamp) => {
  const now = new Date();
  const notifDate = new Date(timestamp);
  const diffInMs = now - notifDate;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  // Format as date for older notifications
  return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
