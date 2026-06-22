import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Successfully logged in!');
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-logo">⚡ ERP PORTAL</h2>
        <p className="auth-subtitle">Sign in to manage your workplace account</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          Login
        </Button>
      </form>
      <div className="auth-footer">
        Don't have an account? <Link to="/register">Register Admin</Link>
      </div>
    </div>
  );
};

export default Login;
