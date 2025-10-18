import { MessageSquareIcon } from "lucide-react";
import { formatNotificationTime } from "../../lib/utils";

const AcceptedRequestCard = ({ notification, otherPerson, message, onClick }) => {
  return (
    <div 
      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <div className="avatar mt-1 size-10 rounded-full">
            <img
              src={otherPerson.profilePic}
              alt={otherPerson.fullName}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{otherPerson.fullName}</h3>
              <span className="text-xs opacity-50">
                {formatNotificationTime(notification.timestamp)}
              </span>
            </div>
            <p className="text-sm my-1">{message}</p>
          </div>
          <div className="badge badge-success">
            <MessageSquareIcon className="h-3 w-3 mr-1" />
            New Friend
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedRequestCard;
