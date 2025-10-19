import { Link } from "react-router";
import { BellIcon } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

const NotificationBell = () => {
  const { allNotifications } = useNotifications();

  const unreadCount = allNotifications.length;

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

