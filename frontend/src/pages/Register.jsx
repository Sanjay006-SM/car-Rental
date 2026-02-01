import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import './Auth.css';

import carImage from '../assets/931b8f58-6549-448d-a4d6-a545e0d80b66.png';

const Register = () => {
    const [isCompany, setIsCompany] = useState(false);
    const [formData, setFormData] = useState({
        name: '', companyName: '', email: '', phone: '', address: '', password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isCompany ? '/companies/register' : '/users/register';

        try {
            const { data } = await API.post(endpoint, formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-page register-page-split">
                <div className="auth-content-split">
                    <div className="auth-side-form">
                        <div className="auth-container glass">
                            <h2>Create Account</h2>
                            <div className="role-toggle">
                                <button className={!isCompany ? 'active' : ''} onClick={() => setIsCompany(false)}>Join as User</button>
                                <button className={isCompany ? 'active' : ''} onClick={() => setIsCompany(true)}>Join as Company</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && <div className="error-msg">{error}</div>}

                                {!isCompany ? (
                                    <div className="form-group-custom">
                                        <label>Full Name</label>
                                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                ) : (
                                    <>
                                        <div className="form-group-custom">
                                            <label>Company Name</label>
                                            <input type="text" required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                                        </div>
                                        <div className="form-group-custom">
                                            <label>Phone Number</label>
                                            <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                        <div className="form-group-custom">
                                            <label>Address</label>
                                            <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                <div className="form-group-custom">
                                    <label>Email Address</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="form-group-custom">
                                    <label>Password</label>
                                    <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} minLength="6" />
                                </div>

                                <button className="btn-login register-btn-blue" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Register'}
                                </button>
                            </form>

                            <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>

                    <div className="auth-side-image-full">
                        <img src={carImage} alt="Car" className="register-main-car" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
