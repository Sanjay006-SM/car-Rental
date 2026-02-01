import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './AddCar.css';

const AddCar = () => {
    const [formData, setFormData] = useState({
        carName: '', brand: '', type: 'SUV', pricePerDay: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('carName', formData.carName);
        data.append('brand', formData.brand);
        data.append('type', formData.type);
        data.append('pricePerDay', formData.pricePerDay);

        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        try {
            await API.post('/cars/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add car.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-car-page">
            <div className="form-container glass">
                <h2>List Your Car</h2>
                <p>Provide details and upload high-quality images to attract more bookings.</p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-msg">{error}</div>}

                    <div className="grid-2">
                        <div className="input-group">
                            <label>Car Name</label>
                            <input type="text" required value={formData.carName} onChange={(e) => setFormData({ ...formData, carName: e.target.value })} placeholder="e.g. Model S" />
                        </div>
                        <div className="input-group">
                            <label>Brand</label>
                            <input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Tesla" />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="input-group">
                            <label>Car Type</label>
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="SUV">SUV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Hatchback">Hatchback</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Price Per Day ($)</label>
                            <input type="number" required value={formData.pricePerDay} onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} placeholder="0.00" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Upload Images (Max 5)</label>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} required />
                        <small>Selecting multiple files will upload all of them.</small>
                    </div>

                    <button className="btn btn-primary submit-btn" disabled={loading}>
                        {loading ? 'Uploading to Cloudinary...' : 'Confirm & List Car'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCar;
