
// import { useState } from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   Bell,
//   Building,
//   Edit,
//   Heart,
//   Home,
//   LogOut,
//   MessageSquare,
//   Settings,
//   User,
// } from "lucide-react";
// import PropertyCard from "@/components/PropertyCard";

// // Sample favorite properties
// const favoriteProperties = [
//   {
//     id: 1,
//     title: "3 BHK Apartment in DLF Phase 5",
//     location: "DLF Phase 5, Gurugram, Haryana",
//     price: "₹1.45 Cr",
//     pricePerSqFt: "7,250",
//     size: "2000 sq.ft",
//     bedrooms: 3,
//     bathrooms: 2,
//     propertyType: "Apartment",
//     image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
//     isVerified: true
//   },
//   {
//     id: 2,
//     title: "4 BHK Independent House in Whitefield",
//     location: "Whitefield, Bangalore, Karnataka",
//     price: "₹2.8 Cr",
//     pricePerSqFt: "9,800",
//     size: "2850 sq.ft",
//     bedrooms: 4,
//     bathrooms: 3,
//     propertyType: "Villa",
//     image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
//   },
// ];

// // Sample recent searches
// const recentSearches = [
//   {
//     id: 1,
//     query: "3 BHK in Mumbai",
//     filters: "Budget: 1-2 Cr, Type: Apartment",
//     date: "2 days ago"
//   },
//   {
//     id: 2,
//     query: "Villas in Bangalore",
//     filters: "Budget: 3-5 Cr, Type: Villa",
//     date: "1 week ago"
//   },
//   {
//     id: 3,
//     query: "2 BHK in Delhi NCR",
//     filters: "Budget: 75L-1.2 Cr, Type: Apartment",
//     date: "2 weeks ago"
//   }
// ];

// // Sample property alerts
// const propertyAlerts = [
//   {
//     id: 1,
//     name: "3 BHK in South Mumbai",
//     criteria: "Budget: 1.5-2.5 Cr, 3+ BHK",
//     frequency: "Daily",
//     status: "Active"
//   },
//   {
//     id: 2,
//     name: "Independent House in Bangalore",
//     criteria: "Budget: 2-3 Cr, Plot Size: 1500+ sq.ft",
//     frequency: "Weekly",
//     status: "Active"
//   }
// ];

// // Sample recent messages
// const recentMessages = [
//   {
//     id: 1,
//     sender: "Amit Kumar",
//     property: "3 BHK Apartment in DLF Phase 5",
//     message: "Is this property still available?",
//     time: "2 hours ago",
//     unread: true
//   },
//   {
//     id: 2,
//     sender: "Priya Singh",
//     property: "4 BHK Independent House in Whitefield",
//     message: "Can we schedule a visit this weekend?",
//     time: "1 day ago",
//     unread: false
//   }
// ];

// const UserDashboard = () => {
//   const [activeTab, setActiveTab] = useState("overview");
  
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1 bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="md:w-1/4">
//               <div className="bg-white rounded-lg shadow-sm p-6 text-center mb-6">
//                 <div className="flex justify-center mb-4">
//                   <Avatar className="h-20 w-20">
//                     <AvatarImage src="https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="User" />
//                     <AvatarFallback>RA</AvatarFallback>
//                   </Avatar>
//                 </div>
//                 <h2 className="font-bold text-xl">Rahul Arora</h2>
//                 <p className="text-gray-500 text-sm">rahul.arora@example.com</p>
//                 <Button variant="outline" size="sm" className="mt-4">
//                   <Edit size={14} className="mr-1" />
//                   Edit Profile
//                 </Button>
//               </div>
              
