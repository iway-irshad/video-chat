import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getFriendRequests, 
  getOutgoingFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest 
} from "../lib/api";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  
  const [clickedNotifications, setClickedNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('clickedNotifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('clickedNotifications', JSON.stringify([...clickedNotifications]));
    } catch (error) {
      console.error('Failed to save clicked notifications:', error);
    }
  }, [clickedNotifications]);

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

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];
  const rejectedRequests = friendRequests?.rejectedRequests || [];
  const pendingOutgoingRequests = outgoingRequests?.pendingRequests || [];

  useEffect(() => {
    if (!friendRequests || !outgoingRequests) return;

    const allCurrentNotificationIds = new Set([
      ...incomingRequests.map(r => r._id),
      ...acceptedRequests.map(r => r._id),
      ...rejectedRequests.map(r => r._id),
      ...pendingOutgoingRequests.map(r => r._id),
    ]);

    setClickedNotifications(prevClicked => {
      const validClickedIds = [...prevClicked].filter(id => 
        allCurrentNotificationIds.has(id)
      );

      if (validClickedIds.length !== prevClicked.size) {
        return new Set(validClickedIds);
      }
      return prevClicked;
    });
  }, [friendRequests, outgoingRequests, incomingRequests, acceptedRequests, rejectedRequests, pendingOutgoingRequests]);

  const allNotifications = React.useMemo(() => {
    const notifications = [
      ...incomingRequests
        .filter(req => req.sender)
        .map(req => ({ 
          ...req, 
          notificationType: 'incoming', 
          timestamp: new Date(req.createdAt) 
        })),
      ...pendingOutgoingRequests
        .filter(req => req.recipient)
        .map(req => ({ 
          ...req, 
          notificationType: 'outgoing', 
          timestamp: new Date(req.createdAt) 
        })),
      ...rejectedRequests
        .filter(req => req.sender && req.recipient)
        .map(req => ({ 
          ...req, 
          notificationType: 'rejected', 
          timestamp: new Date(req.updatedAt || req.createdAt) 
        })),
      ...acceptedRequests
        .filter(req => req.sender && req.recipient)
        .map(req => ({ 
          ...req, 
          notificationType: 'accepted', 
          timestamp: new Date(req.updatedAt || req.createdAt) 
        }))
    ]
      .filter(notification => !clickedNotifications.has(notification._id))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return notifications;
  }, [incomingRequests, pendingOutgoingRequests, rejectedRequests, acceptedRequests, clickedNotifications]);

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
