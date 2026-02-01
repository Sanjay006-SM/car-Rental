import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import './Auth.css';

const Login = () => {
    const [isCompany, setIsCompany] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isCompany ? '/companies/login' : '/users/login';

        try {
            const { data } = await API.post(endpoint, formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
            window.location.reload(); // Quick refresh to update navbar
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-page">
                <div className="auth-logo">
                    <svg viewBox="0 0 100 40" className="car-logo">
                        <path d="M20,25 Q20,15 40,15 L70,15 Q85,15 85,25 L85,35 L15,35 L15,25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="30" cy="35" r="4" fill="currentColor" />
                        <circle cx="70" cy="35" r="4" fill="currentColor" />
                    </svg>
                    <h1>Rent A Car</h1>
                </div>

                <div className="auth-container glass animate-fade">
                    <h2>Welcome Back!</h2>
                    <div className="role-toggle">
                        <button
                            className={!isCompany ? 'active' : ''}
                            onClick={() => setIsCompany(false)}
                        >User</button>
                        <button
                            className={isCompany ? 'active' : ''}
                            onClick={() => setIsCompany(true)}
                        >Company</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-msg">{error}</div>}

                        <div className="input-field">
                            <i className="icon-user">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </i>
                            <input
                                type="email"
                                required
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="input-field">
                            <i className="icon-lock">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </i>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember Me
                            </label>
                            <Link to="/forgot-password" title="Forgot Password?">Forgot Password?</Link>
                        </div>

                        <button className="btn-login" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
