// // src/pages/SellerProperties.tsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthStore } from '@/store/authStore';
// import { useNavigate } from 'react-router-dom';
// // import { getPropertyById } from '@/services/api';

// const SellerProperties = () => {
//   const { user } = useAuthStore();
//   const navigate = useNavigate();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user || user.role !== 'seller') {
//       alert('Only sellers can view this page.');
//       navigate('/login');
//       return;
//     }

//     const fetchProperties = async () => {
//       try {
//         // const res = await getPropertyById(user._id)
//         const res = await axios.get(`http:localhost:3000/api/v1/Property/properties/seller/${user._id}`)
//         setProperties(res.data);
//       } catch (err) {
//         console.error(err);
//         alert('Failed to load properties.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [user, navigate]);

//   if (loading) return <div className="text-center py-10">Loading your properties...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">Your Listed Properties</h2>
//       {properties.length === 0 ? (
//         <p>You haven’t listed any properties yet.</p>
//       ) : (
//         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//           {properties.map((prop: any) => (
//             <div key={prop._id} className="border rounded-xl shadow p-4">
//               <img src={prop.images[0]} alt="Property" className="w-full h-40 object-cover rounded mb-2" />
//               <h3 className="font-semibold text-lg">{prop.title}</h3>
//               <p className="text-sm text-gray-600 mb-1">{prop.location.address}, {prop.location.city}</p>
//               <p className="text-green-700 font-bold mb-1">
//                 ₹{Number(prop.price).toLocaleString()}
//               </p>
//               <p className="text-sm">{prop.features.bedrooms} BHK • {prop.features.bathrooms} Bath • {prop.features.area} sqft</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellerProperties;
