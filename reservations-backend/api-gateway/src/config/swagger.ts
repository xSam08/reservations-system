import { config } from './index';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Hotel Reservation System API',
    version: '1.0.0',
    description: 'Comprehensive API for hotel reservation management system with microservices architecture',
    contact: {
      name: 'API Support',
      email: 'support@hotelreservation.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Development server'
    },
    {
      url: 'https://api.hotelreservation.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /api/auth/login'
      }
    },
    schemas: {
      // User schemas
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['GUEST', 'ADMIN', 'MANAGER'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateUserDto: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 2 },
          role: { type: 'string', enum: ['GUEST', 'ADMIN', 'MANAGER'], default: 'GUEST' }
        }
      },
      LoginDto: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      // Hotel schemas
      Hotel: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          address: { $ref: '#/components/schemas/Address' },
          rating: { type: 'number', minimum: 0, maximum: 5 },
          amenities: { type: 'array', items: { type: 'string' } },
          photos: { type: 'array', items: { type: 'string', format: 'uri' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          zipCode: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' }
        }
      },
      Room: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          hotelId: { type: 'string', format: 'uuid' },
          type: { type: 'string' },
          capacity: { type: 'integer', minimum: 1 },
          price: { type: 'number', minimum: 0 },
          amenities: { type: 'array', items: { type: 'string' } },
          images: { type: 'array', items: { type: 'string', format: 'uri' } },
          available: { type: 'boolean' }
        }
      },
      // Search schemas
      SearchQuery: {
        type: 'object',
        required: ['checkIn', 'checkOut', 'guests'],
        properties: {
          checkIn: { type: 'string', format: 'date' },
          checkOut: { type: 'string', format: 'date' },
          guests: { type: 'integer', minimum: 1 },
          city: { type: 'string' },
          country: { type: 'string' },
          minPrice: { type: 'number', minimum: 0 },
          maxPrice: { type: 'number', minimum: 0 },
          amenities: { type: 'array', items: { type: 'string' } },
          rating: { type: 'number', minimum: 0, maximum: 5 }
        }
      },
      // Reservation schemas
      Reservation: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          hotelId: { type: 'string', format: 'uuid' },
          roomId: { type: 'string', format: 'uuid' },
          checkIn: { type: 'string', format: 'date' },
          checkOut: { type: 'string', format: 'date' },
          guests: { type: 'integer', minimum: 1 },
          totalPrice: { type: 'number', minimum: 0 },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateReservationDto: {
        type: 'object',
        required: ['hotelId', 'roomId', 'checkIn', 'checkOut', 'guests'],
        properties: {
          hotelId: { type: 'string', format: 'uuid' },
          roomId: { type: 'string', format: 'uuid' },
          checkIn: { type: 'string', format: 'date' },
          checkOut: { type: 'string', format: 'date' },
          guests: { type: 'integer', minimum: 1 }
        }
      },
      // Common schemas
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          message: { type: 'string' },
          error: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Returns the health status of the API Gateway',
        security: [],
        responses: {
          '200': {
            description: 'API Gateway is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserDto' }
            }
          }
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid input data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '409': {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginDto' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'User logout',
        requestBody: {
          required: false
        },
        responses: {
          '200': {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh JWT token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' }
                },
                required: ['refreshToken']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' }
                      }
                    },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Invalid refresh token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' }
                },
                required: ['email']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password reset email sent',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password with token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  newPassword: { type: 'string', minLength: 6 }
                },
                required: ['token', 'newPassword']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '401': {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/validate-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Validate JWT token',
        responses: {
          '200': {
            description: 'Token is valid',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Invalid token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get user profile',
        responses: {
          '200': {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'User retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Update user by ID (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phoneNumber: { type: 'string' },
                  role: { type: 'string', enum: ['CUSTOMER', 'HOTEL_ADMIN', 'SYSTEM_ADMIN'] }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user by ID (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}/reservations': {
      get: {
        tags: ['Users'],
        summary: 'Get user reservations',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'User reservations retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/hotel-owners': {
      get: {
        tags: ['Users'],
        summary: 'Get all hotel owners (admin only)',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Hotel owners retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/customers': {
      get: {
        tags: ['Users'],
        summary: 'Get all customers (admin only)',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Customers retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}/status': {
      put: {
        tags: ['Users'],
        summary: 'Update user status (admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['active', 'inactive', 'suspended'] }
                },
                required: ['status']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User status updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/hotels': {
      get: {
        tags: ['Hotels'],
        summary: 'Get all hotels',
        security: [],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          },
          {
            name: 'city',
            in: 'query',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Hotels retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    },
    '/api/hotels/{id}': {
      get: {
        tags: ['Hotels'],
        summary: 'Get hotel by ID',
        security: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'Hotel retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Hotel' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Hotel not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/hotels/{hotelId}/rooms': {
      get: {
        tags: ['Rooms'],
        summary: 'Get rooms for a specific hotel',
        security: [],
        parameters: [
          {
            name: 'hotelId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Hotel rooms retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Rooms'],
        summary: 'Create a new room for a hotel (Admin only)',
        parameters: [
          {
            name: 'hotelId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'capacity', 'basePrice'],
                properties: {
                  type: { type: 'string' },
                  capacity: { type: 'integer', minimum: 1 },
                  basePrice: { type: 'number', minimum: 0 },
                  amenities: { type: 'array', items: { type: 'string' } },
                  images: { type: 'array', items: { type: 'string', format: 'uri' } },
                  description: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Room created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Room' }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/rooms': {
      get: {
        tags: ['Rooms'],
        summary: 'Get all rooms with filters',
        security: [],
        parameters: [
          {
            name: 'hotelId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' }
          },
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'minPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 }
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 }
          },
          {
            name: 'capacity',
            in: 'query',
            schema: { type: 'integer', minimum: 1 }
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Rooms retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Rooms'],
        summary: 'Create a new room (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['hotelId', 'type', 'capacity', 'basePrice'],
                properties: {
                  hotelId: { type: 'string', format: 'uuid' },
                  type: { type: 'string' },
                  capacity: { type: 'integer', minimum: 1 },
                  basePrice: { type: 'number', minimum: 0 },
                  amenities: { type: 'array', items: { type: 'string' } },
                  images: { type: 'array', items: { type: 'string', format: 'uri' } },
                  description: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Room created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Room' }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/rooms/{id}': {
      get: {
        tags: ['Rooms'],
        summary: 'Get room by ID',
        security: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'Room retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Room' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Room not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Rooms'],
        summary: 'Update room by ID (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  capacity: { type: 'integer', minimum: 1 },
                  basePrice: { type: 'number', minimum: 0 },
                  amenities: { type: 'array', items: { type: 'string' } },
                  images: { type: 'array', items: { type: 'string', format: 'uri' } },
                  description: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Room updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Room' }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Rooms'],
        summary: 'Delete room by ID (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'Room deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/rooms/types': {
      get: {
        tags: ['Rooms'],
        summary: 'Get all available room types',
        security: [],
        responses: {
          '200': {
            description: 'Room types retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              type: { type: 'string' },
                              description: { type: 'string' },
                              count: { type: 'integer' }
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/rooms/{id}/availability': {
      get: {
        tags: ['Rooms'],
        summary: 'Get room availability for date range',
        security: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          },
          {
            name: 'checkIn',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          },
          {
            name: 'checkOut',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          }
        ],
        responses: {
          '200': {
            description: 'Room availability retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            roomId: { type: 'string' },
                            isAvailable: { type: 'boolean' },
                            status: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE'] },
                            availabilityPeriods: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  date: { type: 'string', format: 'date' },
                                  available: { type: 'boolean' },
                                  price: { type: 'number' }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Rooms'],
        summary: 'Update room availability (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isAvailable'],
                properties: {
                  isAvailable: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Room availability updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/hotels/{hotelId}/rooms/available': {
      get: {
        tags: ['Rooms'],
        summary: 'Get available rooms for specific dates in a hotel',
        security: [],
        parameters: [
          {
            name: 'hotelId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          },
          {
            name: 'checkIn',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' }
          },
          {
            name: 'checkOut',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' }
          }
        ],
        responses: {
          '200': {
            description: 'Available rooms retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Room' }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/rooms/search': {
      get: {
        tags: ['Rooms'],
        summary: 'Search available rooms across all hotels',
        security: [],
        parameters: [
          {
            name: 'city',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'country',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'checkIn',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          },
          {
            name: 'checkOut',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          },
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'minPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 }
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 }
          },
          {
            name: 'guests',
            in: 'query',
            schema: { type: 'integer', minimum: 1 }
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Room search results retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    },
    '/api/search': {
      post: {
        tags: ['Search'],
        summary: 'Search hotels and rooms',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SearchQuery' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    },
    '/api/search/hotels': {
      get: {
        tags: ['Search'],
        summary: 'Search hotels with filters',
        security: [],
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'country', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'rating', in: 'query', schema: { type: 'number', minimum: 0, maximum: 5 } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'Hotels search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Search'],
        summary: 'Advanced hotel search',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  checkIn: { type: 'string', format: 'date' },
                  checkOut: { type: 'string', format: 'date' },
                  guests: { type: 'integer', minimum: 1 },
                  city: { type: 'string' },
                  country: { type: 'string' },
                  minPrice: { type: 'number' },
                  maxPrice: { type: 'number' },
                  amenities: { type: 'array', items: { type: 'string' } },
                  rating: { type: 'number', minimum: 0, maximum: 5 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Advanced search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    },
    '/api/search/rooms': {
      get: {
        tags: ['Search'],
        summary: 'Search rooms in a hotel',
        security: [],
        parameters: [
          { name: 'hotelId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'checkIn', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'checkOut', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'guests', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'Room search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Search'],
        summary: 'Advanced room search',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  hotelId: { type: 'string' },
                  checkIn: { type: 'string', format: 'date' },
                  checkOut: { type: 'string', format: 'date' },
                  guests: { type: 'integer', minimum: 1 },
                  roomType: { type: 'string' },
                  minPrice: { type: 'number' },
                  maxPrice: { type: 'number' },
                  amenities: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Advanced room search results',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    },
    '/api/search/suggestions': {
      get: {
        tags: ['Search'],
        summary: 'Get search suggestions',
        security: [],
        parameters: [
          { name: 'query', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['hotels', 'cities', 'countries'] } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 5, maximum: 20 } }
        ],
        responses: {
          '200': {
            description: 'Search suggestions',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              type: { type: 'string' },
                              description: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/availability': {
      post: {
        tags: ['Availability'],
        summary: 'Create room availability',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roomId', 'date', 'availableRooms'],
                properties: {
                  roomId: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                  availableRooms: { type: 'integer', minimum: 0 },
                  status: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'], default: 'AVAILABLE' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Availability created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/availability/room/{roomId}': {
      get: {
        tags: ['Availability'],
        summary: 'Get room availability by date range',
        security: [],
        parameters: [
          { name: 'roomId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } }
        ],
        responses: {
          '200': {
            description: 'Room availability retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              availabilityId: { type: 'string' },
                              roomId: { type: 'string' },
                              date: { type: 'string', format: 'date' },
                              availableRooms: { type: 'integer' },
                              status: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'] }
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/availability/check': {
      post: {
        tags: ['Availability'],
        summary: 'Check availability for reservation',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roomId', 'checkInDate', 'checkOutDate', 'requiredRooms'],
                properties: {
                  roomId: { type: 'string' },
                  checkInDate: { type: 'string', format: 'date' },
                  checkOutDate: { type: 'string', format: 'date' },
                  requiredRooms: { type: 'integer', minimum: 1 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Availability check result',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            available: { type: 'boolean' },
                            roomId: { type: 'string' },
                            checkInDate: { type: 'string', format: 'date' },
                            checkOutDate: { type: 'string', format: 'date' },
                            requiredRooms: { type: 'integer' },
                            availableRooms: { type: 'integer' }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/reservations': {
      get: {
        tags: ['Reservations'],
        summary: 'Get user reservations',
        responses: {
          '200': {
            description: 'Reservations retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Reservations'],
        summary: 'Create a new reservation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateReservationDto' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Reservation created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Reservation' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Invalid reservation data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews',
        security: [],
        parameters: [
          { name: 'hotelId', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Reviews retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Reviews'],
        summary: 'Create a new review',
        responses: {
          '201': {
            description: 'Review created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        responses: {
          '200': {
            description: 'Notifications retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    },
    '/api/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Process payment',
        responses: {
          '201': {
            description: 'Payment processed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/reports': {
      post: {
        tags: ['Reports'],
        summary: 'Generate report',
        responses: {
          '201': {
            description: 'Report generated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'System',
      description: 'System health and monitoring endpoints'
    },
    {
      name: 'Authentication',
      description: 'User authentication and authorization'
    },
    {
      name: 'Users',
      description: 'User management operations'
    },
    {
      name: 'Hotels',
      description: 'Hotel and room management'
    },
    {
      name: 'Search',
      description: 'Hotel and room search functionality'
    },
    {
      name: 'Availability',
      description: 'Room availability management'
    },
    {
      name: 'Reservations',
      description: 'Reservation management'
    },
    {
      name: 'Reviews',
      description: 'Hotel and service reviews'
    },
    {
      name: 'Notifications',
      description: 'User notifications'
    },
    {
      name: 'Payments',
      description: 'Payment processing'
    },
    {
      name: 'Reports',
      description: 'Analytics and reporting'
    }
  ]
};