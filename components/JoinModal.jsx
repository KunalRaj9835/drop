import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return false;
    }
    if (!formData.email.toLowerCase().includes('@gmail.com')) {
      setMessage('Please use a Gmail address.');
      setMessageType('error');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage('Phone number must be exactly 10 digits.');
      setMessageType('error');
      return false;
    }
    return true;
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

  const checkForDuplicates = async (email, phone) => {
    try {
      console.log(`🔍 Checking duplicates for email: "${email}" and phone: "${phone}"`);
      
      // Check for email duplicates with case-insensitive search
      const { data: emailCheck, error: emailError } = await supabase
        .from('wait')
        .select('id, email')
        .ilike('email', email)
        .limit(1);

      if (emailError) {
        console.error('❌ Email check error:', emailError);
        throw new Error(`Email check failed: ${emailError.message}`);
      }

      // Check for phone duplicates
      const { data: phoneCheck, error: phoneError } = await supabase
        .from('wait')
        .select('id, phone')
        .eq('phone', phone)
        .limit(1);

      if (phoneError) {
        console.error('❌ Phone check error:', phoneError);
        throw new Error(`Phone check failed: ${phoneError.message}`);
      }

      console.log('📧 Email check results:', emailCheck);
      console.log('📱 Phone check results:', phoneCheck);

      const emailExists = emailCheck && emailCheck.length > 0;
      const phoneExists = phoneCheck && phoneCheck.length > 0;

      console.log(`✅ Duplicate check complete - Email exists: ${emailExists}, Phone exists: ${phoneExists}`);

      return {
        emailExists,
        phoneExists
      };
    } catch (error) {
      console.error('❌ Duplicate check failed:', error);
      throw new Error(`Failed to check for duplicates: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    // Clear any previous messages
    setMessage(null);
    setMessageType('');

    // Validate form first
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const phone = formData.phone.trim();

      console.log(`🚀 Starting registration for email: "${email}" and phone: "${phone}"`);

      // Check for duplicates
      const duplicateCheck = await checkForDuplicates(email, phone);

      if (duplicateCheck.emailExists || duplicateCheck.phoneExists) {
        console.log('⚠️ Duplicate found, preventing registration');
        
        // Show specific message based on what's duplicated
        let duplicateMessage = '';
        if (duplicateCheck.emailExists && duplicateCheck.phoneExists) {
          duplicateMessage = 'Thank you, but both this email and phone number are already registered.';
        } else if (duplicateCheck.emailExists) {
          duplicateMessage = 'Thank you, but this email is already registered.';
        } else if (duplicateCheck.phoneExists) {
          duplicateMessage = 'Thank you, but this phone number is already registered.';
        }
        
        setMessage(duplicateMessage);
        setMessageType('warning');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ No duplicates found, proceeding with registration');

      // If no duplicates found, insert the new user
      const { data: insertData, error: insertError } = await supabase
        .from('wait')
        .insert([
          {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: email,
            phone: phone,
          }
        ])
        .select();

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        throw new Error(`Registration failed: ${insertError.message}`);
      }

      console.log('✅ Registration successful:', insertData);

      // Success
      setMessage('✅ Congratulations! Registration complete.');
      setMessageType('success');

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage(`❌ ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Register now</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
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
            <div
              className={`p-4 rounded-lg mb-6 text-center font-medium ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : messageType === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
              role={messageType === 'error' ? 'alert' : undefined}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
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

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your email (Gmail only)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />

            {/* Phone */}
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