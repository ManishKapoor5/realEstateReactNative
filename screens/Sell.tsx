import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Building, 
  Check, 
  Edit, 
  Eye, 
  Image as ImageIcon, 
  LogOut, 
  MessageSquare, 
  Plus, 
  Trash, 
  Upload,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Seller= ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("listings");
  const [properties, setProperties] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    size: "",
    bedrooms: 0,
    bathrooms: 0,
    propertyType: "Apartment",
    status: "draft",
    image: "",
    description: ""
  });

  // Fetch properties and inquiries when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch properties
        const propertiesResponse = await fetch('/api/properties');
        if (!propertiesResponse.ok) throw new Error('Failed to fetch properties');
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);
        
        // Fetch inquiries
        const inquiriesResponse = await fetch('/api/inquiries');
        if (!inquiriesResponse.ok) throw new Error('Failed to fetch inquiries');
        const inquiriesData = await inquiriesResponse.json();
        setMessages(inquiriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Analytics data
  const totalViews = properties.reduce((sum, property) => sum + (property.views || 0), 0);
  const totalInquiries = messages.length;
  const activeListings = properties.filter(p => p.status === "active").length;

  const handlePropertyDelete = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete property');
      
      setProperties(properties.filter(property => property.id !== id));
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePropertyEdit = (property) => {
    setSelectedProperty(property);
    setEditMode(true);
    setNewProperty({
      ...property
    });
    setActiveTab("add");
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editMode && selectedProperty) {
        // Update existing property
        const response = await fetch(`/api/properties/${selectedProperty.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProperty),
        });
        
        if (!response.ok) throw new Error('Failed to update property');
        
        const updatedProperty = await response.json();
        setProperties(properties.map(p => 
          p.id === selectedProperty.id ? updatedProperty : p
        ));
        
        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        // Add new property
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProperty),
        });
        
        if (!response.ok) throw new Error('Failed to add property');
        
        const addedProperty = await response.json();
        setProperties([...properties, addedProperty]);
        
        toast({
          title: "Success",
          description: "Property added successfully",
        });
      }
      
      // Reset form
      setSelectedProperty(null);
      setEditMode(false);
      setNewProperty({
        title: "",
        location: "",
        price: "",
        size: "",
        bedrooms: 0,
        bathrooms: 0,
        propertyType: "Apartment",
        status: "draft",
        image: "",
        description: ""
      });
      setActiveTab("listings");
      
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Error",
        description: `Failed to ${editMode ? 'update' : 'add'} property. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: value
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const propertyToUpdate = properties.find(p => p.id === id);
      if (!propertyToUpdate) return;
      
      const updatedProperty = { ...propertyToUpdate, status: newStatus };
      
      const response = await fetch(`/api/properties/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update property status');
      
      setProperties(properties.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));
      
      toast({
        title: "Success",
        description: `Property ${newStatus === 'active' ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      console.error('Error updating property status:', error);
      toast({
        title: "Error",
        description: "Failed to update property status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });
      
      if (!response.ok) throw new Error('Failed to update inquiry status');
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: "read" } : m
      ));
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to mark inquiry as read. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReplyToMessage = async (id) => {
    try {
      // In a real app, you would show a form to compose the reply
      // For now, we'll just update the status
      const response = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'replied' }),
      });
      
      if (!response.ok) throw new Error('Failed to update inquiry status');
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: "replied" } : m
      ));
      
      // Here you would normally open a modal or form to compose a reply
      toast({
        title: "Info",
        description: "Reply functionality would open here",
      });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold">Loading dashboard...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name || "Seller"}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalViews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalInquiries}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeListings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="add">{editMode ? "Edit Property" : "Add Property"}</TabsTrigger>
          </TabsList>
          
          {/* Listings Tab */}
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Properties</h2>
              <Button onClick={() => {
                setEditMode(false);
                setSelectedProperty(null);
                setActiveTab("add");
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    {property.image ? (
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <p className="text-sm text-gray-500">{property.location}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold">{property.price}</p>
                        <p className="text-sm text-gray-500">{property.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          <Eye className="inline h-4 w-4 mr-1" />{property.views || 0} views
                        </p>
                        <p className="text-sm">
                          <MessageSquare className="inline h-4 w-4 mr-1" />
                          {messages.filter(m => m.property === property.title).length} inquiries
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {property.status === 'draft' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStatusChange(property.id, 'active')}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Publish
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStatusChange(property.id, 'draft')}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Unpublish
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePropertyEdit(property)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePropertyDelete(property.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {properties.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <Building size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No properties listed yet</h3>
                  <p className="text-gray-500 mb-4">Add your first property to start selling or renting</p>
                  <Button onClick={() => setActiveTab("add")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <h2 className="text-2xl font-bold mb-6">Property Inquiries</h2>
            
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map(message => (
                  <Card key={message.id} className={`border-l-4 ${
                    message.status === 'unread' ? 'border-l-blue-500' :
                    message.status === 'replied' ? 'border-l-green-500' : 'border-l-gray-200'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg">{message.from}</CardTitle>
                          <p className="text-sm text-gray-500">{message.property}</p>
                        </div>
                        <div className="text-sm text-gray-500">{message.date}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{message.message}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">{message.contact}</p>
                        <div className="space-x-2">
                          {message.status === 'unread' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button 
                            variant={message.status === 'replied' ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleReplyToMessage(message.id)}
                          >
                            {message.status === 'replied' ? 'Send Another Reply' : 'Reply'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No inquiries yet</h3>
                <p className="text-gray-500">Inquiries from interested buyers will appear here</p>
              </div>
            )}
          </TabsContent>
          
          {/* Add/Edit Property Tab */}
          <TabsContent value="add">
            <h2 className="text-2xl font-bold mb-6">
              {editMode ? `Edit Property: ${selectedProperty?.title}` : "Add New Property"}
            </h2>
            
            <form onSubmit={handlePropertySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newProperty.title}
                      onChange={handleInputChange}
                      placeholder="e.g. 3 BHK Apartment in DLF Phase 5"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={newProperty.location}
                      onChange={handleInputChange}
                      placeholder="e.g. DLF Phase 5, Gurugram, Haryana"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                      name="propertyType"
                      value={newProperty.propertyType}
                      onValueChange={(value) => setNewProperty({...newProperty, propertyType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      value={newProperty.price}
                      onChange={handleInputChange}
                      placeholder="e.g. ₹1.45 Cr"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="size">Property Size</Label>
                    <Input
                      id="size"
                      name="size"
                      value={newProperty.size}
                      onChange={handleInputChange}
                      placeholder="e.g. 2000 sq.ft"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        min="0"
                        value={newProperty.bedrooms}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        min="0"
                        value={newProperty.bathrooms}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Property Image URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="image"
                        name="image"
                        value={newProperty.image}
                        onChange={handleInputChange}
                        placeholder="Enter image URL"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a URL or upload an image (upload functionality not implemented)
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="publish"
                      checked={newProperty.status === "active"}
                      onCheckedChange={(checked) => 
                        setNewProperty({...newProperty, status: checked ? "active" : "draft"})
                      }
                    />
                    <Label htmlFor="publish">
                      {newProperty.status === "active" ? "Publish immediately" : "Save as draft"}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Property Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProperty.description || ""}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description of the property..."
                  rows={5}
                  className="mb-6"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setSelectedProperty(null);
                    setActiveTab("listings");
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editMode ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editMode ? "Update Property" : "Add Property"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Seller;