//               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <nav>
//                   <Button
//                     variant={activeTab === "overview" ? "secondary" : "ghost"}
//                     className="w-full justify-start rounded-none h-12"
//                     onClick={() => setActiveTab("overview")}
//                   >
//                     <Home size={18} className="mr-2" />
//                     Dashboard Overview
//                   </Button>
//                   <Button
//                     variant={activeTab === "favorites" ? "secondary" : "ghost"}
//                     className="w-full justify-start rounded-none h-12"
//                     onClick={() => setActiveTab("favorites")}
//                   >
//                     <Heart size={18} className="mr-2" />
//                     Favorite Properties
//                   </Button>
//                   <Button
//                     variant={activeTab === "searches" ? "secondary" : "ghost"}
//                     className="w-full justify-start rounded-none h-12"
//                     onClick={() => setActiveTab("searches")}
//                   >
//                     <Building size={18} className="mr-2" />
//                     Recent Searches
//                   </Button>
//                   <Button
//                     variant={activeTab === "alerts" ? "secondary" : "ghost"}
//                     className="w-full justify-start rounded-none h-12"
//                     onClick={() => setActiveTab("alerts")}
//                   >
//                     <Bell size={18} className="mr-2" />
//                     Property Alerts
//                   </Button>
//                   <Button
//                     variant={activeTab === "messages" ? "secondary" : "ghost"}
//                     className="w-full justify-start rounded-none h-12"
//                     onClick={() => setActiveTab("messages")}
//                   >
//                     <MessageSquare size={18} className="mr-2" />
//                     Messages
//                   </Button>
//                   <Button
//                     variant={activeTab === "settings" ? "secondary" : "ghost"}
//                     className="w-full justify-start rounded-none h-12"
//                     onClick={() => setActiveTab("settings")}
//                   >
//                     <Settings size={18} className="mr-2" />
//                     Account Settings
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start rounded-none h-12 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <LogOut size={18} className="mr-2" />
//                     Logout
//                   </Button>
//                 </nav>
//               </div>
//             </div>
            
//             <div className="md:w-3/4">
//               {activeTab === "overview" && (
//                 <div className="space-y-6">
//                   <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <Card>
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="text-sm text-gray-500">Favorite Properties</p>
//                             <p className="text-3xl font-bold">{favoriteProperties.length}</p>
//                           </div>
//                           <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
//                             <Heart size={24} />
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="text-sm text-gray-500">Property Alerts</p>
//                             <p className="text-3xl font-bold">{propertyAlerts.length}</p>
//                           </div>
//                           <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
//                             <Bell size={24} />
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="text-sm text-gray-500">Unread Messages</p>
//                             <p className="text-3xl font-bold">1</p>
//                           </div>
//                           <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-500">
//                             <MessageSquare size={24} />
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
                  
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center justify-between">
//                         <span>Recently Favorited Properties</span>
//                         <Button variant="link" asChild>
//                           <a href="#favorites">View All</a>
//                         </Button>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {favoriteProperties.map((property) => (
//                           <div key={property.id} className="flex gap-3">
//                             <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
//                               <img 
//                                 src={property.image} 
//                                 alt={property.title}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
//                               <p className="text-primary font-medium text-sm">{property.price}</p>
//                               <p className="text-xs text-gray-500 line-clamp-1">{property.location}</p>
//                               <p className="text-xs text-gray-500">{property.bedrooms} BHK • {property.size}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Recent Searches</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-4">
//                           {recentSearches.slice(0, 2).map((search) => (
//                             <div key={search.id} className="border-b pb-3 last:border-none last:pb-0">
//                               <p className="font-medium">{search.query}</p>
//                               <p className="text-xs text-gray-500">{search.filters}</p>
//                               <div className="flex justify-between items-center mt-1">
//                                 <span className="text-xs text-gray-400">{search.date}</span>
//                                 <Button variant="ghost" size="sm">Search Again</Button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
                    
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Recent Messages</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-4">
//                           {recentMessages.map((message) => (
//                             <div key={message.id} className="border-b pb-3 last:border-none last:pb-0">
//                               <div className="flex justify-between">
//                                 <p className="font-medium flex items-center">
//                                   {message.sender}
//                                   {message.unread && (
//                                     <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
//                                   )}
//                                 </p>
//                                 <p className="text-xs text-gray-400">{message.time}</p>
//                               </div>
//                               <p className="text-xs text-gray-500">{message.property}</p>
//                               <p className="text-sm mt-1">{message.message}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>
//               )}
              
