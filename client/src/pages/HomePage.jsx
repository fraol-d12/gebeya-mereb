import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import mainLogo from '../assets/mainLogo.png';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/listing/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={mainLogo} alt="Gebeya Mereb Logo" className="sidebar-logo" />
        <nav className="sidebar-nav">
          <a href="#" className="sidebar-nav-link active">
            <div className="sidebar-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span>Home</span>
          </a>
          <a href="#" className="sidebar-nav-link">
             <div className="sidebar-icon">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
             </svg>
             </div>
            <span>New listing</span>
          </a>
          <a href="#" className="sidebar-nav-link">
             <div className="sidebar-icon">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
             </svg>
             </div>
            <span>My listings</span>
          </a>
          <a href="#" className="sidebar-nav-link">
            <div className="sidebar-icon">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
             </svg>
            </div>
            <span>Messages</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex">
            <input
              type="text"
              placeholder="Search listings..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#001f3e]"
            />
            <button className="px-6 py-2 bg-[#001f3e] text-white rounded-r-lg hover:bg-[#003366] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          <button className="px-4 py-2 border border-[#001f3e] rounded-full text-[#001f3e] hover:bg-[#001f3e] hover:text-white transition-colors">
            Category
          </button>
          <button className="px-4 py-2 border border-[#001f3e] rounded-full text-[#001f3e] hover:bg-[#001f3e] hover:text-white transition-colors">
            Location
          </button>
          <button className="px-4 py-2 border border-[#001f3e] rounded-full text-[#001f3e] hover:bg-[#001f3e] hover:text-white transition-colors">
            Price Range
          </button>
          <button className="px-4 py-2 border border-[#001f3e] rounded-full text-[#001f3e] hover:bg-[#001f3e] hover:text-white transition-colors">
            Minimum Commitment
          </button>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => {
              return (
                <div
                  key={listing.id}
                  onClick={() => handleCardClick(listing.id)}
                  className="listing-card"
                >
                  <div className="relative">
                    <img
                      src={listing.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                      alt={listing.title || 'Listing image'}
                      className="listing-img"
                    />
                    {listing.category && (
                      <span className="category-badge">
                        {listing.category.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.title || 'No Title'}</h3>
                    {(listing.rating !== undefined && listing.ratingsCount !== undefined) && (
                      <div className="mt-2 flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(listing.rating) ? 'fill-current' : 'stroke-current fill-none'}`}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({listing.ratingsCount || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-xl mt-8">No listings found.</div>
        )}
      </main>
    </div>
  );
};

export default HomePage; 