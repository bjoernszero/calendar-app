import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

const BookingForm: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState<any>(new Date());
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [image, setImage] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Format date to YYYY-MM-DD
        const formattedDate = date ? date.toISOString().split('T')[0] : '';

        const booking = { name, email, date: formattedDate, time, reason, image };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });

            const result = await response.json();
            if (result.success) {
                alert('Booking confirmed!');
                navigate('/list');
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
            <h1>Book Appointment</h1>
            <p className="subtitle">Schedule a time with us</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />
                </div>

                <div className="row" style={{ display: 'flex', gap: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Date</label>
                        <DatePicker onChange={setDate} value={date} className="custom-date-picker" required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Time</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Reason for Visit</label>
                    <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} required placeholder="Reason..." />
                </div>

                <div className="form-group">
                    <label>Upload Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                    />
                    {image && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={image} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>

                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
};

export default BookingForm;
