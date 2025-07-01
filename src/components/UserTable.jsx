import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { updateMaintenanceRequest } from "../firebase/firestoreFunctions"
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input, Select, Option
} from "@material-tailwind/react";

export default function UserTable({ title, data, type, setProfiles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
const formatDate = (dateInput) => {
  if (!dateInput) return "—";
  const date = dateInput instanceof Date ? dateInput : dateInput.toDate?.() || new Date(dateInput);
  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const year = utc8Date.getUTCFullYear();
  const month = String(utc8Date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(utc8Date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedUser?.id) return;
      await updateMaintenanceRequest("updatedUsers", selectedUser.id, {
        role: selectedUser.role,
        isTechnician: selectedUser.role !== "client" ? selectedUser.isTechnician : false,
      });
      setProfiles(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                role: selectedUser.role,
                isTechnician: selectedUser.role !== "client" ? selectedUser.isTechnician : false,
              }
            : user
        )
      );
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
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
                <td className="px-4 py-4">{user.contactNumber == null ? "0917-123-4567":user.contactNumber}</td>
                <td className="px-4 py-4">
                  {user.role !== "client" ? (user.isTechnician ? "Yes" : "No") : user.address == null ? "123 Ayala Avenue, Makati City":user.address}
                </td>
                <td className="px-4 py-4 capitalize">{user.role}</td>
                <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-gray-900 hover:text-gray-600"
                      onClick={() => handleEditClick(user)}
                    >
                      <PencilIcon className="h-5 w-10" />
                    </button>
                    {/* <button className="text-red-900 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button> */}
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
