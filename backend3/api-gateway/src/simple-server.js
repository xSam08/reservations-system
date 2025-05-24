const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock hotels endpoint
app.get('/api/hotels', (req, res) => {
  const mockHotels = [
    {
      hotelId: 1,
      name: "Hotel Paradise",
      city: "Madrid",
      address: {
        street: "Gran Via 123",
        city: "Madrid",
        country: "Spain"
      },
      averageRating: 4.5,
      rooms: [
        {
          roomId: 1,
          roomType: "Standard",
          price: 120,
          isAvailable: true
        }
      ]
    },
    {
      hotelId: 2,
      name: "Sunset Resort",
      city: "Barcelona",
      address: {
        street: "Las Ramblas 456",
        city: "Barcelona",
        country: "Spain"
      },
      averageRating: 4.8,
      rooms: [
        {
          roomId: 2,
          roomType: "Deluxe",
          price: 200,
          isAvailable: true
        }
      ]
    }
  ];

  const { city, limit = 10 } = req.query;
  let filteredHotels = mockHotels;

  if (city) {
    filteredHotels = mockHotels.filter(hotel => 
      hotel.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  res.json({
    success: true,
    data: filteredHotels.slice(0, parseInt(limit)),
    total: filteredHotels.length
  });
});

// Mock hotel details endpoint
app.get('/api/hotels/:id', (req, res) => {
  const hotelId = parseInt(req.params.id);
  
  const hotel = {
    hotelId,
    name: `Hotel ${hotelId}`,
    description: "A beautiful hotel with excellent service",
    address: {
      street: "Example Street 123",
      city: "Example City",
      country: "Example Country"
    },
    amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
    rooms: [
      {
        roomId: hotelId * 10,
        roomType: "Standard",
        capacity: 2,
        price: 120,
        isAvailable: true
      }
    ]
  };

  res.json({
    success: true,
    data: hotel
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered successfully',
    userId: Math.floor(Math.random() * 1000)
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token-' + Date.now()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📚 Health Check: http://localhost:${PORT}/health`);
  console.log(`🏨 Hotels API: http://localhost:${PORT}/api/hotels`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/*`);
});