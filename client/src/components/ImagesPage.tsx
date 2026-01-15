import React, { useEffect, useState } from 'react';

interface Booking {
    id: number;
    name: string;
    image?: string;
    date: string;
    time: string;
}

const ImagesPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();
                // Filter bookings that have images
                const bookingsWithImages = data.filter((b: Booking) => b.image);
                setBookings(bookingsWithImages);
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <div className="text-center text-white">Loading...</div>;

    if (bookings.length === 0) {
        return (
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', color: 'white', textAlign: 'center' }}>
                <h1>Booking Images</h1>
                <p>No images found in bookings.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
            <h1>Booking Images</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {bookings.map(booking => (
                    <div key={booking.id} style={{ border: '1px solid #444', borderRadius: '8px', padding: '10px', background: '#222' }}>
                        <img 
                            src={booking.image} 
                            alt={`Booking by ${booking.name}`} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <div style={{ marginTop: '10px', color: '#eee' }}>
                            <div style={{ fontWeight: 'bold' }}>{booking.name}</div>
                            <div style={{ fontSize: '0.9em', color: '#aaa' }}>{booking.date} at {booking.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImagesPage;
