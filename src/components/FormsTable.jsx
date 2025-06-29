import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Approved: "bg-green-100 text-green-600",
  Pending: "bg-orange-100 text-orange-600",
  Denied: "bg-red-100 text-red-600",
  Expired: "bg-gray-100 text-gray-500",
  "In Progress": "bg-blue-100 text-blue-600",
};

export default function FormsTable({ requests, type="admin" }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRequests = requests.filter(
    (req) =>
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contactNumber.includes(searchQuery) ||
      req.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const aDate = new Date(`${a.preferredDate}T${a.preferredTime}`);
    const bDate = new Date(`${b.preferredDate}T${b.preferredTime}`);
    return sortAsc ? aDate - bDate : bDate - aDate;
  });

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (form) => {
    navigate(`/${type}/dashboard/forms/edit`, { state: { formData: form } });
  };

  const convertTo12HourFormat = (time24) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex justify-between items-center w-80">
        <Input
          label="Search client, contact or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-80 shadow-xl !border-t-blue-gray-200"
        />
      </div>

      <table className="min-w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-900">
          <tr>
            <th className="px-4 py-3">Request ID</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Technician</th>
            <th className="px-4 py-3">
              <Button variant="text" onClick={() => setSortAsc((prev) => !prev)}>
                Schedule {sortAsc ? "↑" : "↓"}
              </Button>
            </th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.map((req, idx) => (
            <tr key={idx} className="border-t border-gray-200">
              <td className="px-4 py-4 font-medium text-gray-900">{req.requestID}</td>
              <td className="px-4 py-4">{req.clientName}</td>
              <td className="px-4 py-4">{req.contactNumber}</td>
              <td className="px-4 py-4">{req.address}</td>
              <td className="px-4 py-4">{req.technician}</td>
              <td className="px-4 py-4">
                {req.preferredDate} <br /> {convertTo12HourFormat(req.preferredTime)}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[req.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(req)} className="text-gray-900 hover:text-gray-600">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-900 hover:text-red-600">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedRequests.length)}-
          {Math.min(currentPage * itemsPerPage, sortedRequests.length)} of {sortedRequests.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="rounded px-2 py-1 hover:bg-gray-200"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === i + 1 ? "bg-gray-900 text-white" : "hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="rounded px-2 py-1 hover:bg-gray-200"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
