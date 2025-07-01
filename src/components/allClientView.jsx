import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getDocumentById, updateDocumentById } from "../firebase/firestore.js";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import emailjs from "@emailjs/browser";
import { getAuth } from "firebase/auth";

export function AllClientView({ clientList, handleDeleteClient, isClient }) {
  const [techInfoMap, setTechInfoMap] = useState({});

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const sortedClients = [...clientList].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "status") {
      const statusOrder = {
        completed: 1,
        "in progress": 2,
        unfinalized: 3,
        "for cancellation": 4,
      };
      const aRank = statusOrder[aValue] ?? 99;
      const bRank = statusOrder[bValue] ?? 99;

      return sortConfig.direction === "asc" ? aRank - bRank : bRank - aRank;
    } else {
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
  });

  useEffect(() => {
    const fetchTechs = async () => {
      const map = {};
      for (const client of clientList) {
        if (client.technicianID && client.technicianID !== "unfinalized") {
          try {
            const data = await getDocumentById("users", client.technicianID);
            map[client.technicianID] = data.displayName;
          } catch (e) {
            map[client.technicianID] = "Unknown";
          }
        }
      }
      setTechInfoMap(map);
    };
    console.log(techInfoMap, "-----");
    if (clientList.length > 0) {
      fetchTechs();
    }
  }, [clientList]);
  function formatDateToLong(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  function convertTo12HourFormat(time24) {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // convert "0" to "12"
    return `${hour}:${minute} ${ampm}`;
  }

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);

  const handleOpenDialog = (clientId) => {
    setSelectedClientId(clientId);
    setOpenDialog(true);
  };

  const handleOpenEmailDialog = async (client) => {
    console.log("client object:", client);

    const uid = client.clientID;
    if (!uid) {
      alert("Client UID not found in request.");
      return;
    }

    try {
      const userData = await getDocumentById("users", uid);
      console.log("Fetched user data:", userData);

      const email = userData?.email;
      const name = userData?.displayName || client.name || "Client";

      if (!email) {
        alert(`This client (${name}) has no email on record.`);
        return;
      }

      setSelectedClientEmail(email);
      setSelectedClientName(name);
      setEmailMessage("");
      setEmailSubject("ETA Update");
      setEmailDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch client email:", error);
      alert("Unable to load the client's contact info. Try again.");
    }
  };

  const handleCancelRequest = async () => {
    await updateDocumentById("maintenanceRequests", selectedClientId, {
      status: "for cancellation",
      cancelReason: cancelReason,
    });
    setOpenDialog(false);
    setCancelReason("");
    setSelectedClientId(null);
  };

  const [viewReasonDialogOpen, setViewReasonDialogOpen] = useState(false);
  const [reasonMessage, setReasonMessage] = useState("");

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("ETA Update");
  const [selectedClientEmail, setSelectedClientEmail] = useState("");
  const [selectedClientName, setSelectedClientName] = useState("");

  return (
    <div className="container my-10 p-2 mx-auto sm:p-4 dark:text-gray-800">
      <h2 className="mb-4 text-2xl font-semibold leading-tight">Client List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead className="dark:bg-gray-300">
            <tr className="text-left">
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("clientID")}
              >
                Client Request ID{" "}
                {sortConfig.key === "clientID" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Client{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("address")}
              >
                Address{" "}
                {sortConfig.key === "address" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date{" "}
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("time")}
              >
                Time{" "}
                {sortConfig.key === "time" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>

              {isClient ? (
                <>
                  <th
                    className="p-3 cursor-pointer text-right"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="p-3 text-right w-25"></th>
                </>
              ) : (
                <>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("technicianID")}
                  >
                    Technician{" "}
                    {sortConfig.key === "technicianID" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="p-3 text-right cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="p-3 text-right w-25"></th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedClients.map((client) => (
              <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                <td className="p-3">
                  <p>{client.clientID}</p>
                </td>
                <td className="p-3">
                  <p>{client.name}</p>
                </td>
                <td className="p-3">
                  <p>{client.address}</p>
                </td>
                <td className="p-3">
                  <p>{formatDateToLong(client.date)}</p>
                </td>
                <td className="p-3">
                  <span>{convertTo12HourFormat(client.time)}</span>
                </td>
                {isClient && (
                  <td className="p-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="inline-block px-2 py-1 text-sm font-medium text-white bg-gray-500 rounded">
                        {client.status}
                      </span>
                      {client.status === "for cancellation" &&
                        client.cancelReason && (
                          <button
                            className="text-xs text-red-700 underline mt-2 text-right self-end"
                            onClick={() => {
                              setReasonMessage(client.cancelReason);
                              setViewReasonDialogOpen(true);
                            }}
                          >
                            View Reason
                          </button>
                        )}
                    </div>
                  </td>
                )}
                {isClient ? (
                  <></>
                ) : (
                  <td className="p-3">
                    {/* <p>{client.technicianID}</p> */}
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <Button
                          size="sm"
                          className="px-2 py-1 text-sm min-w-0 bg-transparent border normal-case font-normal text-gray-900"
                        >
                          {client.technicianID == "unfinalized"
                            ? "unfinalized"
                            : techInfoMap[client.technicianID] || "Loading..."}
                        </Button>
                      </MenuHandler>
                      <MenuList>
                        {Object.entries(techInfoMap).map(([id, info]) => (
                          <MenuItem
                            key={id}
                            onClick={() =>
                              updateDocumentById(
                                "maintenanceRequests",
                                client.id,
                                {
                                  technicianID: id,
                                }
                              )
                            }
                          >
                            {info}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </td>
                )}
                {isClient ? (
                  <></>
                ) : (
                  <td className="p-3 text-right">
                    <div className="flex flex-col items-end">
                      <Menu placement="bottom-end">
                        <MenuHandler>
                          <Button
                            size="sm"
                            className="px-2 py-1 text-sm min-w-0 bg-transparent border normal-case font-normal bg-gray-900"
                          >
                            {client.status}
                          </Button>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem
                            onClick={() =>
                              updateDocumentById(
                                "maintenanceRequests",
                                client.id,
                                { status: "unfinalized" }
                              )
                            }
                          >
                            Unfinalized
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              updateDocumentById(
                                "maintenanceRequests",
                                client.id,
                                { status: "in progress" }
                              )
                            }
                          >
                            In Progress
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              updateDocumentById(
                                "maintenanceRequests",
                                client.id,
                                { status: "completed" }
                              )
                            }
                          >
                            Completed
                          </MenuItem>
                        </MenuList>
                      </Menu>

                      {client.status === "for cancellation" &&
                        client.cancelReason && (
                          <button
                            className="text-xs text-red-700 underline mt-2"
                            onClick={() => {
                              setReasonMessage(client.cancelReason);
                              setViewReasonDialogOpen(true);
                            }}
                          >
                            View Reason
                          </button>
                        )}
                    </div>
                  </td>
                )}
                <td className="p-3 text-right w-25">
                  <div className="mb-3 flex gap-3 text-right">
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <Button
                          size="sm"
                          className="px-2 py-1 text-sm min-w-0 bg-transparent border text-gray-900"
                        >
                          ...
                        </Button>
                      </MenuHandler>
                      <MenuList>
                        {isClient ? (
                          <MenuItem onClick={() => handleOpenDialog(client.id)}>
                            Request Cancellation
                          </MenuItem>
                        ) : (
                          <>
                            <MenuItem
                              onClick={() =>
                                handleDeleteClient(
                                  "maintenanceRequests",
                                  client.id
                                )
                              }
                            >
                              Delete
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleOpenEmailDialog(client)}
                            >
                              Email Client
                            </MenuItem>
                          </>
                        )}
                      </MenuList>
                    </Menu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <DialogHeader>Request Cancellation</DialogHeader>
        <DialogBody>
          <Input
            label="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpenDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleCancelRequest}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={viewReasonDialogOpen}
        handler={() => setViewReasonDialogOpen(false)}
      >
        <DialogHeader>Cancellation Reason</DialogHeader>
        <DialogBody>
          <p className="text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
            {reasonMessage}
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setViewReasonDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={emailDialogOpen} handler={() => setEmailDialogOpen(false)}>
        <DialogHeader>Email to {selectedClientName}</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Input
              label="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded-md text-sm"
              rows="5"
              placeholder="Write your message here..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEmailDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={async () => {
              try {
                const auth = getAuth();
                const currentUser = auth.currentUser;
                const adminEmail = currentUser?.email;
                const adminName = currentUser?.displayName || "Admin";

                const result = await emailjs.send(
                  import.meta.env.VITE_EMAILJS_SERVICE_ID,
                  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                  {
                    to_name: selectedClientName,
                    to_email: selectedClientEmail,
                    subject: emailSubject,
                    message: emailMessage,
                    from_name: adminName,
                    from_email: adminEmail,
                  },
                  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );

                console.log("EmailJS result:", result.text);

                await addDoc(collection(db, "emailLogs"), {
                  to: selectedClientEmail,
                  name: selectedClientName,
                  subject: emailSubject,
                  message: emailMessage,
                  from: {
                    name: adminName,
                    email: adminEmail,
                  },
                  sentAt: new Date(),
                });

                setEmailDialogOpen(false);
                setEmailSubject("ETA Update");
                setEmailMessage("");
                alert(`Email sent to ${selectedClientEmail}`);
              } catch (error) {
                console.error("Error sending email or logging it:", error);
                alert(
                  "There was an error sending the email or saving the log. Please try again."
                );
              }
            }}
          >
            Send Email
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AllClientView;
