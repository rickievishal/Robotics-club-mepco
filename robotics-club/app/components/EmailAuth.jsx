'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import { emailSignup, emailLogin, validatePasswordStrength } from './api';
import { useAuth } from '../hooks/useAuth';

const EmailAuth = () => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    // Password strength state
    const [passwordStrength, setPasswordStrength] = useState(null);
    
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Reset messages
        setError('');
        setSuccess('');
        
        // Check password strength if password field
        if (name === 'password') {
            if (value.trim()) {
                const strength = validatePasswordStrength(value);
                setPasswordStrength(strength);
            } else {
                setPasswordStrength(null);
            }
        }
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            let result;
            
            if (isLogin) {
                // Login
                result = await emailLogin({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Signup
                if (!formData.name.trim()) {
                    setError('Name is required for signup');
                    return;
                }
                
                if (!passwordStrength || !passwordStrength.isValid) {
                    setError('Password is too weak. Please choose a stronger password.');
                    return;
                }
                
                result = await emailSignup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            }
            
            // Handle successful authentication
            if (result.data && result.data.token) {
                // Use the AuthProvider's login function to sync React state
                login(result.data.user, result.data.token);
                setSuccess(`${isLogin ? 'Login' : 'Signup'} successful!`);
                
                // Trigger login success event (same as Google OAuth)
                window.dispatchEvent(new Event('login-success'));
                
                // Redirect to welcome page after successful login/signup
                setTimeout(() => {
                    window.location.href = '/club/welcome';
                }, 1000);
            }
            
        } catch (err) {
            console.error('Authentication error:', err);
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };
    
    // Toggle between login and signup
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '' });
        setPasswordStrength(null);
        setError('');
        setSuccess('');
    };
    
    // Password strength indicator component
    const PasswordStrengthIndicator = ({ strength }) => {
        if (!strength) return null;
        
        const getStrengthBar = () => {
            const width = (strength.strength / 5) * 100;
            const color = strength.strengthColor;
            return (
                <div className="w-full bg-gray-300 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                            color === 'red' ? 'bg-red-500' :
                            color === 'yellow' ? 'bg-yellow-500' :
                            color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${width}%` }}
                    ></div>
                </div>
            );
        };
        
        return (
            <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-400">Password Strength:</span>
                    <span className={`font-medium ${
                        strength.strengthColor === 'red' ? 'text-red-500' :
                        strength.strengthColor === 'yellow' ? 'text-yellow-500' :
                        strength.strengthColor === 'blue' ? 'text-blue-500' : 'text-green-500'
                    }`}>
                        {strength.strengthText}
                    </span>
                </div>
                {getStrengthBar()}
                {!isLogin && (
                    <div className="text-xs text-gray-400 mt-1">
                        <p>Requirements: 8+ chars, upper/lowercase, number, special char</p>
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <div className="w-full max-w-md mx-auto mt-6">
            {/* Toggle buttons */}
            <div className="flex bg-white/10 rounded-lg p-1 mb-6">
                <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        !isLogin 
                            ? 'bg-[var(--primary)] text-white' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                >
                    Sign Up
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        isLogin 
                            ? 'bg-[var(--primary)] text-white' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                >
                    Login
                </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field (signup only) */}
                {!isLogin && (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-white/15 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
                            required={!isLogin}
                        />
                    </div>
                )}
                
                {/* Email field */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-white/15 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
                        required
                    />
                </div>
                
                {/* Password field */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-white/15 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-white" />
                        ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-white" />
                        )}
                    </button>
                </div>
                
                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator strength={passwordStrength} />
                
                {/* Error/Success Messages */}
                {error && (
                    <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="text-green-500 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        {success}
                    </div>
                )}
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        loading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80'
                    }`}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
            </form>
            
            {/* Mode Toggle */}
            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default EmailAuth;
