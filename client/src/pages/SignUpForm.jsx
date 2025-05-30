import { useState } from 'react';
import '../styles/SignUpForm.css';

const SignUpForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    business_type: '',
    city: '',
    address: '',
    business_email: '',
    business_phone: '',
    license: null,
    letter: null
  });
  const [agreed, setAgreed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'agreed') setAgreed(checked);
      if (name === 'confirmed') setConfirmed(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }
  };

  const handleFileCancel = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
    
    const fileInput = document.getElementById(fieldName);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'full_name', 'email', 'phone', 'password', 'confirmPassword',
      'business_name', 'business_type', 'city', 'address',
      'business_email', 'business_phone', 'license', 'letter'
    ];
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.business_email && !emailRegex.test(formData.business_email)) newErrors.business_email = 'Invalid business email format';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number format';
    if (formData.business_phone && !phoneRegex.test(formData.business_phone)) newErrors.business_phone = 'Invalid business phone format';
    if (!confirmed) newErrors.confirmed = 'You must confirm the information is accurate.';
    if (!agreed) newErrors.agreed = 'You must agree to the Terms & Conditions.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: '', message: '' });
    
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields correctly.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSubmitStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'license' && key !== 'letter' && key !== 'confirmPassword') {
          submitData.append(key, formData[key]);
        }
      });

      // Append files
      if (formData.license) {
        submitData.append('license', formData.license);
      }
      if (formData.letter) {
        submitData.append('letter', formData.letter);
      }

      const response = await fetch('http://localhost:5000/api/auth/register-business', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        setShowSuccessModal(true);
        setSubmitStatus({ 
          type: 'success', 
          message: 'Registration successful!' 
        });
        // Clear form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          business_name: '',
          business_type: '',
          city: '',
          address: '',
          business_email: '',
          business_phone: '',
          license: null,
          letter: null
        });
        setAgreed(false);
        setConfirmed(false);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-card">
      <h2 className="signup-title">Business Registration</h2>
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-checkmark">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#7ED957"/>
                <path d="M17 29.5L25 37.5L39 21.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="modal-message">
              <p>Your application has been received.<br/>You will be notified via email once verified.</p>
            </div>
            <button className="modal-back-btn" onClick={onBackToLogin}>&larr; Back</button>
          </div>
        </div>
      )}
      {!showSuccessModal && submitStatus.message && (
        <div className={`submit-status ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="signup-form" encType="multipart/form-data">
        <div className="form-group">
          <label className="blue-label" htmlFor="full_name">Full Name</label>
          <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" required />
          {errors.full_name && <span className="error-text">{errors.full_name}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" required />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="business_name">Business Name</label>
          <input type="text" id="business_name" name="business_name" value={formData.business_name} onChange={handleChange} placeholder="Enter your business name" required />
          {errors.business_name && <span className="error-text">{errors.business_name}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="business_type">Business Type</label>
          <select id="business_type" name="business_type" value={formData.business_type} onChange={handleChange} required>
            <option value="">Select Business Type</option>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="service">Service</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="other">Other</option>
          </select>
          {errors.business_type && <span className="error-text">{errors.business_type}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="city">Business Location (City)</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="address">Business Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter business address" required />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="business_email">Business Email</label>
          <input type="email" id="business_email" name="business_email" value={formData.business_email} onChange={handleChange} placeholder="Enter business email" required />
          {errors.business_email && <span className="error-text">{errors.business_email}</span>}
        </div>
        <div className="form-group">
          <label className="blue-label" htmlFor="business_phone">Business Phone</label>
          <input type="tel" id="business_phone" name="business_phone" value={formData.business_phone} onChange={handleChange} placeholder="Enter business phone" required />
          {errors.business_phone && <span className="error-text">{errors.business_phone}</span>}
        </div>
        <div className="form-group file-group">
          <label className="blue-label" htmlFor="license">Business License</label>
          <input type="file" id="license" name="license" onChange={handleChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />
          {formData.license && (
            <button type="button" className="file-cancel-btn" onClick={() => handleFileCancel('license')}>×</button>
          )}
          {errors.license && <span className="error-text">{errors.license}</span>}
        </div>
        <div className="form-group file-group">
          <label className="blue-label" htmlFor="letter">Authorization Letter</label>
          <input type="file" id="letter" name="letter" onChange={handleChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />
          {formData.letter && (
            <button type="button" className="file-cancel-btn" onClick={() => handleFileCancel('letter')}>×</button>
          )}
          {errors.letter && <span className="error-text">{errors.letter}</span>}
        </div>
        <div className="checkbox-group required">
          <label>
            <input type="checkbox" name="confirmed" checked={confirmed} onChange={handleChange} required />
            <span>I confirm that the information provided is accurate and truthful.</span>
          </label>
          {errors.confirmed && <span className="error-text">{errors.confirmed}</span>}
        </div>
        <div className="checkbox-group required">
          <label>
            <input type="checkbox" name="agreed" checked={agreed} onChange={handleChange} required />
            <span>I agree to the <a href="#" target="_blank">Terms & Conditions</a></span>
          </label>
          {errors.agreed && <span className="error-text">{errors.agreed}</span>}
        </div>
        <button type="submit" className="signup-submit-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" className="back-button" onClick={onBackToLogin}>Back to Login</button>
      </form>
    </div>
  );
};

export default SignUpForm; 