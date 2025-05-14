
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { 
//   Award, 
//   CheckCircle, 
//   Clock, 
//   Home, 
//   MapPin, 
//   Target, 
//   Truck, 
//   Users 
// } from "lucide-react";

// const teamMembers = [
//   {
//     name: "Rahul Kapoor",
//     position: "CEO & Founder",
//     bio: "With over 20 years of experience in real estate, Rahul has guided Legacy land to become India's premier property portal.",
//     image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
//   },
//   {
//     name: "Priya Sharma",
//     position: "COO",
//     bio: "Priya brings her extensive knowledge of operations and customer service to ensure smooth functioning of all aspects of the business.",
//     image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
//   },
//   {
//     name: "Akash Mehta",
//     position: "CTO",
//     bio: "Akash leads our technology division, continually innovating to provide the best digital experience for property buyers and sellers.",
//     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
//   },
//   {
//     name: "Neha Patel",
//     position: "Head of Marketing",
//     bio: "Neha's creative marketing strategies have helped position Legacy land as a trusted brand in the Indian real estate market.",
//     image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
//   }
// ];

// const AboutUs = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <div className="bg-primary py-16">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">About Legacy land Real Estate</h1>
//             <p className="text-primary-foreground/90 max-w-xl mx-auto">
//               Transforming the way India buys, sells, and rents property since 2005
//             </p>
//           </div>
//         </div>

//         <div className="container mx-auto px-4 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
//             <div>
//               <h2 className="text-2xl font-bold mb-4">Our Story</h2>
//               <p className="text-gray-600 mb-4">
//                 Founded in 2005, Legacy land began with a simple mission: to simplify property buying, selling, and renting for every Indian. What started as a small operation with just a handful of listings has grown into India's largest real estate platform.
//               </p>
//               <p className="text-gray-600 mb-4">
//                 Over the years, we've helped millions of Indians find their dream homes, investment properties, and rental accommodations. Our journey has been defined by innovation, customer-centricity, and an unwavering commitment to transparency.
//               </p>
//               <p className="text-gray-600">
//                 Today, Legacy land is not just a property listing site. We're a comprehensive real estate solution provider offering services like property valuation, legal advice, home loans, and more. Our vision is to continue revolutionizing the Indian real estate industry through technology and exceptional service.
//               </p>
//             </div>
//             <div className="order-first md:order-last">
//               <img 
//                 src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
//                 alt="Office building" 
//                 className="rounded-lg shadow-md w-full"
//               />
//             </div>
//           </div>

//           <div className="text-center mb-16">
//             <h2 className="text-2xl font-bold mb-4">What Sets Us Apart</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto mb-10">
//               Legacy land is built on a foundation of core values and unique advantages that have earned us the trust of millions of users across India.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               <Card className="text-center">
//                 <CardContent className="pt-6">
//                   <div className="flex justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Home className="h-8 w-8 text-primary" />
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold mb-2">Extensive Listings</h3>
//                   <p className="text-gray-600">
//                     Over 1 million active property listings across 100+ Indian cities.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card className="text-center">
//                 <CardContent className="pt-6">
//                   <div className="flex justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
//                       <CheckCircle className="h-8 w-8 text-primary" />
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold mb-2">Verified Properties</h3>
//                   <p className="text-gray-600">
//                     Rigorous verification process to ensure authentic listings.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card className="text-center">
//                 <CardContent className="pt-6">
//                   <div className="flex justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Truck className="h-8 w-8 text-primary" />
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold mb-2">End-to-End Service</h3>
//                   <p className="text-gray-600">
//                     Support from property search to possession and beyond.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card className="text-center">
//                 <CardContent className="pt-6">
//                   <div className="flex justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Target className="h-8 w-8 text-primary" />
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold mb-2">Smart Search</h3>
//                   <p className="text-gray-600">
//                     AI-powered search tools that understand your preferences.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           <div className="mb-16">
//             <div className="text-center mb-10">
//               <h2 className="text-2xl font-bold mb-2">Meet Our Team</h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Our diverse team brings together expertise from real estate, technology, customer service, and marketing to deliver an exceptional property search experience.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {teamMembers.map((member, index) => (
//                 <Card key={index} className="overflow-hidden">
//                   <div className="h-60 overflow-hidden">
//                     <img 
//                       src={member.image} 
//                       alt={member.name} 
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <CardContent className="pt-4">
//                     <h3 className="font-bold text-lg">{member.name}</h3>
//                     <p className="text-primary text-sm mb-2">{member.position}</p>
//                     <p className="text-gray-600 text-sm">{member.bio}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>

//           <div className="mb-16">
//             <div className="text-center mb-10">
//               <h2 className="text-2xl font-bold mb-2">Our Milestones</h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Key moments in our journey to becoming India's leading real estate platform
//               </p>
//             </div>
//             <div className="relative">
//               <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-gray-200"></div>
//               <div className="space-y-12">
//                 <div className="relative">
//                   <div className="flex items-center">
//                     <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
//                       <Clock size={20} />
//                     </div>
//                     <div className="flex-grow ml-6 bg-white rounded-lg shadow-sm p-6">
//                       <h3 className="font-bold">2005</h3>
//                       <p className="text-gray-600">Legacy land founded with just 100 property listings in Mumbai.</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <div className="flex items-center justify-end">
//                     <div className="flex-grow mr-6 bg-white rounded-lg shadow-sm p-6 text-right">
//                       <h3 className="font-bold">2010</h3>
//                       <p className="text-gray-600">Expanded to 10 major cities across India with 50,000+ listings.</p>
//                     </div>
//                     <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
//                       <Clock size={20} />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <div className="flex items-center">
//                     <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
//                       <Clock size={20} />
//                     </div>
//                     <div className="flex-grow ml-6 bg-white rounded-lg shadow-sm p-6">
//                       <h3 className="font-bold">2015</h3>
//                       <p className="text-gray-600">Launched mobile app, transforming how Indians search for property.</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <div className="flex items-center justify-end">
//                     <div className="flex-grow mr-6 bg-white rounded-lg shadow-sm p-6 text-right">
//                       <h3 className="font-bold">2020</h3>
//                       <p className="text-gray-600">Reached 1 million active listings and 10 million monthly users.</p>
//                     </div>
//                     <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
//                       <Clock size={20} />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <div className="flex items-center">
//                     <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
//                       <Clock size={20} />
//                     </div>
//                     <div className="flex-grow ml-6 bg-white rounded-lg shadow-sm p-6">
//                       <h3 className="font-bold">Today</h3>
//                       <p className="text-gray-600">India's #1 property platform, helping millions find their dream homes.</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-lg p-8 text-center">
//             <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto mb-6">
//               We're always looking for talented individuals who are passionate about transforming the real estate industry. Join our growing team and be part of our exciting journey.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Button>View Career Opportunities</Button>
//               <Button variant="outline">Contact Us</Button>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default AboutUs;
