# CityMove App - Codebase Exploration Report

## Overview
CityMove is a React-based multimodal transportation trip planner application built with TypeScript, using Supabase for backend services and Google Maps API for routing and navigation.

---

## 1. TRIP PLANNER ROUTE IMPLEMENTATION

### Route Definition
File: `src/App.tsx` (lines 34-41)

The /trip-planner route is protected by PrivateRoute component and renders the TripPlanner component.

### Main Component
File: `src/components/TripPlanner.tsx` (454 lines)

#### Component Structure:
- **Search Form**: Origin/destination location input with autocomplete
- **Departure Time Selection**: Now or custom time options  
- **Filter Panel**: Accessibility, fastest, cheapest, eco-friendly, max walking distance
- **Route Results Display**: Shows multiple route options with details
- **Route Start**: Initiates active trip navigation

#### Search Flow:
1. User selects origin and destination using LocationAutocomplete
2. Clicks "Buscar rutas" button
3. Calls getDirections(selectedOrigin, selectedDestination)
4. Applies filters to results
5. Sorts by preferences (fastest, cheapest, eco-friendly)
6. Displays route options

---

## 2. DISTANCE CALCULATION

### Distance Calculation Methods

#### A. Haversine Formula
File: `src/services/mapsService.ts` (lines 511-527)

Uses the great circle distance formula to calculate distance between two coordinates.
Input: Two geographic points with latitude/longitude
Output: Distance in meters
Earth radius constant: 6371000 meters

#### B. Google Maps Distance API
When API is configured, uses DirectionsService with TRANSIT mode.
Requests alternative routes and extracts step distances from results.

#### C. Mock Distance Estimation  
When API is unavailable (lines 303-508):
- Calculates distance via Haversine
- Estimates time at 20 km/h for transit
- Estimates walking at 5 km/h
- Distributes distance across multiple segments

### Distance Display Format
- Total Distance: "{distanceKm.toFixed(1)} km" (e.g., "2.5 km")
- Walking Distance: Tracked separately with percentage
- Step Distance: Individual distance for each step (e.g., "400 m")

---

## 3. ROUTE INFORMATION STRUCTURE

### TripRoute Interface
File: `src/services/mapsService.ts` (lines 23-41)

Contains:
- id: Unique route identifier
- duration/durationMinutes: Total trip time
- distance/distanceMeters: Total distance
- walking/walkingMeters: Walking portion
- cost/costValue: Estimated fare
- co2/co2Value: CO2 saved vs car
- steps: Array of RouteStep
- rating: Quality rating
- accessibility: Wheelchair accessible flag
- recommended: Whether this route is recommended

### RouteStep Interface  
File: `src/services/mapsService.ts` (lines 5-21)

Each step contains:
- type: Transport mode (walk, bus, metro, train, bike, transit)
- instruction: User-friendly direction text
- distance/distanceMeters: Step distance
- duration/durationMinutes: Step duration
- startLocation/endLocation: Coordinates
- transitDetails: Line info for transit steps

### Transport Modes
- walk: Walking between locations
- bus: Public bus service
- metro: Subway/Metro system
- train: Train service
- bike: Bicycle
- transit: Generic transit (fallback)

---

## 4. COST & CO2 CALCULATIONS

### Cost Calculation
File: `src/services/mapsService.ts` (lines 69-83)

Base fare: 300 colones
Per km cost: 50 colones per kilometer
Conversion: Divide by 500 to get USD

Walking/biking: Free ($0.00)

### CO2 Saved Calculation
File: `src/services/mapsService.ts` (lines 85-97)

Car CO2: 0.12 kg per km
Transit CO2: 0.04 kg per km
Walking/biking: All car emissions saved

Calculation: (car_rate - transit_rate) * distance_km

---

## 5. UI COMPONENTS FOR ROUTE DETAILS

### A. Trip Planner Component
File: `src/components/TripPlanner.tsx`

Route Display Card:
- Header with duration, cost, CO2, rating
- Transport mode flow visualization
- Detailed step-by-step instructions
- Start trip button

### B. Active Trip Component
File: `src/components/ActiveTrip.tsx`

Route Visualization:
- Timeline of journey with origin/destination
- Visual indicators for step status (completed, active, pending)
- Progress bar with percentage
- Current step details with transit info
- Trip summary with 4-card layout

Progress Tracking:
- Real-time timer with countdown
- Auto-advancing steps based on elapsed time
- Manual step navigation
- Completion handler for saving to database

### C. Navigation Map Component
File: `src/components/NavigationMap.tsx`

Features:
- Mock map display with route path
- Current location indicator
- Navigation instructions
- Map controls (locate, compass, rotate)
- Map type toggle (map/satellite)
- Compass indicator
- Street name display

### D. Trip History Component
File: `src/components/TripHistory.tsx`

Features:
- Trip list with origin/destination
- Status badge (completed, cancelled, etc)
- Transport modes used (with icons)
- Trip duration, distance, cost, CO2, rating
- Search and filter functionality

---

## 6. DATA FLOW & ARCHITECTURE

Trip Creation Flow:
1. User selects origin/destination in TripPlanner
2. System calls getDirections() 
3. Routes returned with estimated metrics
4. User selects preferred route
5. Navigation to /active-trip with trip data
6. Trip execution tracked in ActiveTrip component
7. On completion: Save to Supabase via tripService

Key Services:
- mapsService: Routing, distance, cost calculations
- tripService: CRUD operations, trip statistics
- AuthContext: User authentication

---

## 7. DATABASE SCHEMA

Trip Table Fields:
- id: UUID
- user_id: Reference to user
- origin: Starting location
- destination: Ending location
- status: planned | active | completed | cancelled
- duration_minutes: Trip duration
- distance_km: Total distance
- cost: Fare amount (USD)
- co2_saved: Environmental impact (kg)
- rating: User rating 1-5
- route_data: JSON with steps and modes
- start_time/end_time: ISO timestamps

---

## 8. KEY FILES SUMMARY

| File | Purpose | Key Functions |
|------|---------|---|
| src/components/TripPlanner.tsx | Trip planning UI | handleSearch, filtering, sorting |
| src/services/mapsService.ts | Routing & distance | getDirections, calculateDistance, calculateCost |
| src/components/ActiveTrip.tsx | Trip execution | Timer, step progression, completion |
| src/services/tripService.ts | Trip data ops | CRUD, getUserTrips, getUserStats |
| src/components/TripHistory.tsx | Trip history | Filtering, searching, display |
| src/components/NavigationMap.tsx | Map visualization | Map display, navigation |
| src/data/locations.ts | Location data | 30+ Costa Rican locations |

---

## 9. CONFIGURATION & API

Google Maps API Setup:
- Uses Loader from @googlemaps/js-api-loader
- Libraries: places, geometry, directions
- API key from environment variable VITE_GOOGLE_MAPS_API_KEY

Location Data:
- 30+ predefined Costa Rican locations
- Categories: landmark, transport, commercial, residential, educational, medical
- All with latitude/longitude coordinates

---

## Summary

The CityMove system provides:
1. Route calculation via Google Maps API or mock data
2. Distance calculation via Haversine formula or API
3. Cost estimation based on distance
4. CO2 savings calculation vs car travel
5. Multi-mode route display (walk, bus, metro, train)
6. Real-time trip tracking with progress
7. Trip history in Supabase
8. Filtering for accessibility, speed, cost, environment

