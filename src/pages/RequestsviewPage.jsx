import FormsTable from "../components/FormsTable";
import {getAllMaintenanceRequest} from "../firebase/firestoreFunctions"
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Charts from "../components/Charts";

export default function RequestsviewPage({userData}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllMaintenanceRequest();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch maintenance requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <Loading/>
  
  return (
    <>
      <Charts clientList={requests}/>
      <FormsTable requests={requests} type="admin" />
    </>
  )
}