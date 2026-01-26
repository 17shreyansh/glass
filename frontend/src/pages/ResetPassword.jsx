import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ maxWidth: '500px', textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: '#6B8E23', marginBottom: '10px' }}>Password Reset Successful!</h2>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Your password has been reset successfully.</p>
                    <p style={{ color: '#666' }}>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '500px', width: '100%', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#8E6A4E', marginBottom: '10px', textAlign: 'center' }}>Reset Password</h2>
                <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>Enter your new password below</p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                            placeholder="Confirm new password"
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', background: '#8E6A4E', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: '#8E6A4E', textDecoration: 'none', fontSize: '14px' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
