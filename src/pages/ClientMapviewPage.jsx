import { MapContainer, TileLayer, Marker, Circle, Popup, useMap  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {getAllSingleUserReq} from "../firebase/firestoreFunctions"



const mapTiles = {
  streets: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg",
  dark: 	"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  minimal: "https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"
}

export default function ClientMapviewPage({userData}) {
  const [clients, setClients] = useState([])
  const [position, setPosition] = useState({ lat: 14.553403, lng: 121.023202 });
  const [mapTileLayer, setMapTileLayer] = useState("https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg")


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllSingleUserReq(userData.id);
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch maintenance requests", error);
      }
    };

    fetchRequests();
  }, []);

  const FlyToLocation = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, map.getZoom());
      }
    }, [position, map]);


    return null;
  };
  const handleSetMapTileLayer = (e) =>{
    // console.log(mapTiles[e.target.id])
    setMapTileLayer(mapTiles[e.target.id])
  }
  const convertTo12HourFormat = (time24) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };
  return (
    <div className="shadow-xl my-6 mx-10  rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
      <div>
        <ul className="flex w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lx">
          <li className="w-full border-r border-gray-200 last:border-r-0">
            <label className="flex w-full cursor-pointer items-center px-4 py-3 transition rounded-l-lg">
              <input
                type="radio"
                id="streets"
                name="list-radio"
                className="hidden peer"
                onChange={handleSetMapTileLayer}
              />
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full px-4 py-3 rounded-l-lg transition">
                Streets
              </span>
            </label>
          </li>
          <li className="w-full">
            <label className="flex w-full cursor-pointer items-center px-4 py-3 transition">
              <input
                type="radio"
                id="minimal"
                name="list-radio"
                className="hidden peer text"
                onChange={handleSetMapTileLayer}
              />
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full px-4 py-3 transition text-center">
                Minimal
              </span>
            </label>
          </li>
          <li className="w-full border-r border-gray-200 last:border-r-0">
            <label className="flex w-full cursor-pointer items-center px-4 py-3 transition">
              <input
                type="radio"
                id="dark"
                name="list-radio"
                className="hidden peer"
                onChange={handleSetMapTileLayer}
              />
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full px-4 py-3 transition text-center">
                Dark
              </span>
            </label>
          </li>
          <li className="w-full border-r border-gray-200 last:border-r-0">
            <label className="flex w-full cursor-pointer items-center px-4 py-3 rounded-r-lg transition">
              <input
                type="radio"
                id="light"
                name="list-radio"
                className="hidden peer"
                onChange={handleSetMapTileLayer}
              />
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full rounded-r-lg px-4 py-3 transition text-right">
                Light
              </span>
            </label>
          </li>
        </ul>
      </div>
    <MapContainer className='rounded-b-xl' attributionControl={false} zoomControl={false} center={position} zoom={50}  style={{ height: '100%', width: '100%' }}>
      <FlyToLocation position={position} />
      <TileLayer
        url={mapTileLayer}

        // OG: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"
        // Dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        // Light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
      />
      {clients.map(client=>(
        <>
        <Marker position={{ lat: client.lat, lng: client.lng }}>
          <Popup>
            <div className="bg-white rounded-xl shadow-xl p-4 w-72 text-sm text-gray-800">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{client.clientName}</h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    {
                      Completed: "bg-green-100 text-green-700",
                      Pending: "bg-yellow-100 text-yellow-700",
                      Cancelled: "bg-red-100 text-red-700",
                      Scheduled: "bg-gray-100 text-gray-600",
                      "In Progress": "bg-blue-100 text-blue-700",
                    }[client.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {client.status}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium text-gray-600">Address:</span>{" "}
                  {client.address || "—"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Date:</span>{" "}
                  {client.preferredDate || "—"} @ {convertTo12HourFormat(client.preferredTime) || "—"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Technician:</span>{" "}
                  {client.technician || "—"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Issue:</span>{" "}
                  {client.issueDescription || "—"}
                </p>
              </div>
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
        <Popup>
              <div className="p-2 text-sm">
              <h2 className="text-gray-900 mb-1">Current Position</h2>
              </div>
        </Popup>
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
  );
}