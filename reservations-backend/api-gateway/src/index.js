const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    title: 'BreazeInTheMoon Hotel Reservation System',
    version: '1.0.0',
    description: 'Microservices-based hotel reservation system API Gateway',
    architecture: 'Microservices with centralized authentication',
    services: {
      'auth-service': {
        url: 'http://localhost:3001',
        description: 'Authentication and JWT token management',
        status: 'Ready for implementation'
      },
      'user-service': {
        url: 'http://localhost:3002',
        description: 'User profile management and CRUD operations',
        status: 'Ready for implementation'
      },
      'hotel-service': {
        url: 'http://localhost:3003',
        description: 'Hotel and room management with advanced search',
        status: 'Ready for implementation'
      },
      'reservation-service': {
        url: 'http://localhost:3004',
        description: 'Booking management with real-time availability',
        status: 'Ready for implementation'
      },
      'review-service': {
        url: 'http://localhost:3005',
        description: 'Customer reviews and ratings system',
        status: 'Ready for implementation'
      },
      'notification-service': {
        url: 'http://localhost:3006',
        description: 'Real-time notifications and email alerts',
        status: 'Ready for implementation'
      },
      'report-service': {
        url: 'http://localhost:3007',
        description: 'Analytics and reporting for hotel owners',
        status: 'Ready for implementation'
      },
      'payment-service': {
        url: 'http://localhost:3008',
        description: 'Payment processing and transaction management',
        status: 'Ready for implementation'
      }
    },
    features: {
      'authentication': 'JWT-based centralized authentication',
      'authorization': 'Role-based access control (Customer, Hotel Admin, System Admin)',
      'search': 'Advanced hotel search with filters',
      'booking': 'Real-time availability management',
      'reviews': 'Customer feedback and rating system',
      'notifications': 'Real-time alerts and email notifications',
      'analytics': 'Business intelligence for hotel owners',
      'payments': 'Secure payment processing'
    },
    database: {
      type: 'MySQL 8.0',
      host: 'mysql:3306',
      schema: 'reservations'
    },
    cache: {
      type: 'Redis',
      host: 'redis:6379'
    }
  });
});

// Mock authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Mock successful login
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: '1',
        email: email,
        name: 'Demo User',
        role: 'CUSTOMER'
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

// Mock registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role = 'CUSTOMER' } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and name are required'
    });
  }

  // Mock successful registration
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

// Mock hotels endpoint
app.get('/api/hotels', (req, res) => {
  const { city, page = 1, limit = 10 } = req.query;
  
  const mockHotels = [
    {
      id: '1',
      name: 'Grand Hotel Madrid',
      description: 'Luxury hotel in the heart of Madrid',
      city: 'Madrid',
      country: 'Spain',
      rating: 4.5,
      price: 150,
      image: 'https://via.placeholder.com/300x200',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
    },
    {
      id: '2',
      name: 'Barcelona Beach Resort',
      description: 'Beautiful beachfront resort',
      city: 'Barcelona',
      country: 'Spain',
      rating: 4.2,
      price: 120,
      image: 'https://via.placeholder.com/300x200',
      amenities: ['WiFi', 'Beach Access', 'Pool', 'Bar']
    },
    {
      id: '3',
      name: 'Seville Historic Inn',
      description: 'Charming historic hotel',
      city: 'Seville',
      country: 'Spain',
      rating: 4.0,
      price: 90,
      image: 'https://via.placeholder.com/300x200',
      amenities: ['WiFi', 'Restaurant', 'Garden']
    }
  ];

  let filteredHotels = mockHotels;
  if (city) {
    filteredHotels = mockHotels.filter(hotel => 
      hotel.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  res.json({
    success: true,
    data: {
      hotels: filteredHotels,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredHotels.length,
        totalPages: Math.ceil(filteredHotels.length / limit)
      }
    }
  });
});

// Mock hotel details endpoint
app.get('/api/hotels/:id', (req, res) => {
  const { id } = req.params;
  
  const hotel = {
    id: id,
    name: 'Grand Hotel Madrid',
    description: 'Luxury hotel in the heart of Madrid with excellent service and amenities.',
    city: 'Madrid',
    country: 'Spain',
    address: '123 Gran Via, Madrid, Spain',
    rating: 4.5,
    reviewCount: 156,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Business Center'],
    images: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300'
    ],
    rooms: [
      {
        id: '1',
        type: 'Standard Room',
        capacity: 2,
        price: 150,
        available: true,
        amenities: ['WiFi', 'TV', 'Air Conditioning']
      },
      {
        id: '2',
        type: 'Deluxe Suite',
        capacity: 4,
        price: 250,
        available: true,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony']
      }
    ]
  };

  res.json({
    success: true,
    data: hotel
  });
});

// Catch all route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    suggestion: 'Try /api-docs for available endpoints'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 BreazeInTheMoon API Gateway running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('🏨 Available Mock Endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('  GET  /api/hotels');
  console.log('  GET  /api/hotels/:id');
  console.log('');
  console.log('✅ System ready for frontend integration!');
});