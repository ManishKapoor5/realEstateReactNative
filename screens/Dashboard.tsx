// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";
import UserDashboard from "./UserDashboard";
import LoginForm from "./LoginForm";       
import RegisterForm from "./RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import config from '../config.js'
import Buyer from "./Buyer.js";
import Seller from "./Sell.js";
import AgentDashboard from "./AgentDashboard.js";


// API client for authentication
const authApi = {
  login: async (email:string, password:string) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  getCurrentUser: async (token) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Check if user is already logged in (from localStorage token)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await authApi.getCurrentUser(token);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  const handleLogin = async (email:string, password:string) => {
    try {
      setError("");
      const result = await authApi.login(email, password);
      
      // Store the token
      localStorage.setItem("token", result.token);
      setUser(result.user);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };
  
  const handleRegister = async (userData:any) => {
    try {
      setError("");
      const result = await authApi.register(userData);
      
      // Store the token
      localStorage.setItem("token", result.token);
      setUser(result.user);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If user is logged in, show the appropriate dashboard based on role
  if (user) {
    switch (user.role) {
      case "buyer":
        return <BuyerDashboard user={user} onLogout={handleLogout} />;
      case "seller":
        return <SellerDashboard user={user} onLogout={handleLogout} />;
      default:
        return <AgentDashboard user={user} onLogout={handleLogout} />;
    }
  }
  
  // If not logged in, show login/register form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Property Dashboard</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onSubmit={handleLogin} error={error} />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm onSubmit={handleRegister} error={error} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p>Buyer: buyer@example.com / password123</p>
          <p>Seller: seller@example.com / password123</p>
          <p>Standard User: user@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;