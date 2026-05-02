import { FriendRequestCard } from './FriendRequestCard';

interface FriendRequestsListProps {
  requests: any[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  colors: any;
}

export function FriendRequestsList({ requests, onAccept, onReject, colors }: FriendRequestsListProps) {
  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <FriendRequestCard
          key={request.id}
          {...request}
          onAccept={() => onAccept(request.id)}
          onReject={() => onReject(request.id)}
        />
      ))}
    </div>
  );
}