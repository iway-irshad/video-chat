import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getRejectedFriendRequests } from "../lib/api";
import { UserCheckIcon, UserXIcon } from "lucide-react";
import { capitalize } from "../lib/utils";

const RejectedRequestsPage = () => {
  const queryClient = useQueryClient();

  const { data: rejectedData, isLoading } = useQuery({
    queryKey: ["rejectedFriendRequests"],
    queryFn: getRejectedFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data, requestId) => {
      // Optimistically remove from rejected list
      queryClient.setQueryData(["rejectedFriendRequests"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          rejectedByMe: oldData.rejectedByMe.filter(req => req._id !== requestId)
        };
      });
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["rejectedFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh recommended users
    },
  });

  const rejectedByMe = rejectedData?.rejectedByMe || [];
  const rejectedByOthers = rejectedData?.rejectedByOthers || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Rejected Friend Requests
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* REQUESTS I REJECTED */}
            {rejectedByMe.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserXIcon className="h-5 w-5 text-error" />
                  Requests You Rejected
                  <span className="badge badge-error ml-2">{rejectedByMe.length}</span>
                </h2>
                <p className="text-sm opacity-70 -mt-2">
                  You can still accept these requests if you change your mind
                </p>

                <div className="space-y-3">
                  {rejectedByMe.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {capitalize(request.sender.nativeLanguage)}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {capitalize(request.sender.learningLanguage)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            <UserCheckIcon className="size-4" />
                            Accept Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* REQUESTS OTHERS REJECTED */}
            {rejectedByOthers.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserXIcon className="h-5 w-5 text-warning" />
                  Your Rejected Requests
                  <span className="badge badge-warning ml-2">{rejectedByOthers.length}</span>
                </h2>
                <p className="text-sm opacity-70 -mt-2">
                  These users rejected your friend requests
                </p>

                <div className="space-y-3">
                  {rejectedByOthers.map((request) => (
                    <div key={request._id} className="card bg-base-200 shadow-sm opacity-60">
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-14 h-14 rounded-full bg-base-300">
                            <img
                              src={request.recipient.profilePic}
                              alt={request.recipient.fullName}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.recipient.fullName}</h3>
                            <p className="text-sm opacity-70">Rejected your request</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {rejectedByMe.length === 0 && rejectedByOthers.length === 0 && (
              <div className="card bg-base-200 p-8 text-center">
                <UserXIcon className="size-16 mx-auto mb-4 opacity-30" />
                <h3 className="font-semibold text-lg mb-2">No Rejected Requests</h3>
                <p className="text-base-content opacity-70">
                  You haven't rejected any friend requests yet
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RejectedRequestsPage;
