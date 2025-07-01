
import { useState } from "react";
import Alert from "../components/Alert";
import { useLocation } from "react-router-dom";
import {updateMaintenanceRequest} from "../firebase/firestoreFunctions"

export default function EditFormsPage({type="admin", technicianList}) {
  const location = useLocation();
  const [reqData, setReqData] = useState(location.state.formData)
  console.log(reqData, "Edit Form")
  const [errorList, setErrorList] = useState([])    
  const [formData, setFormData] = useState({
      clientID: reqData.clientID,
      clientName: reqData.clientName,
      contactNumber: reqData.contactNumber,
      address: reqData.address,
      issueDescription: reqData.issueDescription,
      preferredDate: reqData.preferredDate,
      preferredTime: reqData.preferredTime,
      technician: reqData.technician,
      technicianID: reqData.technicianID,
      lat: reqData.lat,
      lng: reqData.lng,
      status: reqData.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "technician") {
      const selectedTech = technicianList.find((tech) => tech.id === value);
      if (selectedTech) {
        setFormData((prev) => ({
          ...prev,
          technician: selectedTech.fullName,
          technicianID: selectedTech.id,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = [];
    const requiredFields = [
      "clientName",
      "contactNumber",
      "address",
      "issueDescription",
      "preferredDate",
      "preferredTime",
      ...(type !== "client" ? ["technician"] : []),
      "lat",
      "lng",
      "status"
    ];
    if(type=="client")       setFormData((prev) => ({ ...prev, "technicianID": null,}));
    requiredFields.forEach((field) => {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {
        errors.push({
          type: "danger",
          title: `${field} is required.`,
          message: `Please fill in the ${field.replace(/([A-Z])/g, " $1")}.`,
        });
      }
    });

    if (errors.length > 0) {
      setErrorList(errors);
      return;
    }
    try {
      setErrorList([]);
      const newDocID = await updateMaintenanceRequest("updatedMaintenanceRequests",reqData.id,formData);
        setErrorList([{
          type: "success",
          title: `Edit submitted successfully`,
          message:  `Edit submitted successfully`,
        }]);
      console.log("Request saved:", newDocID);
    } catch (error) {
      // handle error
        setErrorList([{
          type: "danger",
          title: `Error in saving`,
          message:  `Error in saving`,
        }]);
    }
  };

  const handleSearch = async (e) => {
      e.preventDefault();
      if (formData.address == '') return;

      try {
      const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`
      );

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setFormData((prev) => ({...prev, lat: parseFloat(lat), lng: parseFloat(lon),}));
          setErrorList([])
      } else {
          setFormData((prev) => ({...prev, lat: null, lng: null,}));
          setErrorList((prev) => {
          const exists = prev.some(
              (e) => e.title === "Location not found." && e.message === "Location not found."
          );
          if (exists) return prev;

          return [
              ...prev,
              {
              type: "danger",
              title: "Location not found.",
              message: "Location not found."
              }
          ];
          });
      }
      } catch (error) {
      console.error("Geocoding failed:", error);
      alert("An error occurred while searching for the location.");
      }
  };

  return (
    <div className="my-6 py-6 px-6 mx-10 space-y-6 bg-white border border-gray-200 rounded-xl shadow-xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Client Name */}
        <div>
          <label className="block text-sm text-gray-600">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Hans Burger"
            required
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm text-gray-600">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="0917-123-4567"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm text-gray-600">Client Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="123 Iceberg Lane, Chilltown"
              required
            />
            <button
              onClick={handleSearch}
              className="mt-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
              type="button"
            >
              Search
            </button>
          </div>
          {formData.lat && formData.lng && (
            <p className="mt-1 text-sm text-green-600">
              Location found: ({formData.lat.toFixed(5)}, {formData.lng.toFixed(5)})
            </p>
          )}
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-sm text-gray-600">Issue Description</label>
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Describe the freezer issue..."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preferred Date */}
          <div>
            <label className="block text-sm text-gray-600">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm text-gray-600">Preferred Time</label>
            <input
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>
        </div>

        {type === "admin" ? (
          <>
            <div>
              <label className="block text-sm text-gray-600">Technician</label>
                <select
                  name="technician"
                  value={formData.technicianID || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-md"
                >
                  {technicianList.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.fullName}
                    </option>
                  ))}
                </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option>Scheduled</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
          </>
        ) : null}

        <div>
          {errorList.length >= 1 ? <Alert errorList={errorList} type={errorList[0].type} /> : <></>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-md shadow-sm transition"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}
