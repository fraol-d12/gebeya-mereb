const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Get all listings
router.get('/listings', async (req, res) => {
  try {
    console.log('Fetching all listings...');
    const listings = await Listing.findAll();
    console.log('Found listings:', JSON.stringify(listings, null, 2));
    res.json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
  }
});

// Get single listing by ID
router.get('/listings/:id', async (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    console.log('Fetching listing with ID:', listingId);
    
    if (isNaN(listingId)) {
      console.log('Invalid listing ID:', req.params.id);
      return res.status(400).json({ message: 'Invalid listing ID' });
    }

    // First check if the listing exists
    const listing = await Listing.findOne({
      where: { id: listingId }
    });
    
    console.log('Database query result:', listing ? JSON.stringify(listing, null, 2) : 'null');
    
    if (!listing) {
      console.log('Listing not found for ID:', listingId);
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    console.log('Found listing:', JSON.stringify(listing, null, 2));
    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ message: 'Failed to fetch listing', error: err.message });
  }
});

// Create new listing
router.post('/listings', async (req, res) => {
  try {
    console.log('Creating new listing with data:', req.body);
    const listing = await Listing.create(req.body);
    console.log('Created listing:', JSON.stringify(listing, null, 2));
    res.status(201).json(listing);
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ message: 'Failed to create listing', error: err.message });
  }
});

module.exports = router;
