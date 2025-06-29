import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input, Select, Option
} from "@material-tailwind/react";

export default function UserTable({ title, data, type }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const handleEditClick = (user) => {
    console.log(user)
    setSelectedUser({ ...user });
    setIsEditOpen(true);
  };

  const handleSave = () => {
    setIsEditOpen(false); //add database
  };

  return (
    <>
      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-900">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">{type !== "technician" ? "Technician" : "Address"}</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user, idx) => (
              <tr key={idx} className="border-t border-gray-300">
                <td className="px-4 py-4 font-medium text-gray-900">{user.fullName}</td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">{user.contactNumber}</td>
                <td className="px-4 py-4">
                  {user.role !== "client" ? (user.isTechnician ? "Yes" : "No") : user.address}
                </td>
                <td className="px-4 py-4 capitalize">{user.role}</td>
                <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-gray-900 hover:text-gray-600"
                      onClick={() => handleEditClick(user)}
                    >
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

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)}–
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
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

      {/* Edit Modal */}
      <Dialog open={isEditOpen} handler={setIsEditOpen}>
        <DialogHeader>Edit User</DialogHeader>
          <DialogBody className="space-y-4">
            {/* 👇 Role Select Input */}
            <Select
              label="Role"
              value={selectedUser?.role || ""}
              onChange={(val) =>
                setSelectedUser((prev) => ({ ...prev, role: val }))
              }
            >
              <Option value="client">Client</Option>
              <Option value="admin">Admin</Option>
            </Select>

            {selectedUser?.role !== "client" && (
              <Select
                label="Technician"
                value={selectedUser?.isTechnician ? "true" : "false"}
                onChange={(val) =>
                  setSelectedUser((prev) => ({
                    ...prev,
                    isTechnician: val === "true",
                  }))
                }
              >
                <Option value="true">Yes</Option>
                <Option value="false">No</Option>
              </Select>
            )}
          </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button variant="text" className="bg-gray-900 text-white hover:bg-gray-800" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
