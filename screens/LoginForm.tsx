// src/components/LoginForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string;
}


const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    onSubmit(email, password);
  };

  
        
       
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email" 
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button type="submit" className="w-full">Login</Button>
    </form>
  );
};

export default LoginForm;

