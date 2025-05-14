import React, { useState } from 'react';
import InquiryService from '../services/InquiryService';

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const InquiryForm: React.FC<InquiryFormProps> = ({
  propertyId,
  propertyTitle,
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await InquiryService.createInquiry({
        propertyId,
        ...formData
      });

      if (result.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          contactNumber: '',
          message: ''
        });
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || 'Failed to send inquiry');
        if (onError) onError(result.message || 'Failed to send inquiry');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('An error occurred while sending your inquiry');
      if (onError) onError('An error occurred while sending your inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Interested in this property?</h3>
      
      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
          <p className="font-medium">Thank you for your inquiry!</p>
          <p className="text-sm mt-1">We've received your message about "{propertyTitle}" and will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="I'm interested in this property and would like to learn more..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
          >
            {submitting ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      )}
    </div>
  );
};

export default InquiryForm;