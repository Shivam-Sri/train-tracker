# Train Tracker

A high-quality React application to display live train locations based on train number and date inputs. The app features a modern, responsive UI built with TailwindCSS.

## Features

- **Real-time Train Tracking**: Get live updates on train locations, arrival times, and delays
- **Beautiful UI**: Modern and responsive design using TailwindCSS
- **Station Timeline**: Visual representation of the train's journey with station details
- **Delay Tracking**: Highlights stations with significant delays
- **Journey Progress**: Visual indicator of journey completion percentage
- **Offline Detection**: Notifies users when they're offline
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop

## Tech Stack

- React (with Vite)
- TailwindCSS
- React Router
- React Query
- Axios
- DayJS
- React DatePicker

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## API

The application uses the following API endpoint to fetch train status data:

```
https://miawz4m9pi.execute-api.us-east-1.amazonaws.com/dev/train-status?trainNumber=<trainNumber>&date=<date>
```

Where:
- `trainNumber`: The train number (e.g., 12050)
- `date`: The date in DD-MMM-YYYY format (e.g., 27-Apr-2025)

## Project Structure

```
src/
  components/
    TrainForm.jsx       # Form for train number and date inputs
    TrainStatus.jsx     # Displays train details and status
    StationTimeline.jsx # Timeline of stations with status
    Loader.jsx          # Loading indicator
    ErrorMessage.jsx    # Error message display
  pages/
    Home.jsx           # Home page with the train form
    Status.jsx         # Status page showing train details
  services/
    trainApi.js        # API service for fetching train data
  utils/
    dateFormatter.js   # Utilities for date/time formatting
  App.jsx             # Main application component with routing
  index.css           # Global styles with Tailwind directives
  main.jsx            # Application entry point
```

## Build for Production

To build the application for production, run:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed.
