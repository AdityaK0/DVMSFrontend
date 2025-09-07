import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.jsx';

const AuthForm = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, signup, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) clearError();
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (mode === 'signup') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate('/vendor/onboarding');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-secondary-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          className={`input-field mt-1 ${errors.username ? 'border-red-500' : ''}`}
          placeholder="Enter your username"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      {mode === 'signup' && (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`input-field mt-1 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`input-field mt-1 ${errors.password ? 'border-red-500' : ''}`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {mode === 'signup' && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input-field mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>

      <div className="text-center">
        <p className="text-sm text-secondary-600">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={mode === 'login' ? '/vendor/signup' : '/vendor/login'}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </form>
  );
};

export default AuthForm;
