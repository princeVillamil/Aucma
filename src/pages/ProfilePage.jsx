import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage({userData}) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const formatToISO8601 = (dateInput) => {
    if (!dateInput) return null;

    const date = dateInput instanceof Date
      ? dateInput
      : dateInput.toDate?.() || new Date(dateInput);

    return date.toISOString(); // Returns "YYYY-MM-DDTHH:mm:ss.sssZ"
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-3xl mx-auto p-6 shadow-xl rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h5">{profile.fullName}</Typography>
            <Typography variant="small" color="gray">
              {profile.role === "admin" ? "Administrator" : "Client"}
            </Typography>
          </div>
          <Button onClick={() => setIsOpen(true)} size="sm">
            Edit
          </Button>
        </div>

        <hr className="my-4 border border-gray-300 bg-gray-300" />

        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5" /> {profile.email}
          </p>
          <p className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5" /> {profile.contactNumber}
          </p>
          <p className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5" /> {profile.address}
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5" /> Role: {profile.role}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5" /> Created At:{" "}
            {new Date(formatToISO8601(profile.createdAt)).toLocaleString()}
          </p>
        </div>
      </Card>

      <Dialog open={isOpen} handler={setIsOpen}>
        <DialogHeader>Edit Profile</DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
          <Input
            label="Contact Number"
            name="contactNumber"
            value={profile.contactNumber}
            onChange={handleChange}
          />
          <Input
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
          {/* <Input
            label="Role"
            name="role"
            value={profile.role}
            onChange={handleChange}
          /> */}
          {/* <Input
            label="Password"
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
          /> */}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setIsOpen(false)} className="mr-2">
            Close
          </Button>
          <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
