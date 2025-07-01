import { useEffect, useState } from "react";
import CancelMessageCard from "../components/CancelMessageCard";
import {getAllMaintenanceRequest} from "../firebase/firestoreFunctions"

export default function NotificationPage({userData, type="admin"}) {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchRequests = async () => {
      if(type =="client") return
      try {
        const data = await getAllMaintenanceRequest();
        const cancelledRequests = data.filter(req => req.status === "Cancelled");
        setRequests(cancelledRequests);
      } catch (error) {
        console.error("Failed to fetch maintenance requests", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="my-6 py-6 px-6 mx-10 space-y-6 bg-white border border-gray-200 rounded-xl shadow-xl">
    {type=="admin" ?
        <>
          {requests.map((data)=>{
            return <CancelMessageCard cancelData={data} type="client"/>
          })}
        </>
      :
        <>
          {userData.message.map((data)=>{
            return <CancelMessageCard cancelData={data}/>
          })}
        </>
    }
  </div>
  );
}
