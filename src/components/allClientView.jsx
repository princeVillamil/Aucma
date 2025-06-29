import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getDocumentById, updateDocumentById} from '../firebase/firestore.js'; 


export function AllClientView({clientList, handleDeleteClient, isClient}) {
  const [techInfoMap, setTechInfoMap] = useState({});
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const sortedClients = [...clientList].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const fetchTechs = async () => {
      const map = {};
      for (const client of clientList) {
        if (client.technicianID && client.technicianID !== 'unfinalized') {
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
    console.log(techInfoMap,"-----")
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
  setSortConfig(prev => {
    if (prev.key === key) {
      return {
        key,
        direction: prev.direction === 'asc' ? 'desc' : 'asc',
      };
    }
    return { key, direction: 'asc' };
  });
}



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
            <col/>
          </colgroup>
          <thead className="dark:bg-gray-300">
            <tr className="text-left">
              <th className="p-3 cursor-pointer" onClick={() => handleSort('clientID')}>
                Client Request ID {sortConfig.key === 'clientID' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('name')}>
                Client {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('address')}>
                Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('time')}>
                Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>

              {isClient ? (
                <th className="p-3 text-right">Status</th>
              ) : (
                <>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort('technicianID')}>
                    Technician {sortConfig.key === 'technicianID' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('status')}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="p-3 text-right w-25"></th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedClients.map(client => (
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
                      <span className="inline-block px-2 py-1 text-sm font-medium text-white bg-gray-500 rounded">
                        {client.status}
                      </span>
                    </td>
                  )}
                  {(isClient)? <></>:
                  <td className="p-3">
                    {/* <p>{client.technicianID}</p> */}
                      <Menu placement="bottom-end">
                        <MenuHandler>
                          <Button size="sm" className="px-2 py-1 text-sm min-w-0 bg-transparent border normal-case font-normal text-gray-900">{(client.technicianID == 'unfinalized') ? "unfinalized": techInfoMap[client.technicianID] || 'Loading...'}</Button>
                        </MenuHandler>
                        <MenuList>

                          {Object.entries(techInfoMap).map(([id, info]) => (
                            <MenuItem
                              key={id}
                              onClick={() =>
                                updateDocumentById("maintenanceRequests", client.id, {
                                  technicianID: id,
                                })
                              }
                            >
                              {info}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                  </td>
                  }
                  {(isClient)?<></>:
                  <td className="p-3 text-right">
                      <Menu placement="bottom-end">
                        <MenuHandler>
                          <Button size="sm" className="px-2 py-1 text-sm min-w-0 bg-transparent border normal-case font-normal bg-gray-900">{client.status}</Button>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem onClick={() => {updateDocumentById('maintenanceRequests', client.id, {status: "unfinalized"})}}>
                            Unfinalized
                          </MenuItem>
                          <MenuItem onClick={() => updateDocumentById('maintenanceRequests', client.id, {status: "in progress"})}>
                            In Progress
                          </MenuItem>
                          <MenuItem onClick={() => updateDocumentById('maintenanceRequests', client.id, {status: "completed"})}>
                            Completed
                          </MenuItem>
                        </MenuList>
                        {/* <MenuList>
                          <MenuItem>Unfinalized</MenuItem>
                          <MenuItem>In Progress</MenuItem>
                          <MenuItem>Completed</MenuItem>
                        </MenuList> */}
                      </Menu>
                  </td>
                  }
                  {(isClient)?<></>:
                  <td className="p-3 text-right w-25">
                    <div className="mb-3 flex gap-3 text-right">
                      <Menu placement="bottom-end">
                        <MenuHandler>
                          <Button size="sm" className="px-2 py-1 text-sm min-w-0 bg-transparent border text-gray-900">...</Button>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem onClick={()=>handleDeleteClient('maintenanceRequests', client.id)}>Delete</MenuItem>
                          {/* <MenuItem>Notify</MenuItem> */}
                        </MenuList>
                      </Menu>
                      
                    </div>
                  </td>
                  }
                </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllClientView;



