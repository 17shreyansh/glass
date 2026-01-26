import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(response.data.message);
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed');
            }
        };

        if (token) verifyEmail();
    }, [token, navigate]);

    return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '500px', textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {status === 'verifying' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                        <h2 style={{ color: '#8E6A4E', marginBottom: '10px' }}>Verifying Email...</h2>
                        <p style={{ color: '#666' }}>Please wait while we verify your email address.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ color: '#6B8E23', marginBottom: '10px' }}>Email Verified!</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
                        <p style={{ color: '#666' }}>Redirecting to login...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Verification Failed</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
                        <Link to="/login" style={{ color: '#8E6A4E', textDecoration: 'underline' }}>Go to Login</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
