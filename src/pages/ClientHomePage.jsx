import React, { useEffect, useState } from "react";
import placeHolderClients from "../assets/data/placeHolderClients";
import FormsTable from "../components/FormsTable";
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

// const stats = [
//   { icon: ClipboardDocumentListIcon, label: "Total Requests", value: "348" },
//   { icon: ClockIcon, label: "Pending Requests", value: "29" },
//   { icon: CheckCircleIcon, label: "Approved Requests", value: "198" },
//   { icon: CheckBadgeIcon, label: "Completed Requests", value: "112" },
//   { icon: WrenchScrewdriverIcon, label: "Technicians", value: "14" },
//   { icon: UserGroupIcon, label: "Clients Registered", value: "589" },
// ];

const stats = [
  { icon: ClipboardDocumentListIcon, label: "Total Requests", value: "348" },,
  { icon: ClockIcon, label: "Pending Requests", value: "29" },
  { icon: CheckCircleIcon, label: "Approved Requests", value: "198" },
  { icon: CheckBadgeIcon, label: "Completed Requests", value: "112" },
];



function ClientHomePage({userData}) {
    console.log(userData)
  const [profiles, setProfiles] = useState(placeHolderClients);

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

        <FormsTable requests={profiles} type="client"/>

    </div>
    
  )
}

export default ClientHomePage
