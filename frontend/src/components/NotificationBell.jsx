import { Link } from "react-router";
import { BellIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getOutgoingFriendRequests } from "../lib/api";
import { useState, useEffect } from "react";

const NotificationBell = () => {
  const [clickedNotifications, setClickedNotifications] = useState(new Set());

  // Load clicked notifications from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('clickedNotifications');
      if (saved) {
        setClickedNotifications(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load clicked notifications:', error);
    }
  }, []);

  // Fetch notification data
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchOnWindowFocus: true,
    staleTime: 30000, // Cache for 30 seconds
  });

  const { data: outgoingRequests } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  // Calculate unread notification count
  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];
  const rejectedRequests = friendRequests?.rejectedRequests || [];
  const pendingOutgoingRequests = outgoingRequests?.pendingRequests || [];

  const allNotificationIds = [
    ...incomingRequests.map(r => r._id),
    ...acceptedRequests.map(r => r._id),
    ...rejectedRequests.map(r => r._id),
    ...pendingOutgoingRequests.map(r => r._id),
  ];

  const unreadCount = allNotificationIds.filter(id => !clickedNotifications.has(id)).length;

  return (
    <Link to={"/notifications"}>
      <button className="btn btn-ghost btn-circle relative">
        <BellIcon className="h-6 w-6 text-base-content opacity-70" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-error-content text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </Link>
  );
};

export default NotificationBell;
