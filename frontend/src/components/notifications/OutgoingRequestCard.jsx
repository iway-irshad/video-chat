import { ClockIcon } from "lucide-react";
import { formatNotificationTime } from "../../lib/utils";

const OutgoingRequestCard = ({ notification, onClick }) => {
  return (
    <div
      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="avatar w-14 h-14 rounded-full bg-base-300">
              <img
                src={notification.recipient.profilePic}
                alt={notification.recipient.fullName}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                <span className="text-xs opacity-50">
                  {formatNotificationTime(notification.timestamp)}
                </span>
              </div>
              <p className="text-sm opacity-70">You sent a friend request</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="badge badge-secondary badge-sm">
                  Native: {notification.recipient.nativeLanguage}
                </span>
                <span className="badge badge-outline badge-sm">
                  Learning: {notification.recipient.learningLanguage}
                </span>
              </div>
            </div>
          </div>

          <div className="badge badge-warning gap-2">
            <ClockIcon className="h-3 w-3" />
            Pending
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingRequestCard;
