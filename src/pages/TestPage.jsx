import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


function TestPage() {
    const [address, setAddress] = useState('');
    const position = [14.5995, 120.9842];

  return (
    
    <>
    <section className="px-5 py-10 dark:bg-gray-100 dark:text-gray-800">
    <div className="container grid grid-cols-12 mx-auto gap-y-6 md:gap-10">
        
        {/* Left Sidebar */}
        <div className="flex flex-col justify-between col-span-12 py-2 space-y-8 md:space-y-16 md:col-span-3">
        <div className="flex flex-col space-y-8 md:space-y-12">
            {[
            "Donec sed elit quis odio mollis dignissim eget et nulla.",
            "Ut fermentum nunc quis ipsum laoreet condimentum.",
            "Nunc nec ipsum lobortis, pulvinar neque sed."
            ].map((text, i) => (
            <div key={i} className="flex flex-col space-y-2">
                <h3 className="flex items-center space-x-2 dark:text-gray-600">
                <span className="flex-shrink-0 w-2 h-2 uppercase rounded-full dark:bg-violet-600" />
                <span className="text-xs font-bold tracking-wider uppercase">Exclusive</span>
                </h3>
                <a href="#" className="font-serif hover:underline">{text}</a>
                <p className="text-xs dark:text-gray-600">
                {["47 minutes", "2 hours", "4 hours"][i]} ago by{" "}
                <a href="#" className="hover:underline dark:text-violet-600">Leroy Jenkins</a>
                </p>
            </div>
            ))}
        </div>
        <div className="flex flex-col w-full space-y-2">
            <div className="flex w-full h-1 bg-opacity-10 dark:bg-violet-600">
            <div className="w-1/2 h-full dark:bg-violet-600" />
            </div>
            <a href="#" className="flex items-center justify-between w-full">
            <span className="text-xs font-bold tracking-wider uppercase">See more exclusives</span>
            <svg
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 text-violet-600"
            >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
            </a>
        </div>
        </div>

        {/* Map Section */}
        <div
        className="relative flex col-span-12 dark:bg-gray-500 bg-center bg-no-repeat bg-cover xl:col-span-6 lg:col-span-5 md:col-span-9 min-h-96"
        style={{ backgroundImage: "url('https://source.unsplash.com/random/239x319')" }}
        >
        <span className="absolute px-1 pb-2 text-xs font-bold uppercase border-b-2 left-6 top-6 dark:text-gray-800 dark:border-violet-600">Paris, France</span>
        <div className="w-full h-full">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=S5NBfX61EcPeciB2gyPg"
                attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
            />
            <Marker position={position}>
                <Popup>This is your pinpoint</Popup>
            </Marker>
            <Circle
                center={position}
                radius={250}
                pathOptions={{
                color: '#F15A29',
                fillColor: '#FF7C4D',
                fillOpacity: 0.3,
                }}
            />
            </MapContainer>
        </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden py-2 xl:col-span-3 lg:col-span-4 md:hidden lg:block">
        <div className="mb-8 space-x-5 border-b-2 border-opacity-10 dark:border-violet-600">
            <button type="button" className="pb-5 text-xs font-bold uppercase border-b-2 dark:border-violet-600">Latest</button>
            <button type="button" className="pb-5 text-xs font-bold uppercase border-b-2 dark:border-gray-300 dark:text-gray-600">Popular</button>
        </div>
        <div className="flex flex-col divide-y dark:divide-gray-300">
            {[
            { text: "Aenean ac tristique lorem, ut mollis dui.", tag: "Politics" },
            { text: "Nulla consectetur efficitur.", tag: "Sports" },
            { text: "Vitae semper augue purus tincidunt libero.", tag: "World" },
            { text: "Suspendisse potenti.", tag: "Business" },
            ].map((item, i) => (
            <div key={i} className="flex px-1 py-4">
                <img
                alt=""
                className="flex-shrink-0 object-cover w-20 h-20 mr-4 dark:bg-gray-500"
                src={`https://source.unsplash.com/random/24${i + 4}x32${i + 4}`}
                />
                <div className="flex flex-col flex-grow">
                <a href="#" className="font-serif hover:underline">{item.text}</a>
                <p className="mt-auto text-xs dark:text-gray-600">
                    {["5", "14", "22", "37"][i]} minutes ago{" "}
                    <a href="#" className="block dark:text-blue-600 lg:ml-2 lg:inline hover:underline">{item.tag}</a>
                </p>
                </div>
            </div>
            ))}
        </div>
        </div>

    </div>
    </section>

    </>
    
  )
}

export default TestPage
