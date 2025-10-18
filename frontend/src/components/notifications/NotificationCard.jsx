import IncomingRequestCard from "./IncomingRequestCard";
import OutgoingRequestCard from "./OutgoingRequestCard";
import RejectedRequestCard from "./RejectedRequestCard";
import AcceptedRequestCard from "./AcceptedRequestCard";

const NotificationCard = ({ 
  notification, 
  authUser, 
  onAccept, 
  onReject, 
  onClick, 
  isAccepting, 
  isRejecting 
}) => {
  switch (notification.notificationType) {
    case 'incoming':
      return (
        <IncomingRequestCard
          notification={notification}
          onAccept={onAccept}
          onReject={onReject}
          onClick={onClick}
          isAccepting={isAccepting}
          isRejecting={isRejecting}
        />
      );

    case 'outgoing':
      return (
        <OutgoingRequestCard
          notification={notification}
          onClick={onClick}
        />
      );

    case 'rejected': {
      const isSender = notification.sender._id === authUser?._id;
      const otherPerson = isSender ? notification.recipient : notification.sender;
      const message = isSender 
        ? `${otherPerson.fullName} rejected your friend request`
        : `You rejected ${otherPerson.fullName}'s friend request`;

      return (
        <RejectedRequestCard
          notification={notification}
          otherPerson={otherPerson}
          message={message}
          onClick={onClick}
        />
      );
    }

    case 'accepted': {
      const isSender = notification.sender._id === authUser?._id;
      const otherPerson = isSender ? notification.recipient : notification.sender;
      const message = isSender 
        ? `${otherPerson.fullName} accepted your friend request`
        : `You accepted ${otherPerson.fullName}'s friend request`;

      return (
        <AcceptedRequestCard
          notification={notification}
          otherPerson={otherPerson}
          message={message}
          onClick={onClick}
        />
      );
    }

    default:
      return null;
  }
};

export default NotificationCard;
