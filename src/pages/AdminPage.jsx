import { useState, useEffect  } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { placeHolderClients } from '../assets/data/placeHolderClients.js'

import { useAuth } from '../firebase/authContext.jsx'
import { Navigate, useNavigate } from 'react-router-dom'


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import LocationSearch from '../components/locationSearch';


function AdminPage() {
    const { userLoggedIn } = useAuth();

      const [clients, setClients] = useState(placeHolderClients);

    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState({ lat: 14.5995, lng: 120.9842 });

    const handleAddClient = (newClient) => {
      const { name, date, description, position} = newClient;
      let addClient =   {
        name: name,
        address: "6789 Ayala Ave, Makati City",
        date: date,
        lat: position.lat,
        lng: position.lng,
        description: description,
      }

      // Check if all fields are filled
      const isValid =
        name.trim() !== "" &&
        date.trim() !== "" &&
        description.trim() !== "" &&
        position.lat !== 14.5995 &&
        position.lng !== 120.9842;

      if (!isValid) {
        alert("All fields must be filled before adding the client.");
        return;
      }

      setClients((prevClients) => [...prevClients, addClient]);
      setPosition({ lat: 14.5995, lng: 120.9842 })
    };


    console.log(placeHolderClients)

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
    {/* POPUP */}
    <div className="relative">
        <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-xl shadow-lg w-80 space-y-3">
            <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
                </label>
                <input
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
                <LocationSearch onSelectLocation={(setPosition)} />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
                </label>
                <input
                type="date"
                id="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
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
                <div className="pt-2">
                    <button
                    type="button"
                    className="w-full px-4 py-2 text-white bg-gray-900 hover:bg-orange-600 rounded-md text-sm font-semibold shadow"
                    onClick={() =>
                      handleAddClient({
                        name: clientName,
                        date,
                        description,
                        position
                      })
}
                    >
                    Add
                    </button>
                </div>
        </div>

      

      {/* Leaflet Map */}
      <MapContainer center={position} zoom={50} style={{ height: '100vh', width: '100%' }}>
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
    </>
    
  )
}

export default AdminPage
