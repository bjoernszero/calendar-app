import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';

function App() {
  return (
    <Router>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Book Appointment</Link>
        <Link to="/list" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>View Bookings</Link>
      </div>
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="/list" element={<BookingList />} />
      </Routes>
    </Router>
  );
}

export default App;
