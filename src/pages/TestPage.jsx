import { useState, useEffect  } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap  } from 'react-leaflet';
import { Navigate, useNavigate } from 'react-router-dom'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useAuth } from '../firebase/authContext.jsx'
import { placeHolderClients } from '../assets/data/placeHolderClients.js'

import { getAllMaintenanceRequest, submitMaintenanceRequest, getAllTechnicians, deleteDocumentById } from '../firebase/firestore.js'; 
// deleteDocumentById = async (collectionName, docId)


import Navbar from '../components/navbar.jsx'
import LocationSearch from '../components/locationSearch';
import AllClientView from '../components/allClientView.jsx';
import ClientList from '../components/clientList.jsx';
import ErrorCard from '../components/errorCard.jsx';
import { doc } from 'firebase/firestore/lite';





function TestPage() {
    // const position = [14.5995, 120.9842];

    const { currentUser } = useAuth();

    const [allTechnicians, setAllTechnicians] = useState([])
    const [errorMsg, setErrorMsg] = useState([])
    const [clients, setClients] = useState([]);

    const [clientName, setClientName] = useState('');
    const [address, setAddress] = useState('')
    const [date, setDate] = useState('');
    const [time, setTime] = useState('')
    //ClientID
    const [technicianID, setTechnicianID] = useState("unfinalized")
    const [status, setStatus] = useState('unfinalized')
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState({ lat: 14.56627, lng: 121.01545 });

    useEffect(() => {
        const fetchClients = async () => {
            if (currentUser?.uid) {
            try {
                const data = await getAllMaintenanceRequest();
                const tech = await getAllTechnicians()
                setClients(data);
                setAllTechnicians(tech)
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
            }
        };
        fetchClients()
    }, [currentUser]);

    const handleDeleteClient = async(collectionName, docID)=>{
        // console.log(collectionName, docID, "Function")
        if (currentUser?.uid) {
            try {
                deleteDocumentById(collectionName, docID)
                const data = await getAllMaintenanceRequest();
                setClients(data);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        }
    }
    const handleAddClient = async (newClient) => {
        setErrorMsg([])
        const { name, date, time, technicianID, status, description, clientID, address, position} = newClient;
        let addClient =   {
            name: name,
            address: address,
            date: date,
            time: time,
            clientID: clientID,
            status: status,
            technicianID: technicianID,
            lat: position.lat,
            lng: position.lng,
            description: description,
        }
    
        const isValid =
            name.trim() !== "" &&
            date.trim() !== "" &&
            time.trim() !== "" &&
            description.trim() !== "" &&
            position.lat !== 14.5995 &&
            position.lng !== 120.9842;
    
        if (!isValid) {
            setErrorMsg((prevMsg)=>[...prevMsg, "All fields must be filled before adding the client."])
            return;
        }
        try {
            const requestID = await submitMaintenanceRequest(addClient);
            console.log("Request added with ID:", requestID);
            const clientWithID = { ...addClient, id: requestID };
            setClients((prevClients) => [...prevClients, clientWithID]);
            setPosition({ lat: 14.56627, lng: 121.01545 });
            setClientName('')
            setAddress('')
            setAddress('')
            setDate('')
            setTime('')
            setDescription('')
            setTechnicianID('unfinalized')
            setStatus('unfinalized')
        } catch (error) {
            setErrorMsg((prevMsg) => [
                ...prevMsg,
                "Failed to submit maintenance request.",
                ]);
            console.error("Submit error:", error);
        }
        
        
        // setClients((prevClients) => [...prevClients, addClient]);
        // setPosition({ lat: 14.56627, lng: 121.01545 })
    };
    
    
    
    const FlyToLocation = ({ position }) => {
        const map = useMap();
    
        useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
            }
        }, [position, map]);
    
        return null;
    };
    function convertTo12HourFormat(time24) {
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12; // convert "0" to "12"
        return `${hour}:${minute} ${ampm}`;
    }
    

  return (
    
    <>
    {/* {currentUser && currentUserInfo?.emailVerified && (
        <Navigate to="/" replace={true} />
    )} */}
    <Navbar currentUser={currentUser}/>
    <section style={{ height: "calc(100vh - 96px)" }} className="px-5 py-10 dark:text-gray-800">
    <div className="container grid grid-cols-12 mx-auto gap-y-6 md:gap-10">
        
        {/* Left Sidebar */}
{/* className="relative flex col-span-6 dark:bg-gray-500 bg-center bg-no-repeat bg-cover xl:col-span-6 lg:col-span-5 md:col-span-12 min-h-96" */}

    <form className="space-y-8 md:space-y-3 flex flex-col col-span-12 py-2 xl:col-span-6 lg:col-span-6 md:col-span-12">
    <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
        Client Name
        </label>
        <input
        required
        type="text"
        id="clientName"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
        placeholder="Full Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        />
    </div>

    <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
        Enter Address
        </label>
        <LocationSearch onSelectLocation={(setPosition)} setAddressText={(setAddress)} addressValue={(address)} />
    </div>

    <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
        Date
        </label>
        <input
        required
        type="date"
        id="date"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        />
    </div>

    <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
        Time
        </label>
        <input
        required
        type="time"
        id="time"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        />
    </div>

    <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
            <label htmlFor="technician" className="block text-sm font-medium text-gray-700 mb-1">
            Technician
            </label>
            <select
            onChange={(e) => setTechnicianID(e.target.value)} 
            required
            id="technician"
            value={technicianID}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
            <option value="unfinalized">unfinalized</option>
            {allTechnicians.map((tech)=>{
                return <option value={tech.id}>{tech.displayName}</option>
            })}
            {/* <option value="tech-1">Technician 1</option>
            <option value="tech-2">Technician 2</option> */}
            </select>
        </div>

        <div className="w-full md:w-1/2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
            </label>
            <select
            onChange={(e) => setStatus(e.target.value)} 
            required
            id="status"
            value={status}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
            <option value="unfinalized">unfinalized</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
            </select>
        </div>
    </div>


    <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Description
        </label>
        <textarea
        id="description"
        rows="3"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
        placeholder="Enter additional notes or description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
    </div>

    <div>
        {(errorMsg.length > 0 ? <ErrorCard errorMsg={errorMsg}/> : <></>)}
        <button
        type="button"
        className="w-full px-4 py-2 text-white bg-gray-900 hover:bg-orange-600 rounded-md text-sm font-semibold shadow"
        onClick={() =>
            handleAddClient({
                name: clientName, clientID: currentUser.uid, date, time, description, address, technicianID, position, status
            })}
        >
        Add
        </button>
    </div>
    </form>

        {/* Map Section */}
        <div
        className="relative flex bg-center bg-no-repeat bg-cover col-span-12 py-2 xl:col-span-6 lg:col-span-6 md:col-span-12 min-h-96"
        // style={{ backgroundImage: "url('https://source.unsplash.com/random/239x319')" }}
        >
            
        <div className="w-full h-full">
             {/* center={position} zoom={13} style={{ height: '100%', width: '100%' }} */}
        <MapContainer center={position} zoom={50} style={{ height: '100%', width: '100%' }}>
            <FlyToLocation position={position} />
            <TileLayer
            url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"
            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
            />
            {clients.map(client=>(
            <>
            <Marker position={{ lat: client.lat, lng: client.lng }}>
                <Popup>
                    <div className="p-2 text-sm #374151">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h2>
                    <p className="text-gray-700"><strong>Address:</strong> {client.address}</p>
                    <p className="text-gray-700"><strong>Date:</strong> {client.date}</p>
                    <p className="text-gray-700"><strong>Address:</strong> {convertTo12HourFormat(client.time)}</p>
                    <p className="text-gray-700"><strong>TechnicianID:</strong> {client.technicianID}</p>
                    <p className="text-gray-700"><strong>Description:</strong> {client.description}</p>
                    <p className="text-white bg-gray-900 border rounded px-2 py-1 text-sm leading-tight inline-block">
                    <strong className="font-medium">Status:</strong> {client.status}
                    </p>
                    </div>
                </Popup>
            </Marker>

            <Circle
                center={{ lat: client.lat, lng: client.lng }}
                radius={150}
                pathOptions={{
                color: '#111827',
                fillColor: '	#374151',
                fillOpacity: 0.3,
                }}
            />
            </>
            ))}
        <Marker position={position}>
        {/* <Popup>
                <div className="p-2 text-sm">
                <h2 className="text-lg font-semibold text-blue-700 mb-1">Juan Dela Cruz</h2>
                <p className="text-gray-700"><strong>Address:</strong> 123 Rizal St, Makati City</p>
                <p className="text-gray-700"><strong>Date:</strong> June 15, 2025</p>
                <p className="text-gray-700"><strong>Description:</strong> Visited site for inspection. No issues reported.</p>
                </div>
          </Popup> */}
        </Marker>

            <Circle
            center={position}
            radius={150}
            pathOptions={{
                color: '#F15A29',
                fillColor: '#FF7C4D',
                fillOpacity: 0.3,
            }}
            />
        </MapContainer>
        </div>
        </div>

    </div>
    <AllClientView clientList={clients} handleDeleteClient={handleDeleteClient}/>
    </section>

    </>
    
  )
}

export default TestPage
