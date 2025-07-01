import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

export default function CancelMessageCard({ cancelData, type = "admin" }) {
  const formatDate = () => {
    if (!cancelData.timestamp) return "";
    const date = cancelData.timestamp.toDate?.() || new Date(cancelData.timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full mx-auto bg-white p-6 mb-4 border-b border-b-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Cancelled by {type=="admin"?cancelData.canceledBY:cancelData.clientName }
          </h3>
          <p className="text-sm text-gray-600">{type=="admin"?cancelData.canceledBYEmail:cancelData.clientID}</p>
            {cancelData.timestamp && type === "admin" && (
              <p className="text-xs text-gray-400 mt-1">{formatDate()}</p>
            )}
        </div>
        <div className="flex items-center gap-2 text-red-600">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span className="font-semibold">Cancelled</span>
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-2">
        <p>
          <span className="font-medium">Client:</span> {cancelData.clientName}
        </p>
        <p>
          <span className="font-medium">Issue:</span> {cancelData.issueDescription}
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm text-gray-800">
        <p className="font-medium mb-1">Cancellation Reason:</p>
        <p>{type=="admin"?cancelData.cancelMessage:cancelData.cancelledMessage}</p>
      </div>
    </div>
  );
}
