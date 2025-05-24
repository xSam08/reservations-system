const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health endpoint
  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'BreazeInTheMoon API Gateway is running',
      timestamp: new Date().toISOString(),
      system: 'Hotel Reservation System',
      status: 'Operational'
    }));
    return;
  }

  // API Documentation
  if (pathname === '/api-docs') {
    res.writeHead(200);
    res.end(JSON.stringify({
      title: 'BreazeInTheMoon Hotel Reservation System',
      version: '1.0.0',
      description: 'Microservices-based hotel reservation system',
      company: 'BreazeInTheMoon',
      architecture: {
        pattern: 'Microservices',
        gateway: 'API Gateway with centralized authentication',
        services: 8,
        database: 'MySQL 8.0',
        cache: 'Redis 7',
        frontend: 'Angular (ready for connection)'
      },
      services: {
        'auth-service': 'Authentication and JWT management',
        'user-service': 'User profile management',
        'hotel-service': 'Hotel and room management',
        'reservation-service': 'Booking with real-time availability',
        'review-service': 'Customer reviews and ratings',
        'notification-service': 'Real-time notifications',
        'report-service': 'Analytics and reporting',
        'payment-service': 'Payment processing'
      },
      endpoints: {
        health: 'GET /health',
        documentation: 'GET /api-docs',
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        hotels: 'GET /api/hotels',
        hotel_details: 'GET /api/hotels/:id'
      },
      features: [
        'JWT Authentication',
        'Role-based Access Control',
        'Advanced Hotel Search',
        'Real-time Availability',
        'Review & Rating System',
        'Real-time Notifications',
        'Payment Processing',
        'Analytics & Reporting'
      ],
      database_schema: {
        tables: ['users', 'hotels', 'rooms', 'reservations', 'reviews', 'notifications', 'payments', 'reports'],
        relationships: 'Fully normalized with foreign keys',
        indexes: 'Optimized for search and reporting'
      }
    }, null, 2));
    return;
  }

  // Mock login endpoint
  if (pathname === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        if (!email || !password) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Email and password required' }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Login successful',
          data: {
            user: { 
              id: '1', 
              email, 
              name: 'Demo User', 
              role: 'CUSTOMER' 
            },
            token: 'jwt-token-' + Date.now()
          }
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Mock hotels endpoint
  if (pathname === '/api/hotels' && method === 'GET') {
    const hotels = [
      { 
        id: '1', 
        name: 'Grand Hotel Madrid', 
        city: 'Madrid', 
        country: 'Spain', 
        rating: 4.5, 
        price: 150, 
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
        description: 'Luxury hotel in the heart of Madrid'
      },
      { 
        id: '2', 
        name: 'Barcelona Beach Resort', 
        city: 'Barcelona', 
        country: 'Spain', 
        rating: 4.2, 
        price: 120, 
        amenities: ['WiFi', 'Beach Access', 'Pool', 'Bar'],
        description: 'Beautiful beachfront resort'
      },
      { 
        id: '3', 
        name: 'Seville Historic Inn', 
        city: 'Seville', 
        country: 'Spain', 
        rating: 4.0, 
        price: 90, 
        amenities: ['WiFi', 'Restaurant', 'Garden'],
        description: 'Charming historic hotel'
      }
    ];
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      success: true, 
      data: hotels,
      total: hotels.length,
      message: 'Hotels retrieved successfully'
    }));
    return;
  }

  // Mock hotel details endpoint
  if (pathname.startsWith('/api/hotels/') && method === 'GET') {
    const hotelId = pathname.split('/')[3];
    const hotel = {
      id: hotelId,
      name: 'Grand Hotel Madrid',
      description: 'Luxury hotel in the heart of Madrid with excellent service and world-class amenities.',
      city: 'Madrid',
      country: 'Spain',
      address: '123 Gran Via, Madrid, Spain',
      rating: 4.5,
      reviewCount: 156,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Business Center', 'Concierge'],
      images: [
        'https://via.placeholder.com/400x300?text=Hotel+Exterior',
        'https://via.placeholder.com/400x300?text=Hotel+Lobby',
        'https://via.placeholder.com/400x300?text=Hotel+Room'
      ],
      rooms: [
        { id: '1', type: 'Standard Room', capacity: 2, price: 150, available: true, amenities: ['WiFi', 'TV', 'AC'] },
        { id: '2', type: 'Deluxe Suite', capacity: 4, price: 250, available: true, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
        { id: '3', type: 'Presidential Suite', capacity: 6, price: 500, available: true, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Jacuzzi'] }
      ]
    };
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      success: true, 
      data: hotel,
      message: 'Hotel details retrieved successfully'
    }));
    return;
  }

  // Default 404 response
  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'GET /api-docs',
      'POST /api/auth/login',
      'GET /api/hotels',
      'GET /api/hotels/:id'
    ],
    suggestion: 'Visit /api-docs for complete documentation'
  }));
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log('🌙 BreazeInTheMoon API Gateway running on port ' + port);
  console.log('📚 Documentation: http://localhost:' + port + '/api-docs');
  console.log('🏥 Health Check: http://localhost:' + port + '/health');
  console.log('🏨 Hotels API: http://localhost:' + port + '/api/hotels');
  console.log('✅ Ready for Angular frontend integration!');
  console.log('');
  console.log('🎯 Test Commands:');
  console.log('  curl http://localhost:' + port + '/health');
  console.log('  curl http://localhost:' + port + '/api/hotels');
  console.log('  curl -X POST http://localhost:' + port + '/api/auth/login -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"password"}\'');
});