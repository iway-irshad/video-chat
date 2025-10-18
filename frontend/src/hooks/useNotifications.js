import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getFriendRequests, 
  getOutgoingFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest 
} from "../lib/api";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  
  // Persist clicked notifications in localStorage
  const [clickedNotifications, setClickedNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('clickedNotifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      return new Set();
    }
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('clickedNotifications', JSON.stringify([...clickedNotifications]));
    } catch (error) {
      console.error('Failed to save clicked notifications:', error);
    }
  }, [clickedNotifications]);

  // Fetch notifications
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: outgoingRequests } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Mutations
  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: (data, requestId) => {
      queryClient.setQueryData(["friendRequests"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          incomingRequests: oldData.incomingRequests.filter(req => req._id !== requestId)
        };
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
    },
  });

  // Extract notification arrays
  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];
  const rejectedRequests = friendRequests?.rejectedRequests || [];
  const pendingOutgoingRequests = outgoingRequests?.pendingRequests || [];

  // Clean up localStorage
  useEffect(() => {
    if (!friendRequests || !outgoingRequests) return;

    const allCurrentNotificationIds = new Set([
      ...incomingRequests.map(r => r._id),
      ...acceptedRequests.map(r => r._id),
      ...rejectedRequests.map(r => r._id),
      ...pendingOutgoingRequests.map(r => r._id),
    ]);

    const validClickedIds = [...clickedNotifications].filter(id => 
      allCurrentNotificationIds.has(id)
    );

    if (validClickedIds.length !== clickedNotifications.size) {
      setClickedNotifications(new Set(validClickedIds));
    }
  }, [friendRequests, outgoingRequests, incomingRequests, acceptedRequests, rejectedRequests, pendingOutgoingRequests, clickedNotifications]);

  // Combine and sort all notifications
  const allNotifications = [
    ...incomingRequests.map(req => ({ 
      ...req, 
      notificationType: 'incoming', 
      timestamp: new Date(req.createdAt) 
    })),
    ...pendingOutgoingRequests.map(req => ({ 
      ...req, 
      notificationType: 'outgoing', 
      timestamp: new Date(req.createdAt) 
    })),
    ...rejectedRequests.map(req => ({ 
      ...req, 
      notificationType: 'rejected', 
      timestamp: new Date(req.updatedAt || req.createdAt) 
    })),
    ...acceptedRequests.map(req => ({ 
      ...req, 
      notificationType: 'accepted', 
      timestamp: new Date(req.updatedAt || req.createdAt) 
    }))
  ]
    .filter(notification => !clickedNotifications.has(notification._id))
    .sort((a, b) => b.timestamp - a.timestamp);

  const markAsClicked = (notificationId) => {
    setClickedNotifications(prev => new Set(prev).add(notificationId));
  };

  return {
    allNotifications,
    isLoading,
    acceptRequestMutation,
    rejectRequestMutation,
    isAccepting,
    isRejecting,
    markAsClicked,
  };
};
