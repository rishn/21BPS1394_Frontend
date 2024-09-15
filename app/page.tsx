"use client"; // Ensure this is a Client Component

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter
import { FaCamera, FaFilter, FaShareAlt, FaBars } from 'react-icons/fa'; // Import icons
import Image from 'next/image';
import Logo from '../image.png';
import useTitle from '../hooks/useTitle'; // Import the useTitle hook
import { Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'; // Import the InboxOutlined icon for the upload component

const { Dragger } = Upload;

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [trademarkName, setTrademarkName] = useState<string>(searchQuery);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const router = useRouter(); // Initialize useRouter

  // Update the title based on the search and selected card
  useTitle(
    selectedCard
      ? `${selectedCard.name} Trademark | Trademark Search 21BPS1394`
      : searchQuery
      ? `${filteredResults.length} Trademark Results found for "${searchQuery}" | Trademark Search 21BPS1394`
      : 'Trademark Search 21BPS1394'
  );

  const handleSearch = async () => {
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();

      // Check if data is valid
      if (data && Array.isArray(data)) {
        setResults(data);
        // Filter results based on search query
        const filtered = data.filter((result) =>
          result.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredResults(filtered);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleCardClick = (card: any) => {
    setSearchQuery(card.name); // Update searchQuery to the card's name
    setSelectedCard(card);
  };

  const handleBackClick = () => {
    setSelectedCard(null);
    setSearchQuery(''); // Optionally clear search query
    router.push('/'); // Navigate back to the search page
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadImage(file);
  };

  return (
    <>
      <Head>
        <title>Trademark Search</title>
      </Head>
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center">
        {/* Header with search input */}
        <header className="w-full bg-[#f9fbfe] p-4 shadow-md">
          <div className="container mx-auto flex items-center">
            <Image
              src={Logo}
              alt="Logo"
              width={150}  // Increased width
              height={150}  // Increased height
              className="w-18 h-18 mr-6"  // Increased margin for better spacing
            />
            {/* Search bar with camera icon inside */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for trademarks..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-gray-500"
              />
              <FaCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
            </div>
  
            <button
              onClick={handleSearch}
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
            <button
              className="ml-2 p-2 bg-[#c76000] text-white rounded-lg hover:bg-[#b34c00]"
            >
              Apply for Trademark
            </button>
          </div>
        </header>
  
        {/* Search Status */}
        {!selectedCard && searchQuery && (
          <div className="w-full bg-white p-4 shadow-md flex items-center justify-between mb-6">
            <p className="text-gray-500">
              About {filteredResults.length} Trademarks found for "{searchQuery}"
            </p>
            <div className="flex items-center">
              <FaFilter className="text-gray-500 text-xl mr-4" />
              <FaShareAlt className="text-gray-500 text-xl mr-4" />
              <FaBars className="text-gray-500 text-xl" />
            </div>
          </div>
        )}
  
        {/* Main Content Area */}
        <div className="flex w-full">
          {/* Main Content */}
          <main className="flex-1 container mx-auto p-6">
            {selectedCard ? (
              <div className="flex flex-col items-start">
                <div className="mb-6">
                  <p className="text-gray-500 mb-2">
                    <button
                      onClick={handleBackClick}
                      className="text-[#c76000] hover:underline"
                    >
                      Trademark Search
                    </button>
                    {' '} &gt; {selectedCard.name}
                  </p>
                </div>
                <div className="flex items-start mb-6">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mr-4">
                    {/* Replace with actual logo */}
                    <span className="text-gray-400 text-4xl">Logo</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-600 mb-2">{selectedCard.name}</h2>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className={`font-semibold ${selectedCard.status === 'Registered' ? 'text-green-500' : selectedCard.status === 'Pending' ? 'text-blue-500' : 'text-red-500'}`}>Status: {selectedCard.status}</p>
                  <p className="text-gray-600">Serial Number: {selectedCard.serialNumber} filed on {selectedCard.filedDate}</p>
                  <p className="text-gray-600">Registration Number: {selectedCard.registrationNumber} registered on {selectedCard.registrationDate}</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-500">Search Results</h2>
                {/* Table Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-500 mb-4">
                  <div className="font-bold">Mark</div>
                  <div className="font-bold">Details</div>
                  <div className="font-bold">Status</div>
                </div>
  
                {/* Results */}
                {filteredResults.map((result, index) => {
                  // Determine color based on status
                  const statusColor =
                    result.status === 'Registered' ? 'text-green-500' :
                    result.status === 'Pending' ? 'text-blue-500' :
                    result.status === 'Expired' ? 'text-red-500' :
                    'text-gray-500';
  
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-white shadow-md cursor-pointer"
                      onClick={() => handleCardClick(result)}
                    >
                      {/* Logo Column */}
                      <div className="flex-none w-16 h-16 bg-gray-200 flex items-center justify-center mr-4">
                        {/* Replace with actual logo */}
                        <span className="text-gray-400 text-xl">Logo</span>
                      </div>
  
                      {/* Details Column */}
                      <div className="flex flex-col">
                        <div className="font-bold text-gray-600">{result.name}</div>
                        <div className="text-gray-600">Serial Number: {result.serialNumber}</div>
                      </div>
  
                      {/* Status Column */}
                      <div className="flex flex-col">
                        <div className={`font-semibold mb-1 ${statusColor}`}>{result.status}</div>
                        <div className="text-gray-600">Filing Date: {result.filedDate}</div>
                        <div className="text-gray-600">Registration Date: {result.registrationDate}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </main>
  
          {/* Sidebar Panel */}
          {!selectedCard && searchQuery && (
            <aside className="w-80 p-6 bg-[#f9fafb] shadow-md">
              {/* Apply for Trademark Card */}
              <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Apply for Trademark</h3>
                <p className="text-gray-600 mb-4">Select countries to protect your logo trademark</p>
                <input
                  type="text"
                  value={trademarkName}
                  onChange={(e) => setTrademarkName(e.target.value)}
                  placeholder={searchQuery}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-[#f9fafb] focus:outline-none text-gray-600"
                />
                <select className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-gray-400">
                  <option value="United States">United States</option>
                  {/* Add more countries as needed */}
                </select>
                <button className="w-full p-2 bg-[#c76000] text-white rounded-lg hover:bg-[#b34c00]">
                  Apply Now
                </button>
              </div>
  
              {/* Image Search Card */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Image Search</h3>
                <Dragger
                  name="file"
                  accept="image/*"
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    // Handle file upload logic here
                    console.log(file);
                    onSuccess?.({}, );
                  }}
                >
                  <FaCamera className="text-gray-500 text-2xl mb-2" />
                  <p className="text-gray-600">Drag and drop or click to upload an image</p>
                </Dragger>
              </div>
            </aside>
          )}
        </div>
  
        {/* Footer */}
        <footer className="w-full bg-[#c76000] text-white p-4">
          <div className="container mx-auto text-center">
            &copy; 2024 Trademark Search App
          </div>
        </footer>
      </div>
    </>
  );
};

export default SearchPage;