//               {activeTab === "favorites" && (
//                 <div>
//                   <h1 className="text-2xl font-bold mb-6">Favorite Properties</h1>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {favoriteProperties.map((property) => (
//                       <PropertyCard key={property.id} property={property} />
//                     ))}
//                   </div>
//                 </div>
//               )}
              
//               {activeTab === "searches" && (
//                 <div>
//                   <h1 className="text-2xl font-bold mb-6">Recent Searches</h1>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="space-y-4">
//                         {recentSearches.map((search) => (
//                           <div key={search.id} className="flex justify-between items-center border-b pb-4 last:border-none last:pb-0">
//                             <div>
//                               <p className="font-medium">{search.query}</p>
//                               <p className="text-sm text-gray-500">{search.filters}</p>
//                               <p className="text-xs text-gray-400 mt-1">{search.date}</p>
//                             </div>
//                             <div>
//                               <Button>Search Again</Button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
              
//               {activeTab === "alerts" && (
//                 <div>
//                   <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold">Property Alerts</h1>
//                     <Button>Create New Alert</Button>
//                   </div>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="space-y-4">
//                         {propertyAlerts.map((alert) => (
//                           <div key={alert.id} className="flex justify-between items-center border-b pb-4 last:border-none last:pb-0">
//                             <div>
//                               <p className="font-medium">{alert.name}</p>
//                               <p className="text-sm text-gray-500">{alert.criteria}</p>
//                               <div className="flex gap-4 mt-1">
//                                 <p className="text-xs flex items-center">
//                                   <Bell size={12} className="mr-1" />
//                                   {alert.frequency}
//                                 </p>
//                                 <p className="text-xs text-green-500 flex items-center">
//                                   {alert.status}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex gap-2">
//                               <Button variant="outline" size="sm">Edit</Button>
//                               <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Delete</Button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
              
//               {activeTab === "messages" && (
//                 <div>
//                   <h1 className="text-2xl font-bold mb-6">Messages</h1>
//                   <Card>
//                     <CardContent className="pt-6">
//                       <div className="space-y-4">
//                         {recentMessages.map((message) => (
//                           <div key={message.id} className="flex items-start gap-4 border-b pb-4 last:border-none last:pb-0">
//                             <Avatar>
//                               <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1">
//                               <div className="flex justify-between">
//                                 <p className="font-medium flex items-center">
//                                   {message.sender}
//                                   {message.unread && (
//                                     <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">New</span>
//                                   )}
//                                 </p>
//                                 <p className="text-xs text-gray-400">{message.time}</p>
//                               </div>
//                               <p className="text-xs text-gray-500 mt-1">{message.property}</p>
//                               <p className="text-sm mt-2">{message.message}</p>
//                               <div className="mt-2">
//                                 <Button size="sm">Reply</Button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
              
//               {activeTab === "settings" && (
//                 <div>
//                   <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
//                   <Tabs defaultValue="profile">
//                     <TabsList className="mb-6">
//                       <TabsTrigger value="profile">Profile</TabsTrigger>
//                       <TabsTrigger value="preferences">Preferences</TabsTrigger>
//                       <TabsTrigger value="notifications">Notifications</TabsTrigger>
//                       <TabsTrigger value="security">Security</TabsTrigger>
//                     </TabsList>
                    
