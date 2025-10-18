import { BellIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import NotificationCard from "../components/notifications/NotificationCard";
import useAuthUser from "../hooks/useAuthUser";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router";

const NotificationsPage = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  
  const {
    allNotifications,
    isLoading,
    acceptRequestMutation,
    rejectRequestMutation,
    isAccepting,
    isRejecting,
    markAsClicked,
  } = useNotifications();

  const handleNotificationClick = (notification) => {
    // Mark as clicked/read (removes from list)
    markAsClicked(notification._id);
    
    // Only navigate to chat for 'accepted' and 'incoming' notifications
    if (notification.notificationType === 'accepted' || notification.notificationType === 'incoming') {
      const isSender = notification.sender._id === authUser?._id;
      const otherPersonId = isSender ? notification.recipient._id : notification.sender._id;
      navigate(`/chat/${otherPersonId}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {allNotifications.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5" />
                  All Notifications
                  <span className="badge ml-2">{allNotifications.length}</span>
                </h2>

                <div className="space-y-3">
                  {allNotifications.map((notification) => (
                    <NotificationCard
                      key={notification._id}
                      notification={notification}
                      authUser={authUser}
                      onAccept={acceptRequestMutation}
                      onReject={rejectRequestMutation}
                      onClick={() => handleNotificationClick(notification)}
                      isAccepting={isAccepting}
                      isRejecting={isRejecting}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
