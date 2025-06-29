import { MapContainer, TileLayer, Marker, Circle, Popup, useMap  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import placeHolderClients from '../assets/data/placeHolderClients';


const mapTiles = {
  streets: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg",
  dark: 	"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  minimal: "https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"
}

export default function ClientMapviewPage() {
  const [clients, setClients] = useState(placeHolderClients)
  const [position, setPosition] = useState({ lat: 14.5995, lng: 120.9842 });
  const [mapTileLayer, setMapTileLayer] = useState("https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg")
  //Streets: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"
  //Dark: 	"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  //Light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  //Minimal: "https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"

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
  return (
    <div className="shadow-xl my-6 mx-10 space-y-6 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
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
                className="hidden peer"
                onChange={handleSetMapTileLayer}
              />
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full px-4 py-3 transition">
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
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full px-4 py-3 transition">
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
              <span className="peer-checked:bg-gray-900 peer-checked:text-white w-full rounded-r-lg px-4 py-3 transition">
                Light
              </span>
            </label>
          </li>
        </ul>
      </div>
    <MapContainer className='rounded-xl' attributionControl={false} zoomControl={false} center={position} zoom={50}  style={{ height: '100%', width: '100%' }}>
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
                <div className="p-2 text-sm #374151">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{client.clientName}</h2>
                <p className="text-gray-700"><strong>Address:</strong> {client.clientAddress}</p>
                <p className="text-gray-700"><strong>Date:</strong> {client.preferredDate}</p>
                <p className="text-gray-700"><strong>Description:</strong> {client.issueDescription}</p>
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