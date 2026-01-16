# Bun Booking App

A modern, full-stack booking and appointment management application built with [Bun](https://bun.sh), React, and SQLite.

## Features

- **Appointment Booking**: Users can schedule appointments with name, email, date, time, and reason.
- **Image Uploads**: Support for attaching images to bookings.
- **Booking Management**: View, update, and delete existing bookings.
- **Image Gallery**: Dedicated view to browse all uploaded images.
- **Responsive Design**: Built with React and modern CSS for a smooth user experience.

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh) (Fast all-in-one JavaScript runtime)
- **Server**: Native Bun HTTP Server
- **Database**: `bun:sqlite` (Built-in high-performance SQLite driver)

### Frontend
- **Framework**: [React](https://react.dev)
- **Build Tool**: [Vite](https://vitejs.dev)
- **Language**: TypeScript
- **Routing**: React Router
- **Date Handling**: `date-fns` & `react-date-picker`
- **Icons**: Lucide React

## Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or later)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)

## Getting Started

### Local Development

1. **Initialize the project**  
   This will install dependencies for both server and client, and build the frontend.
   ```bash
   make init
   ```

2. **Initialize the database**  
   Creates a new `bookings.sqlite` file with the required schema.
   ```bash
   make createdb
   ```

3. **Start the server**  
   Runs the backend server on `http://localhost:8080`.
   ```bash
   make start
   ```
   The application will be available at [http://localhost:8080](http://localhost:8080).

### Docker Deployment

To build and run the application as a Docker container:

1. **Build the image**
   ```bash
   make build
   ```

2. **Run the container**
   ```bash
   make run
   ```
   Access the app at `http://localhost:8080`.

3. **Stop the container**
   ```bash
   make stop
   ```

## Project Structure

```
├── client/                 # React Frontend application
│   ├── src/                # Source code
│   │   ├── components/     # React components (Forms, Lists, Pages)
│   │   └── App.tsx         # Main application component
│   ├── vite.config.ts      # Vite configuration
│   └── package.json        # Frontend dependencies
├── index.ts                # Backend server entry point (API & Static serving)
├── db.ts                   # Database connection and schema setup
├── Makefile                # Automation commands (build, run, test)
├── Dockerfile              # Container definition
├── bookings.sqlite         # SQLite database (generated)
└── package.json            # Root configuration and backend dependencies
```

## API Endpoints

The backend provides a RESTful API for managing bookings:

- `GET /api/bookings`: Retrieve all bookings.
- `POST /api/bookings`: Create a new booking.
- `PUT /api/bookings`: Update an existing booking.
- `DELETE /api/bookings?id=<id>`: Delete a booking.

## Development

- **Run Tests**: `make test` (Runs Bun's native test runner)
- **Clean Build Artifacts**: `make clean` or `make prune` (removes node_modules)

## License

This project is open source.
