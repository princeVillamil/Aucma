import { useEffect, useState } from "react";
import { placeHolderUsers } from "../assets/data/placeHolderUsers";
import { getAllUsers, getAllMaintenanceRequest} from "../firebase/firestoreFunctions"
import UserTable from "../components/UserTable";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  PencilIcon, TrashIcon
} from "@heroicons/react/24/outline";



function HomePage() {

  const [profiles, setProfiles] = useState([]);
  const [allRequest, setAllRequest] = useState([])
  const [allClients, setAllClients] = useState([]);
  const [allAdmin, setAllAdmin] = useState([]);
  const [statsNum, setStatsNum] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    completedRequests: 0
  })
  const stats = [
    { icon: ClipboardDocumentListIcon, label: "Total Requests", value: statsNum.totalRequests, statName: "totalRequests" },,
    { icon: ClockIcon, label: "Pending Requests", value: statsNum.pendingRequests, statName: "pendingRequests" },
    { icon: CheckCircleIcon, label: "Approved Requests", value: statsNum.approvedRequests, statName: "approvedRequests" },
    { icon: CheckBadgeIcon, label: "Completed Requests", value: statsNum.completedRequests, statName: "completedRequests" },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllUsers();
        setProfiles(data);
        const allRequestData = await getAllMaintenanceRequest();
        setAllRequest(allRequestData);
      } catch (error) {
        console.error("Failed to fetch maintenance requests", error);
      }
    };
    fetchRequests();
  }, []);
  useEffect(() => {
    setAllClients(profiles.filter((user) => user.role === "client"));
    setAllAdmin(profiles.filter((user) => user.role === "admin"));
  }, [profiles]);
  useEffect(()=>{
    const handleStatsNum = (allRequest) => {
      const totalRequests = allRequest.length;
      const pendingRequests = allRequest.filter(req => req.status === "Pending").length;
      const approvedRequests = allRequest.filter(req => req.status === "Scheduled" || req.status === "In Progress").length;
      const completedRequests = allRequest.filter(req => req.status === "Completed").length;

      setStatsNum({
        totalRequests,
        pendingRequests,
        approvedRequests,
        completedRequests,
      });
    };
    handleStatsNum(allRequest)
  },[allRequest])

  return (
    
    <div className="py-6 px-10 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="shadow">
            <CardBody className="flex items-center gap-4">
              <div className="bg-gray-900 p-2 rounded-full">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="small" className="">
                  {label}
                </Typography>
                <Typography variant="h6" className="">{value}</Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Client */}
      <UserTable title={"Client Users"} data={allClients} setProfiles={setProfiles} type="technician"/>

      {/* Admin */}
      <UserTable title={"Admin Users"} data={allAdmin} setProfiles={setProfiles} type="address"/>

    </div>
    
  )
}

export default HomePage
