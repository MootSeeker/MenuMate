# MenuMate

A self-hosted health and fitness Progressive Web App (PWA) designed for smart tracking of BMI, weight, and calories. Instead of manually entering calorie numbers, select specific foods, products, and menus for automatic calculations.

## Features

- **BMI Monitoring**: Track your Body Mass Index over time
- **Smart Calorie Tracking**: Search and select foods/products instead of manual input
- **Product Database**: Integration with OpenFoodFacts API for nutritional data
- **Mobile-First**: Optimized for iOS (Add to Home Screen)
- **Progress Visualization**: Charts and statistics for motivation

## Tech Stack

- **Frontend**: React (Vite) + PWA features
- **Backend**: Node.js + Express
- **Database**: MongoDB (Docker on Home Server)
- **Hosting**: Self-hosted on Home Server (24/7 accessible)

## Quick Start

### Prerequisites
- Node.js (v18+)
- Docker (for MongoDB)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/menumate.git
   cd menumate
   ```

2. **Backend Setup**
   ```bash
   cd menumate-backend
   npm install
   # Set up environment variables in .env
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../menumate-frontend
   npm install
   npm run dev
   ```

4. **Database**
   - Run MongoDB via Docker: `docker run -d -p 27017:27017 mongo`

## Development

See [ENTWICKLUNGSPLAN.md](Docs/ENTWICKLUNGSPLAN.md) for the detailed development roadmap.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a PR