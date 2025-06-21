

export function AllClientView({clientList}) {
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
              <th className="p-3">Client Request ID</th>
              <th className="p-3">Client</th>
              <th className="p-3">Address</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Technician</th>
              <th className="p-3 text-right">status</th>
            </tr>
          </thead>
          <tbody>
            {clientList.map(client=>(
                <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                  <td className="p-3">
                    <p>{client.requestID}</p>
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
                  <td className="p-3">
                    <p>{client.technicianID}</p>
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-3 py-1 font-semibold rounded-md bg-gray-900 dark:text-gray-50">
                      <span>{client.status}</span>
                    </span>
                  </td>
                </tr>
                ))
            }



            {/* <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
              <td className="p-3">
                <p>97412378923</p>
              </td>
              <td className="p-3">
                <p>Nvidia Corporation</p>
              </td>
              <td className="p-3">
                <p>14 Jan 2022</p>
                <p className="dark:text-gray-600">Friday</p>
              </td>
              <td className="p-3">
                <p>01 Feb 2022</p>
                <p className="dark:text-gray-600">Tuesday</p>
              </td>
              <td className="p-3 text-right">
                <p>$98,218</p>
              </td>
              <td className="p-3 text-right">
                <span className="px-3 py-1 font-semibold rounded-md bg-gray-900 dark:text-gray-50">
                  <span>Pending</span>
                </span>
              </td>
              <td className="p-3 text-right">
                <span className="px-3 py-1 font-semibold rounded-md bg-gray-900 dark:text-gray-50">
                  <span>Pending</span>
                </span>
              </td>
            </tr> */}


          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllClientView;



