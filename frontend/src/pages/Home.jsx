import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Home.css';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const { data } = await API.get('/cars');
                setCars(data);
            } catch (err) {
                console.error('Error fetching cars:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) return <div className="loading">Loading amazing cars...</div>;

    return (
        <div className="home-page">
            <header className="hero">
                <h1>Find Your Perfect Ride</h1>
                <p>Browse from a wide range of premium cars listed by top rental companies.</p>
            </header>

            <div className="car-grid">
                {cars.map((car) => (
                    <div key={car._id} className="car-card glass">
                        <div className="car-image">
                            <img src={car.images[0]} alt={car.carName} />
                            <span className="price-tag">${car.pricePerDay}<span>/day</span></span>
                        </div>
                        <div className="car-info">
                            <h3>{car.carName}</h3>
                            <p className="car-type">{car.brand} • {car.type}</p>
                            <div className="company-info">
                                <small>Listed by</small>
                                <span>{car.companyId?.companyName}</span>
                            </div>
                            <Link to={`/car/${car._id}`} className="btn btn-primary view-btn">View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
