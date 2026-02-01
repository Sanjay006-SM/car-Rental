import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './CarDetails.css';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({ fromDate: '', toDate: '' });
    const [bookingStatus, setBookingStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const { data } = await API.get(`/cars/${id}`);
                setCar(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await API.post('/bookings', { carId: id, ...bookingData });
            setBookingStatus({ type: 'success', msg: 'Booking request sent successfully!' });
        } catch (err) {
            setBookingStatus({ type: 'error', msg: err.response?.data?.message || 'Booking failed.' });
        }
    };

    if (loading) return <div className="loading">Loading car details...</div>;
    if (!car) return <div className="loading">Car not found.</div>;

    return (
        <div className="car-details">
            <div className="details-grid">
                <div className="image-gallery">
                    <img src={car.images[0]} alt={car.carName} className="main-image glass" />
                    <div className="thumbnail-grid">
                        {car.images.map((img, i) => (
                            <img key={i} src={img} alt="thumbnail" className="glass" />
                        ))}
                    </div>
                </div>

                <div className="content-section">
                    <div className="car-header">
                        <h1>{car.carName}</h1>
                        <p className="brand">{car.brand} • {car.type}</p>
                    </div>

                    <div className="price-info glass">
                        <span className="amount">${car.pricePerDay}</span>
                        <span className="unit">per day</span>
                    </div>

                    <div className="company-card glass">
                        <small>Listed by</small>
                        <h3>{car.companyId.companyName}</h3>
                        <p>{car.companyId.address}</p>
                        <p>{car.companyId.phone}</p>
                    </div>

                    <form className="booking-form glass" onSubmit={handleBooking}>
                        <h3>Book This Car</h3>
                        {bookingStatus.msg && (
                            <div className={`status-msg ${bookingStatus.type}`}>
                                {bookingStatus.msg}
                            </div>
                        )}
                        <div className="input-group">
                            <label>From Date</label>
                            <input
                                type="date"
                                required
                                value={bookingData.fromDate}
                                onChange={(e) => setBookingData({ ...bookingData, fromDate: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>To Date</label>
                            <input
                                type="date"
                                required
                                value={bookingData.toDate}
                                onChange={(e) => setBookingData({ ...bookingData, toDate: e.target.value })}
                            />
                        </div>
                        <button className="btn btn-primary book-btn">Send Booking Request</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