//                     <TabsContent value="profile">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle>Profile Information</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-4">
//                             <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//                               <div className="md:w-1/4">
//                                 <label className="text-sm font-medium">Profile Picture</label>
//                               </div>
//                               <div className="md:w-3/4 flex items-center gap-4">
//                                 <Avatar className="h-16 w-16">
//                                   <AvatarImage src="https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="User" />
//                                   <AvatarFallback>RA</AvatarFallback>
//                                 </Avatar>
//                                 <Button variant="outline" size="sm">Change Photo</Button>
//                               </div>
//                             </div>
//                             <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//                               <div className="md:w-1/4">
//                                 <label className="text-sm font-medium">Full Name</label>
//                               </div>
//                               <div className="md:w-3/4">
//                                 <input 
//                                   type="text" 
//                                   defaultValue="Rahul Arora" 
//                                   className="w-full p-2 border rounded-md"
//                                 />
//                               </div>
//                             </div>
//                             <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//                               <div className="md:w-1/4">
//                                 <label className="text-sm font-medium">Email</label>
//                               </div>
//                               <div className="md:w-3/4">
//                                 <input 
//                                   type="email" 
//                                   defaultValue="rahul.arora@example.com" 
//                                   className="w-full p-2 border rounded-md"
//                                 />
//                               </div>
//                             </div>
//                             <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//                               <div className="md:w-1/4">
//                                 <label className="text-sm font-medium">Phone</label>
//                               </div>
//                               <div className="md:w-3/4">
//                                 <input 
//                                   type="tel" 
//                                   defaultValue="+91 9876543210" 
//                                   className="w-full p-2 border rounded-md"
//                                 />
//                               </div>
//                             </div>
//                             <div className="flex justify-end">
//                               <Button>Save Changes</Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </TabsContent>

//                     <TabsContent value="preferences">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle>Preferences</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-4">
//                             <div className="border-b pb-4">
//                               <h3 className="font-medium mb-2">Property Preferences</h3>
//                               <div className="space-y-2">
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Apartments
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Villas
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" className="mr-2" />
//                                   Plots
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Commercial Properties
//                                 </label>
//                               </div>
//                             </div>
//                             <div>
//                               <h3 className="font-medium mb-2">Location Preferences</h3>
//                               <div className="space-y-2">
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Mumbai
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" className="mr-2" />
//                                   Delhi NCR
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Bangalore
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" className="mr-2" />
//                                   Hyderabad
//                                 </label>
//                               </div>
//                             </div>
//                             <div className="flex justify-end">
//                               <Button>Save Preferences</Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </TabsContent>

//                     <TabsContent value="notifications">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle>Notification Settings</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-4">
//                             <div className="border-b pb-4">
//                               <h3 className="font-medium mb-2">Email Notifications</h3>
//                               <div className="space-y-2">
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Property Alerts
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Messages
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Account Updates
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" className="mr-2" />
//                                   Marketing Communications
//                                 </label>
//                               </div>
//                             </div>
//                             <div className="border-b pb-4">
//                               <h3 className="font-medium mb-2">SMS Notifications</h3>
//                               <div className="space-y-2">
//                                 <label className="flex items-center">
//                                   <input type="checkbox" defaultChecked className="mr-2" />
//                                   Property Alerts
//                                 </label>
//                                 <label className="flex items-center">
//                                   <input type="checkbox" className="mr-2" />
//                                   Messages
//                                 </label>
//                               </div>
//                             </div>
//                             <div className="flex justify-end">
//                               <Button>Save Settings</Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </TabsContent>

//                     <TabsContent value="security">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle>Security Settings</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-6">
//                             <div>
//                               <h3 className="font-medium mb-4">Change Password</h3>
//                               <div className="space-y-3">
//                                 <div>
//                                   <label className="text-sm font-medium block mb-1">Current Password</label>
//                                   <input type="password" className="w-full p-2 border rounded-md" />
//                                 </div>
//                                 <div>
//                                   <label className="text-sm font-medium block mb-1">New Password</label>
//                                   <input type="password" className="w-full p-2 border rounded-md" />
//                                 </div>
//                                 <div>
//                                   <label className="text-sm font-medium block mb-1">Confirm New Password</label>
//                                   <input type="password" className="w-full p-2 border rounded-md" />
//                                 </div>
//                                 <div>
//                                   <Button>Update Password</Button>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="border-t pt-6">
//                               <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
//                               <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
//                               <Button variant="outline">Enable Two-Factor Auth</Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </TabsContent>
//                   </Tabs>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default UserDashboard;
