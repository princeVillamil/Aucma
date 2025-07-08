import FormsTable from "../components/FormsTable";
import { getAllMaintenanceRequest } from "../firebase/firestoreFunctions";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Charts from "../components/Charts";

export default function RequestsviewPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState(false);
  let setPrintModeGlobal = null;

  useEffect(() => {
    setPrintModeGlobal = setPrintMode;
    return () => {
      setPrintModeGlobal = null;
    };
  }, []);

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

  // Listen for print trigger and enable printMode during export
  useEffect(() => {
    const handleBeforePrint = () => setPrintMode(true);
    const handleAfterPrint = () => setPrintMode(false);

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      {/*Charts area (screen only) */}
      {!printMode && <Charts clientList={requests} />}

      {/*Visible table with Actions (screen use) */}
      {!printMode && (
        <div id="export-all-charts" className="screen-only">
          <FormsTable requests={requests} type="admin" isPrinting={false} />
        </div>
      )}

      {/*Hidden-for-screen, visible-for-export table (no Actions) */}
      <div className="print-only">
        <FormsTable requests={requests} type="admin" isPrinting={true} />
      </div>
    </>
  );
}
