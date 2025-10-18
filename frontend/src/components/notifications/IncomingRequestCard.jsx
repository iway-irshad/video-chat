import { XCircleIcon, UserCheckIcon } from "lucide-react";
import { formatNotificationTime } from "../../lib/utils";

const IncomingRequestCard = ({ notification, onAccept, onReject, onClick, isAccepting, isRejecting }) => {
  return (
    <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer"
            onClick={onClick}
          >
            <div className="avatar w-14 h-14 rounded-full bg-base-300">
              <img src={notification.sender.profilePic} alt={notification.sender.fullName} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{notification.sender.fullName}</h3>
                <span className="text-xs opacity-50">
                  {formatNotificationTime(notification.timestamp)}
                </span>
              </div>
              <p className="text-sm opacity-70">Sent you a friend request</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="badge badge-secondary badge-sm">
                  Native: {notification.sender.nativeLanguage}
                </span>
                <span className="badge badge-outline badge-sm">
                  Learning: {notification.sender.learningLanguage}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-error btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onReject(notification._id);
              }}
              disabled={isAccepting || isRejecting}
            >
              <XCircleIcon className="size-4" />
              Reject
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(notification._id);
              }}
              disabled={isAccepting || isRejecting}
            >
              <UserCheckIcon className="size-4" />
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingRequestCard;
