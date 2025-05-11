#!/bin/bash

# Start the auth service
echo "Starting auth-service..."
docker-compose up -d auth-service

# Wait for the service to start
echo "Waiting for auth-service to start..."
sleep 10

# Test the login endpoint
echo "Testing login endpoint..."
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "password123"}'

# Test the register endpoint
echo "Testing register endpoint..."
curl -X POST http://localhost:3001/auth/register -H "Content-Type: application/json" -d '{"email": "new_user@example.com", "password": "password123", "name": "New User", "role": "CUSTOMER"}'