import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [myCars, setMyCars] = useState([]); // Only for companies
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests');
    const user = JSON.parse(localStorage.getItem('user'));
    const isCompany = user?.companyName !== undefined;

    useEffect(() => {
        if (isCompany) {
            fetchCompanyData();
        } else {
            fetchUserData();
        }
    }, [isCompany]);

    const fetchCompanyData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, carsRes] = await Promise.all([
                API.get('/bookings/company'),
                API.get('/cars')
            ]);
            setBookings(bookingsRes.data);
            const companyCars = carsRes.data.filter(car =>
                car.companyId._id === user._id || car.companyId === user._id
            );
            setMyCars(companyCars);
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/bookings/my');
            setBookings(data);
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/bookings/${id}/status`, { status });
            fetchCompanyData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Gathering your data...</p>
        </div>
    );

    if (!isCompany) {
        return (
            <div className="dashboard animate-fade">
                <header className="dash-header">
                    <div className="user-welcome">
                        <h1>Hello, {user?.name} 👋</h1>
                        <p>Track your car bookings and explore new rides.</p>
                    </div>
                </header>

                <section className="dashboard-content">
                    <h2>My Bookings</h2>
                    <div className="booking-list">
                        {bookings.length === 0 ? (
                            <div className="glass empty-state-box">
                                <div className="empty-icon shadow-glow">📊</div>
                                <h3>No Bookings Yet</h3>
                                <p>You haven't made any booking requests. Browse cars to get started!</p>
                                <Link to="/" className="btn btn-primary">Browse Cars</Link>
                            </div>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking._id} className="booking-card glass slide-in">
                                    <div className="booking-main">
                                        <div className="car-preview">
                                            <img src={booking.carId.images?.[0]} alt="" />
                                        </div>
                                        <div className="booking-details">
                                            <div className="title-row">
                                                <h3>{booking.carId.carName}</h3>
                                                <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                            </div>
                                            <div className="info-row">
                                                <p><span>Brand:</span> {booking.carId.brand}</p>
                                                <p><span>Price:</span> ${booking.carId.pricePerDay}/day</p>
                                                <p><span>Period:</span> {new Date(booking.fromDate).toLocaleDateString()} — {new Date(booking.toDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        );
    }

    // Company view
    const stats = {
        total: myCars.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length
    };

    return (
        <div className="dashboard animate-fade">
            <header className="dash-header">
                <div className="header-text">
                    <h1>{user?.companyName} Dashboard</h1>
                    <p>Overview of your listings and customer interactions.</p>
                </div>
                <Link to="/add-car" className="btn btn-primary add-car-main">
                    <span>➕</span> Add New Car
                </Link>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon car-bg">🚗</div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total Cars</p>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon pending-bg">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pending}</h3>
                        <p>Pending Requests</p>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon approved-bg">✅</div>
                    <div className="stat-info">
                        <h3>{stats.approved}</h3>
                        <p>Approved Bookings</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={activeTab === 'requests' ? 'active' : ''}
                    onClick={() => setActiveTab('requests')}
                >
                    Booking Requests
                    {stats.pending > 0 && <span className="notif-badge">{stats.pending}</span>}
                </button>
                <button
                    className={activeTab === 'cars' ? 'active' : ''}
                    onClick={() => setActiveTab('cars')}
                >
                    My Fleet
                </button>
            </div>

            <section className="dashboard-content">
                {activeTab === 'requests' ? (
                    <div className="booking-list">
                        {bookings.length === 0 ? (
                            <div className="glass empty-state-box">
                                <div className="empty-icon">📂</div>
                                <h3>No Requests Yet</h3>
                                <p>When users book your cars, they will appear here for your approval.</p>
                            </div>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking._id} className="booking-card glass slide-in">
                                    <div className="booking-main">
                                        <div className="car-preview">
                                            <img src={booking.carId.images?.[0]} alt="" />
                                        </div>
                                        <div className="booking-details">
                                            <div className="title-row">
                                                <h3>{booking.carId.carName}</h3>
                                                <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                            </div>
                                            <div className="info-row">
                                                <p><span>Customer:</span> {booking.userId.name}</p>
                                                <p><span>Period:</span> {new Date(booking.fromDate).toLocaleDateString()} — {new Date(booking.toDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {booking.status === 'pending' && (
                                        <div className="booking-actions">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleStatusUpdate(booking._id, 'approved')}
                                            >Approve</button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                            >Reject</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="car-list-grid">
                        {myCars.length === 0 ? (
                            <div className="glass empty-state-box full-width">
                                <div className="empty-icon">🏎️</div>
                                <h3>Your Fleet is Empty</h3>
                                <p>Start listing your cars to reach thousands of potential customers.</p>
                                <Link to="/add-car" className="btn btn-primary">List Your First Car</Link>
                            </div>
                        ) : (
                            myCars.map((car) => (
                                <div key={car._id} className="mini-car-card glass">
                                    <div className="mini-car-img">
                                        <img src={car.images[0]} alt="" />
                                        <span className={`avail-tag ${car.available ? 'online' : 'offline'}`}>
                                            {car.available ? 'Available' : 'Booked'}
                                        </span>
                                    </div>
                                    <div className="mini-car-info">
                                        <h4>{car.carName}</h4>
                                        <p>{car.brand} • ${car.pricePerDay}/day</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
