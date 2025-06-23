import { useState, useEffect  } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap  } from 'react-leaflet';
import { Navigate, useNavigate } from 'react-router-dom'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getAllOfUserReq, submitMaintenanceRequest } from '../firebase/firestore.js'; 

import { useAuth } from '../firebase/authContext.jsx'
import Navbar from '../components/navbar.jsx'
import LocationSearch from '../components/locationSearch';
import AllClientView from '../components/allClientView.jsx';
import ErrorCard from '../components/errorCard.jsx';




function ClientPage() {
  const { currentUser } = useAuth();


    const [clients, setClients] = useState([]);

    const [errorMsg, setErrorMsg] = useState([])

    const [clientName, setClientName] = useState('');
    const [address, setAddress] = useState('')
    const [date, setDate] = useState('');
    const [time, setTime] = useState('')
    //ClientID
    const [technicianID, setTechnicianID] = useState("Unfinalized")
    const [status, setStatus] = useState('Unfinalized')
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState({ lat: 14.56627, lng: 121.01545 });


  useEffect(() => {
    const fetchClients = async () => {
      console.log(currentUser)
      if (currentUser?.uid) {
        try {
          const data = await getAllOfUserReq(currentUser.uid);
          setClients(data);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      }
    };
    fetchClients()
  }, [currentUser]);
  useEffect(() => {
    if (!currentUser) {
      setErrorMsg(prevMsg =>
        prevMsg.includes("Must Login/Create Account")
          ? prevMsg
          : [...prevMsg, "Must Login/Create Account"]
      );
      return;
    }
    if (!currentUser.emailVerified) {
      setErrorMsg(prevMsg =>
        prevMsg.includes("Must Validate Email Account")
          ? prevMsg
          : [...prevMsg, "Must Validate Email Account"]
      );
    }

  }, []);

    const handleAddClient = async (newClient) => {
        setErrorMsg([])
        const { name, date, time, description, clientID, address, position} = newClient;
        let addClient =   {
            name: name,
            address: address,
            date: date,
            time: time,
            clientID: clientID,
            lat: position.lat,
            lng: position.lng,
            description: description,
        }
        console.log(newClient)
    
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

  return (
    
    <>
    <Navbar currentUser={currentUser}/>

    <main>

    <article>
        <header class="mx-auto mt-20 max-w-screen-lg rounded-t-lg bg-white pt-16 text-center shadow-lg">
        <p class="text-gray-500">Aucma Service</p>
        <h1 class="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">Send A Request</h1>
        <p class="mt-6 text-lg text-gray-700">A schedule can be set!</p>
        <div class="mt-6 flex flex-wrap justify-center gap-2">
        </div>
        <img class="-z-10 absolute top-0 left-0 mt-10 h-96 w-full object-cover" src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
        </header>

      <div class=" container grid grid-cols-12 mx-auto max-w-screen-lg space-y-12 rounded-b-lg bg-white px-8 pt-10 pb-20 font-serif text-lg tracking-wide text-gray-700 sm:shadow-lg">
        
        <div className="relative flex bg-center bg-no-repeat bg-cover col-span-12 py-2 min-h-96">
          <div className="w-full h-full">
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
                      <p className="text-gray-700"><strong>Description:</strong> {client.description}</p>
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

      <form className="space-y-8 md:space-y-3 flex flex-col col-span-12 py-2">
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
            disabled={!currentUser || !currentUser.emailVerified}
            onChange={(e) => setClientName(e.target.value)}
            />
        </div>

        <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Address
            </label>
            <LocationSearch onSelectLocation={(setPosition)} setAddressText={(setAddress)} />
        </div>

        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
            </label>
            <input
            disabled={!currentUser || !currentUser.emailVerified}
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
            disabled={!currentUser || !currentUser.emailVerified}
            required
            type="time"
            id="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            />
        </div>


        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
            </label>
            <textarea
            id="description"
            disabled={!currentUser || !currentUser.emailVerified}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
            placeholder="Enter additional notes or description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>
        {(errorMsg.length > 0 ? <ErrorCard errorMsg={errorMsg}/> : <></>)}
        

        <div>
            <button
            disabled={!currentUser || !currentUser.emailVerified}
            type="button"
            className="w-full px-4 py-2 text-white bg-gray-900 hover:bg-orange-600 rounded-md text-sm font-semibold shadow"
            onClick={() =>
                handleAddClient({
                    name: clientName, clientID: currentUser.uid,date, time, description, address, technicianID, position, status
                })}
            >
            Add
            </button>
        </div>
      </form>
      </div>
    </article>
    </main>

    <div class="w-fit mx-auto mt-10 flex space-x-2">
    <div class="h-0.5 w-2 bg-gray-600"></div>
    <div class="h-0.5 w-32 bg-gray-600"></div>
    <div class="h-0.5 w-2 bg-gray-600"></div>
    </div>

    <aside aria-label="Recent Posts" class="mx-auto mt-10 max-w-screen-xl py-20">
  <div class="mx-auto max-w-screen-xl px-4 md:px-8">
    <div class="mb-10 md:mb-16">
      <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Service Request History</h2>
    </div>
    <div class="">
      <AllClientView isClient={true} clientList={clients}/>
    </div>
  </div>
</aside>


    </>
    
  )
}

export default ClientPage
