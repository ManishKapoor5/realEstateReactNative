// import React, { useState, useEffect } from 'react';
// import { Table, Spin, Alert } from 'antd';
// import axiosInstance from '../services/axiosInstance';  // Adjust if needed

// const BuyerInquiriesTab = () => {
//   const [buyerInquiries, setBuyerInquiries] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchBuyerInquiries = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axiosInstance.get('/inquiry/getAllInquiries');
      
//       setBuyerInquiries(response.data.inquiries || []);
//       console.log('Fetched inquiries:', response.data.inquiries);

//     } catch (err) {
//       setError('Failed to fetch buyer inquiries.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBuyerInquiries();
//   }, []);




// //   const inquiryColumns = [
// //   { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
// //   { title: 'Email', dataIndex: 'email', key: 'email' },
// //   { title: 'Phone', dataIndex: 'contactNumber', key: 'contactNumber' },
// //   {
// //     title: 'Property Interested',
// //     dataIndex: ['propertyId', 'title'],  // nested field inside propertyId
// //     key: 'propertyTitle',
// //     render: (_: any, record: any) => record.propertyId?.title || 'N/A',
// //   },
// //   { title: 'Message', dataIndex: 'message', key: 'message' },
// // ];

//     const inquiryColumns = [
//   { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
//   { title: 'Email', dataIndex: 'email', key: 'email' },
//   { title: 'Phone', dataIndex: 'contactNumber', key: 'contactNumber' },
//   {
//     title: 'Property Interested',
//     key: 'propertyInterested',
//     render: (_: any, record: any) => record.propertyId?.title || 'N/A',
//   },
//   { title: 'Message', dataIndex: 'message', key: 'message' },
// ];


//   if (isLoading) {
//     return <Spin size="large" />;
//   }

//   return (
//     <div>
//       {error && <Alert message={error} type="error" />}

//       <Table
//         dataSource={buyerInquiries}
//         columns={inquiryColumns}
//         rowKey={(record) => record._id || record.id}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
// };

// export default BuyerInquiriesTab;

// src/components/BuyerInquiriesTab.tsx
import React, { useState, useEffect } from 'react';
import PropertyAccessService from '../services/PropertyAccessService';
import { AlertTriangle } from 'lucide-react';

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  propertyId: {
    id: string;
    title: string;
  };
  message: string;
  createdAt: string;
  status: string;
}

const BuyerInquiriesTab: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyerInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await PropertyAccessService.getBuyerInquiries();
      setInquiries(response.inquiries || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setError('Failed to load inquiries. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerInquiries();
  }, []);

  const handleRefresh = async () => {
    await fetchBuyerInquiries();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading inquiries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-4 rounded-md text-red-600 inline-block">{error}</div>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Buyer Inquiries</h2>
        <button
          onClick={handleRefresh}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
        >
          Refresh
        </button>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No inquiries yet</h3>
          <p className="mt-2 text-gray-500">You haven't received any inquiries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inquiry.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.contactNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.propertyId?.title || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {inquiry.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inquiry.status === 'new'
                          ? 'bg-green-100 text-green-800'
                          : inquiry.status === 'responded'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {inquiry.status || 'New'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyerInquiriesTab;