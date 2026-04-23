#!/bin/bash

# Mars Ticket Booking API - Testing Script
# Run this script to test all API endpoints

BASE_URL="http://localhost:3000"
echo "🚀 Testing Mars Ticket Booking API"
echo "=================================="

# Test 1: Health Check
echo ""
echo "1. Testing Health Check..."
curl -s -X GET "$BASE_URL" | jq . 2>/dev/null || curl -s -X GET "$BASE_URL"

# Test 2: Create Mars Booking
echo ""
echo "2. Creating Mars Ticket Booking..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_001",
    "destination": "Mars",
    "departureDate": "2026-04-24T00:00:00.000Z",
    "passengerName": "Test Astronaut",
    "seatNumber": "A1"
  }' | jq . 2>/dev/null || echo "Response received (jq not available)"

# Test 3: Create VIP Booking with Return
echo ""
echo "3. Creating VIP Round-Trip Booking..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "vip_user_001",
    "destination": "Mars",
    "departureDate": "2026-05-15T14:30:00.000Z",
    "returnDate": "2026-06-15T10:00:00.000Z",
    "passengerName": "VIP Passenger",
    "seatNumber": "VIP-001"
  }' | jq . 2>/dev/null || echo "Response received (jq not available)"

# Test 4: Invalid Date (Past)
echo ""
echo "4. Testing Invalid Date (Past)..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "invalid_user",
    "destination": "Mars",
    "departureDate": "2020-01-01T00:00:00.000Z",
    "passengerName": "Invalid Date User",
    "seatNumber": "X1"
  }' | jq . 2>/dev/null || echo "Error response received"

# Test 5: Missing Required Fields
echo ""
echo "5. Testing Missing Required Fields..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Mars"
  }' | jq . 2>/dev/null || echo "Validation error received"

# Test 6: Moon Destination
echo ""
echo "6. Creating Moon Ticket..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "moon_user",
    "destination": "Moon",
    "departureDate": "2026-07-20T08:00:00.000Z",
    "passengerName": "Lunar Explorer",
    "seatNumber": "LUNA-1"
  }' | jq . 2>/dev/null || echo "Response received (jq not available)"

echo ""
echo "🎉 Testing Complete!"
echo "==================="
echo "Check the responses above for success/error messages."
echo "All bookings are stored in your MongoDB Atlas database."</content>
<parameter name="filePath">c:\Users\harji\OneDrive\Desktop\Open Source\Finale Group Project\mars_ticket_booking\test_api.sh