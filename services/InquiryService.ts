import axiosInstance from './axiosInstance';

export interface Property {
  id: string;
  title: string;
  address?: string;
  imageUrl?: string;
}

export interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  propertyId: Property;
  message: string;
  createdAt: string;
  status: string;
}

class InquiryService {
  async getAllInquiries(): Promise<{ inquiries: Inquiry[], total: number }> {
    const response = await axiosInstance.get('/inquiry/getAllInquiries');
    return {
      inquiries: response.data.inquiries || [],
      total: response.data.total || 0
    };
  }

  async getInquiryById(id: string): Promise<Inquiry> {
    const response = await axiosInstance.get(`/inquiry/${id}`);
    return response.data.inquiry;
  }

  async createInquiry(inquiryData: {
    propertyId: string;
    fullName: string;
    email: string;
    contactNumber: string;
    message: string;
  }): Promise<{ success: boolean; inquiry?: Inquiry; message?: string }> {
    try {
      const response = await axiosInstance.post('/inquiry/create', inquiryData);
      return {
        success: true,
        inquiry: response.data.inquiry,
        message: 'Inquiry sent successfully'
      };
    } catch (error: any) {
      console.error('Error creating inquiry:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send inquiry'
      };
    }
  }

  async updateInquiryStatus(inquiryId: string, status: string): Promise<boolean> {
    try {
      await axiosInstance.patch(`/inquiry/status/${inquiryId}`, { status });
      return true;
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      return false;
    }
  }
}

export default new InquiryService();