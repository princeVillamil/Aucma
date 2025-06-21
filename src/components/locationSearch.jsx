import React, { useState } from "react";

function LocationSearch({ onSelectLocation, setIsValidLocation}) {
  const [address, setAddress] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!address) return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      onSelectLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      alert("Location not found");
    }
  };

  return (

    <form onSubmit={handleSearch} class="flex items-center mx-auto">   
        <label for="voice-search" class="sr-only">Search</label>
        <div class="relative w-full">
            <input 
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text" 
                id="voice-search" 
                class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm block w-full p-2.5" 
                placeholder="123 Aucma St, Manila..." 
                required />
        </div>
        <button type="submit" class="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 text-white bg-gray-900 hover:bg-orange-600 rounded-md text-sm font-semibold shadow">
            <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>Search
        </button>
    </form>

    // <form onSubmit={handleSearch}>
    //   <input
    //     type="text"
    //     value={address}
    //     onChange={(e) => setAddress(e.target.value)}
    //     placeholder="Search address..."
    //   />
    //   <button type="submit">Search</button>
    // </form>
  );
};

export default LocationSearch;