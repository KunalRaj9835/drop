import React, { useState } from 'react';
import { X } from 'lucide-react';

const JoinModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return false;
    }

    // Check if email is Gmail
    if (!formData.email.toLowerCase().includes('@gmail.com')) {
      setMessage('Please use a Gmail address.');
      setMessageType('error');
      return false;
    }

    // Check phone number format (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage('Phone number must be exactly 10 digits.');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Congratulations! Registration complete.');
        setMessageType('success');
        
        // Auto-close modal after 3 seconds on success
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      } else {
        switch (data.error) {
          case 'EMAIL_EXISTS':
            setMessage('⚠️ Email already in use.');
            setMessageType('warning');
            break;
          case 'INVALID_PHONE':
            setMessage('⚠️ Invalid phone number.');
            setMessageType('warning');
            break;
          default:
            setMessage('❌ Server error. Try again later.');
            setMessageType('error');
        }
      }
    } catch (error) {
      setMessage('❌ Server error. Try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    setMessage(null);
    setMessageType('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Register now</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Enter your information to register for the workshop.
          </p>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 text-center font-medium ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : messageType === 'warning'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email (Gmail only)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number (10 digits)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
                maxLength="10"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JoinModal;