import React, { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

interface Booking {
    id: number;
    name: string;
    email: string;
    date: string;
    time: string;
    reason: string;
}

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
            fetchBookings();
        } catch (error) {
            alert('Error deleting booking');
        }
    };

    const handleEditClick = (booking: Booking) => {
        setEditingBooking(booking);
        setIsModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBooking) return;

        try {
            const res = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBooking)
            });
            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                fetchBookings();
            } else {
                alert('Update failed: ' + result.error);
            }
        } catch (error) {
            alert('Error updating booking');
        }
    };

    if (loading) return <div className="text-center text-white">Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
            <h1>Confirmed Bookings</h1>

            <div id="bookings-list">
                {bookings.length === 0 ? (
                    <div className="no-bookings">No bookings found yet.</div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="card-header">
                                <span className="name">{booking.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="date-time">{booking.date} at {booking.time}</span>
                                    <button onClick={() => handleEditClick(booking)} className="edit-btn" title="Edit booking">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(booking.id)} className="delete-btn" title="Delete booking">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="detail-row">
                                <span className="label">Email:</span>
                                <span>{booking.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Reason:</span>
                                <span>{booking.reason}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && editingBooking && (
                <div className="modal-overlay" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <div className="modal">
                        <div className="modal-title">Edit Booking</div>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={editingBooking.name} onChange={e => setEditingBooking({ ...editingBooking, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={editingBooking.email} onChange={e => setEditingBooking({ ...editingBooking, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <DatePicker
                                    onChange={(val: any) => setEditingBooking({ ...editingBooking, date: val ? val.toISOString().split('T')[0] : '' })}
                                    value={editingBooking.date ? new Date(editingBooking.date) : null}
                                    className="custom-date-picker"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input type="time" value={editingBooking.time} onChange={e => setEditingBooking({ ...editingBooking, time: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Reason</label>
                                <textarea rows={3} value={editingBooking.reason} onChange={e => setEditingBooking({ ...editingBooking, reason: e.target.value })} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
