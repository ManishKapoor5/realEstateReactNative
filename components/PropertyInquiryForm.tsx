// src/components/PropertyInquiryForm.tsx
import React, { useState } from 'react';
import PropertyAccessService from '../services/PropertyAccessService';

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  onInquirySubmitted?: () => void;
}

const PropertyInquiryForm: React.FC<PropertyInquiryFormProps> = ({
  propertyId,
  propertyTitle,
  onInquirySubmitted,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await PropertyAccessService.submitInquiry({
        propertyId,
        ...formData,
      });

      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        contactNumber: '',
        message: '',
      });

      if (onInquirySubmitted) {
        onInquirySubmitted();
      }
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setError('Failed to submit your inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Interested in this property?</h3>
      {submitSuccess ? (
        <div className="p-4 bg-green-50 text-green-800 rounded-md">
          <p className="font-medium">Thank you for your inquiry!</p>
          <p className="text-sm mt-1">
            We've received your message about {propertyTitle}. A representative will contact you
            shortly.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="I'm interested in this property and would like to know more about..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </button>

          <p className="text-xs text-gray-500 mt-2">
            By submitting this form, you agree to our privacy policy and terms of service.
          </p>
        </form>
      )}
    </div>
  );
};

export default PropertyInquiryForm;