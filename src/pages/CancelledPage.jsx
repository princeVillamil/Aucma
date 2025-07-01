
import { useState } from "react";
import Alert from "../components/Alert";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {updateMaintenanceRequest, pushCancelMessage, pushCancelMessageToRequest} from "../firebase/firestoreFunctions"
import {serverTimestamp} from "firebase/firestore";

export default function CancelledPage({type="admin", userData}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [reqData, setReqData] = useState(location.state.formData)
  const [userMessageLog, setUserMessageLog] = useState(userData.message)
  console.log(reqData)
  const [errorList, setErrorList] = useState([])    
  const [formData, setFormData] = useState(
    {
      cancelMessage: "",
      canceledBY: userData.fullName ,
      canceledBYID: userData.id,
      canceledBYEmail: userData.email,
      clientID: reqData.clientID,
      clientName: reqData.clientName,

      issueDescription: reqData.issueDescription,
      requestID: reqData.id,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //pushCancelMessage(requestID, cancelData) pushCancelMessageToRequest(requestID, cancelData)
  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = [];
    if (!formData.cancelMessage.trim()) {
      errors.push({
        type: "danger",
        title: "Cancel Message is required.",
        message: "Please provide a reason for cancelling the request.",
      });
    }
    if (errors.length > 0) {
      setErrorList(errors);
      return;
    }
    try {
      if(type=="admin"){
        await pushCancelMessage(reqData.clientID, formData);
        // await updateMaintenanceRequest(reqData.id, {
        //   status: "Cancelled",
        //   canceledBY: userData.fullName,
        //   canceledBYID: userData.id,
        //   canceledBYEmail: userData.email,
        //   cancelMessage: formData.cancelMessage,
        //   updatedAt: serverTimestamp(),
        // });
        navigate("/admin/dashboard/maintenance-requests");
      }else{
        await pushCancelMessageToRequest(formData.requestID, formData.cancelMessage)
        navigate("/client/dashboard/home");
      }
    } catch (err) {
      console.error(err);
      setErrorList([
        {
          type: "danger",
          title: "Error cancelling request.",
          message: err.message || "Please try again later.",
        },
      ]);
    }
  };

  return (
    <div className="my-6 py-6 px-6 mx-10 space-y-6 bg-white border border-gray-200 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800">Cancel Maintenance Request</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Request Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Client Name</label>
            <input
              type="text"
              value={reqData.clientName}
              disabled
              className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Technician</label>
            <input
              type="text"
              value={reqData.canceledBY}
              disabled
              className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        {/* Issue Description (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Issue Description</label>
          <textarea
            name="issueDescription"
            value={reqData.issueDescription}
            disabled
            rows="3"
            className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
          />
        </div>

        {/* Cancel Message */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Cancellation Message</label>
          <textarea
            name="cancelMessage"
            value={formData.cancelMessage}
            onChange={handleChange}
            rows="3"
            placeholder="Write a short message explaining why this request is being cancelled..."
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>

        {/* Alerts */}
        {errorList.length > 0 && <Alert errorList={errorList} type={errorList[0].type} />}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 text-red-600 border border-red-700 bg-red-50 hover:bg-red-100 rounded-md shadow-sm transition"
          >
            Cancel Request
          </button>
        </div>
      </form>
    </div>
  );
}
