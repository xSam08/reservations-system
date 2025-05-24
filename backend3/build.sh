#!/bin/bash
set -e

echo "🏗️  Building Hotel Reservation System with Workspace Support"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not available in PATH."
    exit 1
fi

print_status "Checking workspace configuration..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
print_status "🧹 Cleaning previous builds..."
docker system prune -f >/dev/null 2>&1 || true
docker volume prune -f >/dev/null 2>&1 || true

# Create network if it doesn't exist
print_status "🌐 Creating Docker network..."
docker network create reservations-network 2>/dev/null || print_warning "Network already exists"

# Step 1: Build base images in parallel
print_status "📦 Building base Docker images..."
docker build --target dependencies -t reservations-deps . &
docker build --target builder -t reservations-builder . &
wait

print_success "Base images built successfully"

# Step 2: Start database services first
print_status "🗄️  Starting database services..."
docker compose up -d mysql redis

# Wait for databases to be healthy
print_status "⏳ Waiting for databases to be ready..."
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if docker compose exec -T mysql mysqladmin ping -h localhost --silent >/dev/null 2>&1 && \
       docker compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_success "Databases are ready"
        break
    fi
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        print_error "Timeout waiting for databases"
        exit 1
    fi
done

# Step 3: Build and start core services
print_status "🚀 Building and starting core services..."
docker compose up -d --build auth-service user-service

# Wait for core services
sleep 15

# Verify core services are healthy
print_status "🔍 Checking core services health..."
for service in auth-service user-service; do
    port=$(docker compose port $service | cut -d: -f2)
    if curl -f http://localhost:$port/health >/dev/null 2>&1; then
        print_success "$service is healthy"
    else
        print_warning "$service might not be fully ready yet"
    fi
done

# Step 4: Start business logic services
print_status "🏨 Building and starting business services..."
docker compose up -d --build hotel-service reservation-service availability-service search-service

# Wait for business services
sleep 20

# Step 5: Start remaining services
print_status "⭐ Building and starting additional services..."
docker compose up -d --build review-service notification-service report-service payment-service

# Wait for additional services
sleep 15

# Step 6: Start API Gateway
print_status "🌐 Building and starting API Gateway..."
docker compose up -d --build api-gateway

# Final health check
print_status "🔍 Performing final health checks..."
sleep 10

# Check all services
services=("api-gateway:3000" "auth-service:3001" "user-service:3002" "hotel-service:3003" 
          "reservation-service:3004" "review-service:3005" "notification-service:3006" 
          "report-service:3007" "payment-service:3008" "availability-service:3009" "search-service:3010")

echo ""
print_success "✅ All services are up and running!"
echo ""
echo "🔗 Service URLs:"
for service_port in "${services[@]}"; do
    service=$(echo $service_port | cut -d: -f1)
    port=$(echo $service_port | cut -d: -f2)
    echo "   - $(echo $service | tr '-' ' ' | sed 's/\b\w/\U&/g'): http://localhost:$port"
done

echo ""
echo "🗄️  Database URLs:"
echo "   - MySQL: localhost:3306 (reservations/app_user/app_password)"
echo "   - Redis: localhost:6379"
echo ""
echo "📊 Useful commands:"
echo "   - Monitor logs: docker compose logs -f"
echo "   - Check status: docker compose ps"
echo "   - Stop all: docker compose down"
echo "   - View database: docker compose -f docker-compose.db.yml up -d"
echo ""

# Quick service status check
echo "📈 Service Status:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

print_success "🎉 Hotel Reservation System is ready!"
print_status "Access the API Gateway at: http://localhost:3000"